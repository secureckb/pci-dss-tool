import PDFDocument from 'pdfkit';
import { DETERMINATIONS, RESPONSES } from '../shared/scoring.js';
import { VARIANTS } from '../shared/questions/index.js';

const INK = '#1e293b';
const MUTED = '#64748b';
const RULE = '#cbd5e1';
const PASS = '#15803d';
const FAIL = '#b91c1c';
const REVIEW = '#b45309';

function determinationColor(key) {
  if (key === 'compliant') return PASS;
  if (key === 'pending-review') return REVIEW;
  return FAIL;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function startDocument(res, filename) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 54, bufferPages: true });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  doc.pipe(res);
  return doc;
}

function heading(doc, title, subtitle) {
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(18).text(title);
  if (subtitle) {
    doc.moveDown(0.2);
    doc.fillColor(MUTED).font('Helvetica').fontSize(10).text(subtitle);
  }
  doc.moveDown(0.6);
  doc
    .strokeColor(RULE)
    .lineWidth(1)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.8);
}

function sectionTitle(doc, text) {
  ensureSpace(doc, 60);
  doc.moveDown(0.4);
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(12).text(text);
  doc.moveDown(0.3);
}

function labelValue(doc, label, value) {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(9).text(label.toUpperCase(), left, doc.y, { width });
  doc.fillColor(INK).font('Helvetica').fontSize(11).text(value || '—', { width });
  doc.moveDown(0.5);
}

/** Starts a new page when the remaining space would split a block awkwardly. */
function ensureSpace(doc, needed) {
  if (doc.y + needed > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

function determinationBanner(doc, result) {
  const detail = DETERMINATIONS[result.determination];
  const color = determinationColor(result.determination);
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;

  ensureSpace(doc, 110);
  const top = doc.y;
  const bodyHeight = doc.font('Helvetica').fontSize(10).heightOfString(detail.summary, { width: width - 24 });
  const boxHeight = 52 + bodyHeight;

  doc.save();
  doc.roundedRect(left, top, width, boxHeight, 6).fillOpacity(0.07).fill(color);
  doc.restore();
  doc.save();
  doc.roundedRect(left, top, width, boxHeight, 6).strokeColor(color).lineWidth(1).stroke();
  doc.restore();

  doc.fillColor(color).font('Helvetica-Bold').fontSize(14).text(detail.label, left + 12, top + 12, { width: width - 24 });
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(detail.headline, { width: width - 24 });
  doc.moveDown(0.25);
  doc.fillColor(INK).font('Helvetica').fontSize(10).text(detail.summary, { width: width - 24 });

  doc.y = top + boxHeight + 16;
  doc.x = left;
}

function countsTable(doc, result) {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const rows = [
    ['In place (Yes)', result.totals.counts.yes],
    ['Yes with compensating control', result.totals.counts['yes-ccw']],
    ['Not in place (No)', result.totals.counts.no],
    ['Not applicable', result.totals.counts.na],
    ['Unanswered', result.totals.counts.unanswered],
    ['Total applicable requirements', result.totals.total],
  ];

  ensureSpace(doc, rows.length * 18 + 20);
  rows.forEach(([label, value], index) => {
    const y = doc.y;
    const bold = index === rows.length - 1;
    doc
      .fillColor(bold ? INK : MUTED)
      .font(bold ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(10)
      .text(label, left, y, { width: width - 60 });
    doc
      .fillColor(INK)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(String(value), left + width - 60, y, { width: 60, align: 'right' });
    doc.y = y + 16;
  });
  doc.moveDown(0.5);
}

function sectionSummaryTable(doc, result) {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const statusLabels = { pass: 'Pass', fail: 'Fail', review: 'Review', incomplete: 'Incomplete' };
  const statusColors = { pass: PASS, fail: FAIL, review: REVIEW, incomplete: MUTED };

  ensureSpace(doc, 40);
  const headerY = doc.y;
  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8);
  doc.text('REQUIREMENT', left, headerY, { width: width - 200 });
  doc.text('YES', left + width - 200, headerY, { width: 40, align: 'right' });
  doc.text('NO', left + width - 160, headerY, { width: 40, align: 'right' });
  doc.text('N/A', left + width - 120, headerY, { width: 40, align: 'right' });
  doc.text('STATUS', left + width - 70, headerY, { width: 70, align: 'right' });
  doc.y = headerY + 14;
  doc.strokeColor(RULE).lineWidth(0.5).moveTo(left, doc.y).lineTo(left + width, doc.y).stroke();
  doc.y += 6;

  result.sections.forEach((section) => {
    ensureSpace(doc, 30);
    const y = doc.y;
    const label = `${typeof section.id === 'number' ? `Req ${section.id}` : section.id}: ${section.title}`;
    doc.fillColor(INK).font('Helvetica').fontSize(9).text(label, left, y, { width: width - 210, lineBreak: false, ellipsis: true });
    const yesTotal = section.counts.yes + section.counts['yes-ccw'];
    doc.fillColor(INK).font('Helvetica').fontSize(9);
    doc.text(String(yesTotal), left + width - 200, y, { width: 40, align: 'right' });
    doc.fillColor(section.counts.no ? FAIL : INK).text(String(section.counts.no), left + width - 160, y, { width: 40, align: 'right' });
    doc.fillColor(INK).text(String(section.counts.na), left + width - 120, y, { width: 40, align: 'right' });
    doc
      .fillColor(statusColors[section.status])
      .font('Helvetica-Bold')
      .text(statusLabels[section.status], left + width - 70, y, { width: 70, align: 'right' });
    doc.y = y + 15;
  });
  doc.moveDown(0.5);
}

function gapEntry(doc, entry, index, options = {}) {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;
  const accent = options.accent || FAIL;

  ensureSpace(doc, 120);
  const top = doc.y;

  doc.fillColor(accent).font('Helvetica-Bold').fontSize(11).text(`${index}. Requirement ${entry.id}`, left, top, { width });
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(entry.title, { width });
  doc.moveDown(0.3);

  doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8).text('REQUIREMENT', { width });
  doc.fillColor(INK).font('Helvetica').fontSize(9).text(entry.requirement, { width, align: 'justify' });
  doc.moveDown(0.3);

  if (options.responseLabel) {
    doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8).text('RESPONSE', { width });
    doc.fillColor(INK).font('Helvetica').fontSize(9).text(options.responseLabel, { width });
    doc.moveDown(0.3);
  }

  if (entry.justification) {
    doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8).text(options.textLabel || 'CLIENT NOTES', { width });
    doc.fillColor(INK).font('Helvetica').fontSize(9).text(entry.justification, { width });
    doc.moveDown(0.3);
  }

  if (entry.evidence) {
    doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8).text('EVIDENCE REFERENCE', { width });
    doc.fillColor(INK).font('Helvetica').fontSize(9).text(entry.evidence, { width });
    doc.moveDown(0.3);
  }

  doc.moveDown(0.2);
  doc.strokeColor(RULE).lineWidth(0.5).moveTo(left, doc.y).lineTo(left + width, doc.y).stroke();
  doc.moveDown(0.6);
}

function pageNumbers(doc, label) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i += 1) {
    doc.switchToPage(i);
    const bottom = doc.page.height - 38;
    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(8)
      .text(label, doc.page.margins.left, bottom, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        align: 'left',
        lineBreak: false,
      });
    doc.text(`Page ${i - range.start + 1} of ${range.count}`, doc.page.margins.left, bottom, {
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
      align: 'right',
      lineBreak: false,
    });
  }
}

function safeFilename(name, suffix) {
  const base = String(name || 'assessment')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
    .toLowerCase();
  return `${base || 'assessment'}-${suffix}.pdf`;
}

/**
 * One drafted remediation item.
 *
 * Kept visually distinct from the requirement blocks above it, and introduced by
 * a provenance line, because the two have different standing: the requirement
 * text and the client's answer are the record, and this is advice an assessor
 * approved about that record.
 */
function remediationItem(doc, item, index) {
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;

  ensureSpace(doc, 150);
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(11).text(`${index}. Requirement ${item.questionId}`, left, doc.y, { width });
  doc.moveDown(0.2);
  doc.fillColor(INK).font('Helvetica').fontSize(9).text(item.summary, { width, align: 'justify' });
  doc.moveDown(0.4);

  const rows = [
    ['ACTIONS', item.steps],
    ['EVIDENCE TO CLOSE', item.evidence],
    ['RELATED REQUIREMENTS', item.related],
  ];
  for (const [label, value] of rows) {
    if (!value) continue;
    ensureSpace(doc, 40);
    doc.fillColor(MUTED).font('Helvetica-Bold').fontSize(8).text(label, left, doc.y, { width });
    doc.fillColor(INK).font('Helvetica').fontSize(9).text(value, { width });
    doc.moveDown(0.3);
  }

  const meta = [item.ownerRole && `Owner: ${item.ownerRole}`, item.effort && `Estimated effort: ${item.effort}`]
    .filter(Boolean)
    .join('   ·   ');
  if (meta) {
    doc.fillColor(MUTED).font('Helvetica-Oblique').fontSize(8).text(meta, { width });
    doc.moveDown(0.2);
  }

  doc.strokeColor(RULE).lineWidth(0.5).moveTo(left, doc.y).lineTo(left + width, doc.y).stroke();
  doc.moveDown(0.6);
}

/**
 * Full gap remediation report: determination, rollups, and every failed or
 * flagged item.
 *
 * `options.plan` is an approved remediation plan, if one exists. Only an
 * approved plan is ever passed in — a draft the assessor has not signed off on
 * does not belong in a document that leaves the tool.
 */
export function buildGapReport(res, assessment, result, options = {}) {
  const doc = startDocument(res, safeFilename(assessment.client_name, 'pci-dss-saq-d-report'));

  heading(
    doc,
    'PCI DSS v4.0.1 Self-Assessment Report',
    `${VARIANTS[assessment.variant].label} · Generated ${formatDate(new Date())}`
  );

  labelValue(doc, 'Assessed entity', assessment.client_name);
  if (assessment.dba) labelValue(doc, 'Doing business as', assessment.dba);
  labelValue(doc, 'Contact', [assessment.contact_name, assessment.contact_email].filter(Boolean).join(' · '));
  labelValue(
    doc,
    'Status',
    assessment.status === 'submitted'
      ? `Submitted ${formatDate(assessment.submitted_at)}${assessment.submitted_by ? ` by ${assessment.submitted_by}` : ''}`
      : 'In progress — not yet submitted'
  );
  if (assessment.scope_summary) labelValue(doc, 'Scope described by client', assessment.scope_summary);

  doc.moveDown(0.4);
  determinationBanner(doc, result);

  sectionTitle(doc, 'Response summary');
  countsTable(doc, result);

  sectionTitle(doc, 'Result by requirement');
  sectionSummaryTable(doc, result);

  doc.addPage();
  heading(doc, 'Gap remediation plan', 'Every requirement answered "No". Each must be remediated before a compliant attestation can be made.');

  if (result.gaps.length === 0) {
    doc.fillColor(PASS).font('Helvetica-Bold').fontSize(11).text('No requirements were answered "No".');
    doc.moveDown(0.4);
    doc
      .fillColor(INK)
      .font('Helvetica')
      .fontSize(10)
      .text('There are no failed requirements in this assessment.');
  } else {
    result.gaps.forEach((gap, i) => {
      gapEntry(doc, gap, i + 1, { accent: FAIL, textLabel: 'CLIENT NOTES / PLANNED REMEDIATION' });
    });
  }

  const plan = options.plan;
  if (plan && plan.items.length > 0) {
    doc.addPage();
    heading(
      doc,
      'Recommended remediation',
      'Drafted by an AI advisor from the failed requirements above, then reviewed and approved by the assessor.'
    );

    const left = doc.page.margins.left;
    const width = doc.page.width - left - doc.page.margins.right;

    // Provenance, stated before the advice rather than in a footnote. A reader
    // is entitled to know that this section was machine-drafted, which model
    // drafted it, and that a person approved it before it was included.
    doc.save();
    doc.roundedRect(left, doc.y, width, 58, 4).fillOpacity(0.06).fill(REVIEW);
    doc.restore();
    doc
      .fillColor(REVIEW)
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(
        'HOW THIS SECTION WAS PRODUCED. The requirement results in this report are computed directly from the ' +
          'entity\u2019s own answers and contain no AI output. This section alone was drafted by a language model ' +
          `(${plan.model}, brief ${plan.promptVersion}) from those results, and approved by the assessor on ` +
          `${formatDate(plan.reviewedAt)}. It is professional advice to be weighed, not a finding, and it does not ` +
          'affect the compliance determination.',
        left + 10,
        doc.y + 8,
        { width: width - 20 }
      );
    doc.y += 70;
    doc.x = left;

    if (plan.overview) {
      sectionTitle(doc, 'Overview');
      doc.fillColor(INK).font('Helvetica').fontSize(10).text(plan.overview, { width, align: 'justify' });
      doc.moveDown(0.6);
    }

    sectionTitle(doc, 'Items, in the order recommended');
    plan.items.forEach((item, i) => remediationItem(doc, item, i + 1));

    // Said plainly when it happens, rather than leaving a reader to compare two
    // lists and notice the difference themselves.
    const covered = new Set(plan.items.map((item) => item.questionId));
    const missed = result.gaps.filter((gap) => !covered.has(gap.id)).map((gap) => gap.id);
    if (missed.length > 0) {
      ensureSpace(doc, 50);
      doc
        .fillColor(FAIL)
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(
          `No remediation was drafted for ${missed.length} failed requirement(s): ${missed.join(', ')}. ` +
            'They still have to be remediated.',
          { width, align: 'justify' }
        );
      doc.moveDown(0.4);
    }
  }

  if (result.reviewItems.length > 0) {
    doc.addPage();
    heading(
      doc,
      'Items requiring assessor validation',
      'Compensating controls cannot be self-validated. A QSA must review the Appendix C worksheet behind each one.'
    );
    result.reviewItems.forEach((item, i) => {
      gapEntry(doc, item, i + 1, {
        accent: REVIEW,
        responseLabel: RESPONSES[item.response].label,
        textLabel: 'CONTROL DESCRIPTION PROVIDED',
      });
    });
  }

  if (result.naItems.length > 0) {
    doc.addPage();
    heading(
      doc,
      'Requirements marked Not Applicable',
      'Each N/A response and its written justification. An assessor will confirm that each exclusion is legitimate.'
    );
    result.naItems.forEach((item, i) => {
      gapEntry(doc, item, i + 1, { accent: MUTED, responseLabel: 'Not Applicable', textLabel: 'JUSTIFICATION' });
    });
  }

  if (result.unanswered.length > 0) {
    doc.addPage();
    heading(doc, 'Unanswered requirements', 'These requirements have no response and must be completed.');
    const left = doc.page.margins.left;
    const width = doc.page.width - left - doc.page.margins.right;
    result.unanswered.forEach((item) => {
      ensureSpace(doc, 24);
      doc.fillColor(INK).font('Helvetica-Bold').fontSize(9).text(`Requirement ${item.id}`, left, doc.y, { width });
      doc.fillColor(MUTED).font('Helvetica').fontSize(9).text(item.title, { width });
      doc.moveDown(0.3);
    });
  }

  doc.addPage();
  heading(doc, 'About this report', null);
  doc
    .fillColor(INK)
    .font('Helvetica')
    .fontSize(10)
    .text(
      'This report records a self-assessment against the PCI DSS v4.0.1 Self-Assessment Questionnaire D. It reflects the responses ' +
        'provided by the assessed entity and has not been independently validated. It is not an official PCI Security Standards Council ' +
        'document and does not constitute a completed SAQ or Attestation of Compliance. The official SAQ D document and Attestation of ' +
        'Compliance must be obtained from the PCI SSC Document Library, completed, and signed before submission to an acquirer or payment brand.',
      { align: 'justify' }
    );
  doc.moveDown(0.6);
  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(9)
    .text(
      'A "Compliant" determination here means no applicable requirement was answered "No". It does not verify that the answers are accurate, ' +
        'that the described scope is correct, or that supporting evidence exists.',
      { align: 'justify' }
    );
  doc.moveDown(0.5);
  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(9)
    .text(
      options.plan
        ? 'Every requirement result, count and determination in this report is computed directly from the responses given, by fixed rules, ' +
            'with no AI involvement. The "Recommended remediation" section is the one exception: it was drafted by a language model and ' +
            'approved by the assessor before inclusion, and is identified as such where it appears.'
        : 'Every requirement result, count and determination in this report is computed directly from the responses given, by fixed rules. ' +
            'No part of this report was written by an AI model.',
      { align: 'justify' }
    );

  pageNumbers(doc, `${assessment.client_name} · PCI DSS v4.0.1 SAQ D self-assessment report`);
  doc.end();
}

/** AOC-style attestation summary. Explicitly a draft, not a PCI SSC-signed AOC. */
export function buildAttestation(res, assessment, result) {
  const doc = startDocument(res, safeFilename(assessment.client_name, 'pci-dss-attestation-summary'));
  const left = doc.page.margins.left;
  const width = doc.page.width - left - doc.page.margins.right;

  heading(
    doc,
    'Attestation of Compliance — Summary',
    `PCI DSS v4.0.1 · ${VARIANTS[assessment.variant].label} · Generated ${formatDate(new Date())}`
  );

  doc.save();
  doc.roundedRect(left, doc.y, width, 34, 4).fillOpacity(0.08).fill(REVIEW);
  doc.restore();
  doc
    .fillColor(REVIEW)
    .font('Helvetica-Bold')
    .fontSize(9)
    .text(
      'DRAFT — NOT AN OFFICIAL PCI SSC ATTESTATION OF COMPLIANCE. Prepared to support completion of the official AOC document.',
      left + 10,
      doc.y + 11,
      { width: width - 20 }
    );
  doc.y += 46;
  doc.x = left;

  sectionTitle(doc, 'Part 1: Assessed entity information');
  labelValue(doc, 'Company name', assessment.client_name);
  labelValue(doc, 'DBA (doing business as)', assessment.dba);
  labelValue(doc, 'Contact name', assessment.contact_name);
  labelValue(doc, 'Contact email', assessment.contact_email);

  sectionTitle(doc, 'Part 2: Assessment information');
  labelValue(doc, 'SAQ type', VARIANTS[assessment.variant].label);
  labelValue(doc, 'PCI DSS version', '4.0.1');
  labelValue(doc, 'Assessment started', formatDate(assessment.created_at));
  labelValue(doc, 'Assessment submitted', assessment.submitted_at ? formatDate(assessment.submitted_at) : 'Not yet submitted');
  labelValue(doc, 'Scope described by the entity', assessment.scope_summary);

  sectionTitle(doc, 'Part 3: Compliance determination');
  determinationBanner(doc, result);
  countsTable(doc, result);

  doc.addPage();
  heading(doc, 'Part 3a: Result by PCI DSS requirement', null);
  sectionSummaryTable(doc, result);

  sectionTitle(doc, 'Part 3b: Acknowledgement of status');
  doc
    .fillColor(INK)
    .font('Helvetica')
    .fontSize(10)
    .text(
      'The signatory confirms that the responses recorded in this self-assessment accurately reflect the status of the assessed ' +
        'entity’s cardholder data environment as of the date of submission, that the described scope is complete and accurate, and ' +
        'that supporting evidence is available for each requirement marked as in place.',
      { align: 'justify', width }
    );
  doc.moveDown(0.8);

  if (result.determination === 'non-compliant') {
    doc.fillColor(FAIL).font('Helvetica-Bold').fontSize(10).text(
      `${result.totals.counts.no} requirement(s) are not in place. A compliant attestation cannot be signed until each is remediated. ` +
        'The gap remediation plan in the accompanying report lists every failed requirement.',
      { width, align: 'justify' }
    );
    doc.moveDown(0.8);
  } else if (result.determination === 'pending-review') {
    doc.fillColor(REVIEW).font('Helvetica-Bold').fontSize(10).text(
      `${result.totals.counts['yes-ccw']} requirement(s) rely on a compensating control. A Qualified Security ` +
        'Assessor must validate the Appendix C worksheets before this attestation is signed.',
      { width, align: 'justify' }
    );
    doc.moveDown(0.8);
  }

  sectionTitle(doc, 'Part 4: Signature');
  doc.fillColor(MUTED).font('Helvetica').fontSize(9).text(
    assessment.submitted_by
      ? `Submitted electronically by ${assessment.submitted_by}${assessment.submitted_title ? `, ${assessment.submitted_title}` : ''} on ${formatDate(assessment.submitted_at)}.`
      : 'This questionnaire has not been submitted. No electronic attestation has been recorded.',
    { width }
  );
  doc.moveDown(1.2);

  ['Signature of Executive Officer', 'Printed name', 'Title', 'Date'].forEach((label) => {
    ensureSpace(doc, 50);
    const y = doc.y + 18;
    doc.strokeColor(RULE).lineWidth(0.75).moveTo(left, y).lineTo(left + width * 0.62, y).stroke();
    doc.fillColor(MUTED).font('Helvetica').fontSize(8).text(label, left, y + 4, { width });
    doc.y = y + 22;
  });

  doc.moveDown(1);
  doc
    .fillColor(MUTED)
    .font('Helvetica')
    .fontSize(8)
    .text(
      'This summary is generated from a self-assessment and is not an official PCI Security Standards Council Attestation of Compliance. ' +
        'The official AOC form for SAQ D must be obtained from the PCI SSC Document Library, completed in full, signed, and submitted to ' +
        'your acquirer or the applicable payment brand.',
      { width, align: 'justify' }
    );

  pageNumbers(doc, `${assessment.client_name} · PCI DSS v4.0.1 attestation summary (draft)`);
  doc.end();
}
