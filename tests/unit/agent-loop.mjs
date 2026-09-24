// The advisor's loop, driven by a scripted model rather than a real one.
//
// Nothing here spends money or needs a network: the loop takes its client as an
// argument precisely so that the parts worth testing — what it does with a bad
// tool call, where it stops, what it refuses to save — can be tested at all. A
// real model would also give a different answer every run, which is the wrong
// shape for a regression suite.
import { scoreAssessment } from '../../shared/scoring.js';
import { getQuestions } from '../../shared/questions/index.js';
import { runRemediationAgent } from '../../server/agent/runtime.js';

const fails = [];
const ck = (l, c, x = '') => {
  console.log(`  ${c ? 'PASS' : 'FAIL'}  ${l}${x ? ' -> ' + x : ''}`);
  if (!c) fails.push(l);
};

const VARIANT = 'merchant';
const questions = getQuestions(VARIANT);
// Three real requirement ids, so nothing here depends on the bank's contents
// beyond there being at least three of them.
const [GAP_A, GAP_B] = [questions[0].id, questions[1].id];
const PASSING = questions[2].id;

const answers = {};
for (const q of questions) answers[q.id] = { response: 'yes', justification: '', evidence: '' };
answers[GAP_A] = { response: 'no', justification: 'Vendor selected, rollout planned for Q3.', evidence: '' };
answers[GAP_B] = { response: 'no', justification: '', evidence: '' };

const scored = scoreAssessment(VARIANT, answers);
const assessment = {
  id: '00000000-0000-4000-8000-000000000001',
  client_name: 'Northwind Retail',
  dba: null,
  variant: VARIANT,
  saq_type: 'D-Merchant',
  scope_summary: 'A single ecommerce platform.',
  status: 'in-progress',
  answers_revision: '7',
  generation: '0',
};

/**
 * A model that replies from a script.
 *
 * Each entry is one turn. `stream()` is what the runtime calls, so the fake
 * implements that shape and records the request it was given — which is how the
 * ordering assertions below see what the loop actually sent.
 */
function scriptedClient(turns) {
  const requests = [];
  let turn = 0;
  const stream = (request) => {
    // Copied, not captured: the runtime mutates one messages array across the
    // whole run, so holding the reference would make every recorded request
    // look like the last one.
    requests.push({ ...request, messages: [...request.messages] });
    const scripted = turns[Math.min(turn, turns.length - 1)];
    turn += 1;
    const message = typeof scripted === 'function' ? scripted(request) : scripted;
    return { finalMessage: async () => message };
  };
  const client = { messages: { stream }, beta: { messages: { stream } }, requests, turnsUsed: () => turn };
  return client;
}

const toolUse = (name, input, id = `tu_${Math.random().toString(16).slice(2)}`) => ({
  type: 'tool_use',
  id,
  name,
  input,
});
const turn = (content, stop_reason = 'tool_use') => ({
  content,
  stop_reason,
  usage: { input_tokens: 100, output_tokens: 50 },
});
const item = (questionId, priority) => ({
  question_id: questionId,
  priority,
  summary: `Close the gap at ${questionId}.`,
  steps: '1. Do the thing.\n2. Check the thing.',
  evidence: 'Configuration export.',
  effort: '2 weeks',
  owner_role: 'IT operations',
  related: '',
});

async function run(turns) {
  const client = scriptedClient(turns);
  const result = await runRemediationAgent({ assessment, scored, client });
  return { result, client };
}

async function expectFailure(label, turns, pattern) {
  try {
    await run(turns);
    ck(label, false, 'it returned a plan instead of failing');
  } catch (err) {
    ck(label, pattern.test(err.message), err.message);
  }
}

console.log('== a normal drafting run ==');
{
  const { result, client } = await run([
    turn([{ type: 'thinking', thinking: 'Start from the gap list.' }, toolUse('list_gaps', {})]),
    turn([toolUse('get_requirement', { id: GAP_A }), toolUse('get_requirement', { id: GAP_B })]),
    // Priorities out of order on purpose: the loop, not the model, is
    // responsible for the order the assessor sees.
    turn([toolUse('save_remediation_item', item(GAP_B, 2)), toolUse('save_remediation_item', item(GAP_A, 1))]),
    turn([{ type: 'text', text: 'Two gaps, both in access control. Start with the first.' }], 'end_turn'),
  ]);

  ck('an item is produced for every gap', result.items.length === 2, `${result.items.length}`);
  ck('items come back in priority order', result.items[0].question_id === GAP_A);
  ck('no gap is left unaddressed', result.unaddressed.length === 0, result.unaddressed.join(', '));
  ck('the closing text becomes the overview', result.overview.startsWith('Two gaps'));
  ck('token usage is accumulated across turns', result.usage.output_tokens === 200, String(result.usage.output_tokens));
  ck('the run reports how many turns it took', result.iterations === 4, String(result.iterations));
  ck('the transcript holds one entry per turn', result.transcript.length === 4);
  ck('the transcript records the reasoning it was given', result.transcript[0].reasoning === 'Start from the gap list.');
  ck(
    'the transcript records each tool call and its result',
    result.transcript[1].calls.length === 2 && result.transcript[1].calls.every((c) => c.ok)
  );

  // Two tool calls in one assistant turn have to come back as two results in
  // one user message. Splitting them teaches a model to stop calling tools in
  // parallel, which costs turns on every run after.
  const parallelResults = client.requests[2].messages.filter(
    (m) => m.role === 'user' && Array.isArray(m.content) && m.content.length === 2
  );
  ck('parallel tool results are returned in a single user message', parallelResults.length === 1);
  ck('the assistant turn is echoed back whole, thinking included', client.requests[1].messages[1].role === 'assistant');
  ck('the brief is cached rather than resent uncached', client.requests[0].system[0].cache_control?.type === 'ephemeral');
  ck('the advisor is not given a tool that writes an answer',
     client.requests[0].tools.every((t) => !/answer|submit|eligib|determin/i.test(t.name)),
     client.requests[0].tools.map((t) => t.name).join(', '));
}

console.log('\n-- what the advisor is not allowed to save --');
{
  const { result } = await run([
    // A requirement this entity passed is not a gap, so there is nothing to
    // remediate and the call is refused rather than quietly stored.
    turn([toolUse('save_remediation_item', item(PASSING, 1))]),
    turn([toolUse('save_remediation_item', item(GAP_A, 1))]),
    turn([toolUse('save_remediation_item', item(GAP_B, 2))]),
    turn([{ type: 'text', text: 'Done.' }], 'end_turn'),
  ]);
  ck('an item for a requirement that passed is refused', result.items.length === 2);
  ck('and the refusal is recorded as a failed call', result.transcript[0].calls[0].ok === false);
  ck('the refusal says what to do instead', /not one of the gaps/.test(result.transcript[0].calls[0].result));
}

{
  const { result } = await run([
    turn([toolUse('get_requirement', { id: '99.99.99' })]),
    turn([toolUse('update_answer', { id: GAP_A, response: 'yes' })]),
    turn([toolUse('save_remediation_item', { ...item(GAP_A, 1), steps: 'x'.repeat(99_999) })]),
    turn([toolUse('save_remediation_item', item(GAP_A, 1))]),
    turn([{ type: 'text', text: 'Done.' }], 'end_turn'),
  ]);
  ck('a requirement id that does not exist is an error, not a crash',
     /no requirement/.test(result.transcript[0].calls[0].result));
  ck('a tool the advisor does not have is refused by name',
     /no tool called .{0,2}update_answer/.test(result.transcript[1].calls[0].result),
     result.transcript[1].calls[0].result);
  ck('an oversized field is refused rather than truncated into the database',
     /limit is/.test(result.transcript[2].calls[0].result));
  ck('and the run carries on to produce a plan', result.items.length === 1);
  ck('the gap it never wrote about is reported', result.unaddressed.includes(GAP_B));
}

console.log('\n-- a run that goes wrong ends the run, it does not half-save --');
await expectFailure(
  'a model that never stops calling tools is cut off',
  [turn([toolUse('list_gaps', {})])],
  /still working after \d+ turns/
);
await expectFailure(
  'a model that drafts nothing produces no plan',
  [turn([{ type: 'text', text: 'Looks fine to me.' }], 'end_turn')],
  /finished without drafting anything/
);
await expectFailure(
  'a refusal is reported, not swallowed',
  [{ content: [], stop_reason: 'refusal', stop_details: { category: 'cyber' }, usage: {} }],
  /declined to draft/
);
await expectFailure(
  'a turn cut off by the token limit discards the plan',
  [turn([toolUse('save_remediation_item', item(GAP_A, 1))], 'max_tokens')],
  /output limit/
);

console.log(fails.length ? `\n${fails.length} FAILURES: ${fails}` : '\nAGENT LOOP VERIFIED');
process.exit(fails.length ? 1 : 0);
