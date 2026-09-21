/**
 * SAQ eligibility routing for PCI DSS v4.0.1.
 *
 * The questionnaire a merchant or service provider must complete is decided by
 * how they accept payments and what account data they hold, not by preference.
 * This module encodes that decision as a tree walked identically by the public
 * wizard, the client flow, and the server — the server always recomputes the
 * outcome from the recorded answers rather than trusting one sent to it.
 */

/**
 * The SAQs a client can be routed to.
 *
 * `variant` is set only for the two questionnaires this tool administers; every
 * other type routes to an explanation. Adding a bank later means setting
 * `variant` here and building the matching question modules — the tree is
 * unchanged.
 */
export const SAQ_TYPES = {
  A: {
    key: 'A',
    name: 'SAQ A',
    headline: 'Card-not-present merchants, all account data functions fully outsourced',
    summary:
      'For e-commerce and mail/telephone-order merchants who have outsourced every part of handling card data to PCI DSS compliant providers, and who never store, process, or transmit account data on their own systems.',
    eligibility: [
      'You accept card-not-present transactions only — e-commerce, mail order, or telephone order.',
      'All processing of account data is entirely outsourced to PCI DSS validated third-party service providers.',
      'You do not electronically store, process, or transmit any account data on your own systems or premises.',
      'You have confirmed that every third party handling account data is PCI DSS compliant.',
      'Any account data you retain is on paper, and those documents are not received electronically.',
      'For e-commerce: every element of every payment page is delivered from a PCI DSS compliant provider, either by redirect or by an iframe served entirely by that provider.',
    ],
    scope: 'The shortest SAQ. It still covers script and tamper-detection controls for payment pages (6.4.3 and 11.6.1), which v4.0 added for redirect and iframe setups.',
    variant: null,
  },
  'A-EP': {
    key: 'A-EP',
    name: 'SAQ A-EP',
    headline: 'E-commerce merchants whose website affects the payment, but never receives card data',
    summary:
      'For e-commerce merchants who partially outsource payment processing, where the merchant website does not itself receive account data but can affect the security of the transaction — for example a Direct Post integration or a provider’s JavaScript embedded in your own page.',
    eligibility: [
      'You accept e-commerce transactions only.',
      'All payment processing is outsourced to a PCI DSS validated third-party service provider.',
      'Your website does not receive account data, but it does control or affect how account data is sent to the provider.',
      'You do not electronically store, process, or transmit any account data on your own systems.',
      'You have confirmed that every third party handling account data is PCI DSS compliant.',
    ],
    scope:
      'Substantially longer than SAQ A, because your website is in scope: it covers secure development, vulnerability management, access control, logging, and scanning for the systems that serve your payment page.',
    variant: null,
  },
  B: {
    key: 'B',
    name: 'SAQ B',
    headline: 'Imprint machines or standalone dial-out terminals, no electronic storage',
    summary:
      'For merchants who take card-present payments using only manual imprint machines or standalone dial-out terminals, with no electronic storage of account data. Not for e-commerce.',
    eligibility: [
      'You use only imprint machines, or only standalone dial-out terminals connected by a phone line.',
      'The terminals are not connected to any other system in your environment and not connected to the internet.',
      'You do not store account data electronically — any retained data is on paper.',
      'You do not accept card-not-present transactions.',
    ],
    scope: 'A short SAQ, focused on physical security, media handling, and policy rather than network controls.',
    variant: null,
  },
  'B-IP': {
    key: 'B-IP',
    name: 'SAQ B-IP',
    headline: 'Standalone PTS-approved terminals with an IP connection, no electronic storage',
    summary:
      'For merchants using only standalone, PTS-approved payment terminals that connect to the payment processor over IP, with no electronic storage of account data. Not for e-commerce.',
    eligibility: [
      'You use only standalone, PTS-approved payment terminals with an IP connection to your processor.',
      'The terminals are not connected to any other system in your environment.',
      'The only transmission of account data is from the PTS-approved terminal to the payment processor.',
      'You do not store account data electronically.',
      'You do not accept card-not-present transactions.',
    ],
    scope:
      'Longer than SAQ B, because the IP connection brings network security, patching, and vulnerability scanning controls into scope.',
    variant: null,
  },
  C: {
    key: 'C',
    name: 'SAQ C',
    headline: 'Payment application systems connected to the internet, no electronic storage',
    summary:
      'For merchants with a payment application or point-of-sale system connected to the internet, isolated from any other system, with no electronic storage of account data. Not for e-commerce.',
    eligibility: [
      'You have a payment application system connected to the internet.',
      'The payment application system is not connected to any other system in your environment.',
      'Your business location is not connected to other locations, and any LAN is for a single location only.',
      'You do not store account data electronically.',
      'You do not accept card-not-present transactions.',
    ],
    scope:
      'One of the longer SAQs. Because a general-purpose system handles card data, most technical controls apply — configuration, access control, logging, scanning, and secure software.',
    variant: null,
  },
  'C-VT': {
    key: 'C-VT',
    name: 'SAQ C-VT',
    headline: 'Manually keyed transactions into a hosted virtual terminal',
    summary:
      'For merchants who enter one transaction at a time by keyboard into an internet-based virtual terminal hosted by a PCI DSS validated provider, with no electronic storage of account data. Not for e-commerce.',
    eligibility: [
      'Your only payment processing is via a virtual terminal accessed by browser, provided and hosted by a PCI DSS validated third party.',
      'Transactions are entered one at a time, manually, by keyboard.',
      'The computer used for the virtual terminal is not connected to any other system in your environment.',
      'You do not store account data electronically and do not use any device that reads cards.',
      'You do not accept e-commerce transactions.',
    ],
    scope:
      'A mid-length SAQ, covering the workstation used for the virtual terminal: its configuration, access control, anti-malware, and patching.',
    variant: null,
  },
  P2PE: {
    key: 'P2PE',
    name: 'SAQ P2PE',
    headline: 'Hardware terminals in a validated, PCI SSC-listed P2PE solution',
    summary:
      'For merchants who take card-present payments only through hardware terminals that form part of a validated point-to-point encryption solution listed by the PCI SSC, with no electronic storage of account data.',
    eligibility: [
      'All payment processing is via hardware terminals included in a validated, PCI SSC-listed P2PE solution.',
      'The solution provider manages the terminals and the encryption keys; you have no ability to decrypt account data.',
      'You follow the solution provider’s P2PE Instruction Manual (PIM).',
      'You do not store account data electronically.',
      'You do not accept card-not-present transactions.',
    ],
    scope:
      'One of the shortest SAQs, because the validated P2PE solution takes most of the technical controls out of your scope. Physical device security and policy remain.',
    variant: null,
  },
  SPoC: {
    key: 'SPoC',
    name: 'SAQ SPoC',
    headline: 'A phone or tablet with a card reader, in a PCI SSC-listed SPoC solution',
    summary:
      'For merchants who take card-present payments using a commercial off-the-shelf mobile device with a secure card reader, as part of a validated SPoC (Software-based PIN entry on COTS) solution listed by the PCI SSC.',
    eligibility: [
      'All payment processing uses a PCI SSC-listed SPoC solution — a commercial phone or tablet with a secure card reader (SCRP).',
      'The card reader and solution are managed by the solution provider.',
      'You do not store account data electronically.',
      'You do not accept card-not-present transactions.',
    ],
    scope: 'A short SAQ, covering device handling, the mobile device itself, and policy.',
    variant: null,
  },
  'D-Merchant': {
    key: 'D-Merchant',
    name: 'SAQ D for Merchants',
    headline: 'All merchants not eligible for any other SAQ',
    summary:
      'The full questionnaire, covering all twelve PCI DSS requirements. It applies to any merchant who stores account data electronically, uses more than one acceptance channel, or otherwise does not meet the criteria for a shorter SAQ.',
    eligibility: [
      'You are a merchant eligible to self-assess rather than undergo an on-site assessment.',
      'You do not qualify for any of the shorter SAQ types.',
    ],
    scope: 'All twelve requirements — 235 applicable questions in this tool.',
    variant: 'merchant',
  },
  'D-ServiceProvider': {
    key: 'D-ServiceProvider',
    name: 'SAQ D for Service Providers',
    headline: 'Service providers eligible to self-assess',
    summary:
      'The full questionnaire for service providers, covering all twelve PCI DSS requirements plus the requirements that apply only to service providers, and Appendix A1 for multi-tenant providers.',
    eligibility: [
      'You are a service provider that a payment brand has defined as eligible to complete an SAQ.',
      'You store, process, or transmit account data on behalf of other organisations, or could affect the security of their cardholder data.',
    ],
    scope:
      'All twelve requirements plus the service-provider-only requirements and Appendix A1 — 260 applicable questions in this tool.',
    variant: 'service-provider',
  },
  'review-needed': {
    key: 'review-needed',
    name: 'Needs review with your assessor',
    headline: 'Your answers do not point to a single SAQ',
    summary:
      'Something in your setup needs confirming before the right questionnaire can be chosen — usually the technical detail of how your payment page or payment systems are integrated. This is normal, and it is better established now than part-way through the wrong questionnaire.',
    eligibility: [],
    scope:
      'Your assessor will confirm the detail with whoever maintains your website or payment systems, and set the correct SAQ for you.',
    variant: null,
  },
};

/** Every SAQ type that this tool can actually administer. */
export const ADMINISTERED_SAQ_TYPES = Object.values(SAQ_TYPES)
  .filter((type) => type.variant)
  .map((type) => type.key);

export const FIRST_STEP = 'entity-type';

/**
 * The decision tree. Each option either routes to another step (`next`) or
 * settles on an SAQ (`outcome`). `note` is carried onto the result to explain
 * a consequence the option itself implies.
 */
export const ELIGIBILITY_STEPS = {
  'entity-type': {
    id: 'entity-type',
    question: 'Which best describes your organisation?',
    help: 'This is the first thing that determines which questionnaire applies to you.',
    options: [
      {
        value: 'merchant',
        label: 'A merchant',
        description: 'You accept payment cards for your own goods or services.',
        next: 'storage',
      },
      {
        value: 'service-provider',
        label: 'A service provider',
        description:
          'You store, process, or transmit account data on behalf of other organisations, or your services could affect the security of their cardholder data — for example hosting, a payment gateway, or managed IT services.',
        outcome: 'D-ServiceProvider',
      },
      {
        value: 'both',
        label: 'Both',
        description:
          'You accept cards for your own sales and you also handle other organisations’ account data.',
        outcome: 'D-ServiceProvider',
        note: 'You are acting as both a merchant and a service provider. Your service provider activity is assessed here; your own card acceptance needs a separate merchant assessment, and your assessor will confirm how the two fit together.',
      },
    ],
  },

  storage: {
    id: 'storage',
    question: 'Do you store account data electronically, anywhere, on any system?',
    help:
      'Account data means the full card number (PAN) together with any cardholder data or sensitive authentication data. Include databases, spreadsheets, CRM records, order systems, call recordings, log files, email, and backups. Card data kept only on paper does not count here.',
    options: [
      {
        value: 'no',
        label: 'No, we never store account data electronically',
        description: 'Nothing on our systems holds card numbers, in any form, at any point.',
        next: 'channel',
      },
      {
        value: 'yes',
        label: 'Yes, we store account data electronically',
        description: 'Card numbers are held on at least one of our systems.',
        outcome: 'D-Merchant',
        note: 'Electronic storage of account data rules out every shorter SAQ, whatever else is true of your setup. SAQ D is the only option.',
      },
      {
        value: 'unsure',
        label: 'We are not certain',
        description: 'We think not, but we have not confirmed where card data could be held.',
        outcome: 'D-Merchant',
        note: 'Unconfirmed storage has to be treated as storage, so this routes to SAQ D. It is also worth acting on directly: a data discovery exercise across your systems, backups and call recordings often finds card data nobody expected, and if it comes back clean you may qualify for a shorter SAQ.',
      },
    ],
  },

  channel: {
    id: 'channel',
    question: 'How do your customers pay you?',
    help: 'If you take payments in more than one way, choose the last option — it changes which questionnaire applies.',
    options: [
      {
        value: 'ecommerce',
        label: 'Online only',
        description: 'Customers enter their card details on a website.',
        next: 'ecommerce-integration',
      },
      {
        value: 'moto',
        label: 'By post or over the phone only',
        description: 'Customers give their card details by mail order or telephone order (MOTO).',
        next: 'moto-method',
      },
      {
        value: 'card-present',
        label: 'In person only',
        description: 'Cards are presented in person and swiped, inserted, or tapped on a terminal.',
        next: 'cp-equipment',
      },
      {
        value: 'multiple',
        label: 'More than one of these',
        description: 'For example a shop and a website, or in person and over the phone.',
        outcome: 'D-Merchant',
        note: 'Each acceptance channel has its own eligibility rules, so no single shorter SAQ covers a mixed setup. You have two options: complete SAQ D once, covering everything, or complete a separate SAQ for each channel. SAQ D is usually simpler to manage; your assessor can advise which suits you.',
      },
    ],
  },

  'ecommerce-integration': {
    id: 'ecommerce-integration',
    question: 'How is the payment page delivered to your customers?',
    help:
      'This is the single most consequential question for an online merchant, and the one most often answered wrongly. If you are not certain, ask whoever maintains your website before choosing.',
    options: [
      {
        value: 'redirect-iframe',
        label: 'Redirect or iframe, served entirely by our provider',
        description:
          'Customers are sent to the payment provider’s own page, or the payment form is an iframe served wholly by the provider. Your website never receives card data and does not control the payment form.',
        next: 'tpsp-a',
      },
      {
        value: 'influences-page',
        label: 'Our website affects the payment form, but never receives card data',
        description:
          'Your own page creates, controls, or posts the payment form — for example a Direct Post integration, or the provider’s JavaScript library embedded in a page you serve. Card data goes straight to the provider, but your site shapes how.',
        next: 'tpsp-aep',
      },
      {
        value: 'receives-data',
        label: 'Card details reach our own systems',
        description: 'Card details are submitted to, or pass through, your own web server or application.',
        outcome: 'D-Merchant',
        note: 'Once account data touches your own systems, those systems are in the cardholder data environment and the full questionnaire applies.',
      },
      {
        value: 'unsure',
        label: 'We are not sure which of these describes our site',
        description: 'The distinction depends on technical detail we would need to check.',
        outcome: 'review-needed',
        note: 'The difference between a provider-served iframe and a page your own code controls decides between the shortest SAQ and one several times longer, so it is worth confirming rather than guessing. Whoever maintains your website can answer it by looking at how the payment form is loaded.',
      },
    ],
  },

  'tpsp-a': {
    id: 'tpsp-a',
    question: 'Have you confirmed that every third party handling your customers’ card data is PCI DSS compliant?',
    help:
      'Confirmed means you hold a current Attestation of Compliance from each provider, or you have found them on the relevant payment brand’s list of validated providers. Taking their word for it does not count.',
    options: [
      {
        value: 'yes',
        label: 'Yes, and we hold evidence of it',
        description: 'We have a current AOC, or have verified each provider on a payment brand list.',
        outcome: 'A',
      },
      {
        value: 'no',
        label: 'No, or we have not checked',
        description: 'We have not obtained or verified their compliance evidence.',
        outcome: 'D-Merchant',
        note: 'Confirmed provider compliance is a condition of SAQ A, so this routes to SAQ D for now. It is usually quick to fix: request each provider’s current AOC. Once you hold that evidence you may well qualify for SAQ A, and Requirement 12.8.4 obliges you to monitor it at least every 12 months regardless.',
      },
    ],
  },

  'tpsp-aep': {
    id: 'tpsp-aep',
    question: 'Have you confirmed that every third party handling your customers’ card data is PCI DSS compliant?',
    help:
      'Confirmed means you hold a current Attestation of Compliance from each provider, or you have found them on the relevant payment brand’s list of validated providers.',
    options: [
      {
        value: 'yes',
        label: 'Yes, and we hold evidence of it',
        description: 'We have a current AOC, or have verified each provider on a payment brand list.',
        outcome: 'A-EP',
      },
      {
        value: 'no',
        label: 'No, or we have not checked',
        description: 'We have not obtained or verified their compliance evidence.',
        outcome: 'D-Merchant',
        note: 'Confirmed provider compliance is a condition of SAQ A-EP, so this routes to SAQ D for now. Request each provider’s current AOC; once you hold that evidence you may qualify for SAQ A-EP.',
      },
    ],
  },

  'moto-method': {
    id: 'moto-method',
    question: 'How are card details captured when a customer orders by post or phone?',
    help: 'Choose the option that matches how the card number actually reaches your payment provider.',
    options: [
      {
        value: 'passed-through',
        label: 'Straight to our provider, never to us',
        description:
          'The call is transferred to the payment provider, or an automated phone system hosted by them takes the card details. Your staff and systems never see or handle the card number.',
        next: 'tpsp-a',
      },
      {
        value: 'virtual-terminal',
        label: 'Typed into a virtual terminal hosted by our provider',
        description:
          'Staff enter card details one transaction at a time into a web-based virtual terminal that the payment provider hosts.',
        next: 'tpsp-vt',
      },
      {
        value: 'own-system',
        label: 'Entered into our own system or application',
        description: 'Card details are keyed into software you run, or into an order system of your own.',
        outcome: 'D-Merchant',
        note: 'Entering card data into your own system puts that system in the cardholder data environment, so the full questionnaire applies.',
      },
    ],
  },

  'tpsp-vt': {
    id: 'tpsp-vt',
    question: 'Is the virtual terminal provided and hosted by a PCI DSS validated third party, and have you confirmed it?',
    help:
      'SAQ C-VT requires the virtual terminal to be hosted by a validated provider. Confirmed means you hold a current Attestation of Compliance from them, or you have found them on the relevant payment brand\u2019s list of validated providers.',
    options: [
      {
        value: 'yes',
        label: 'Yes, and we hold evidence of it',
        description: 'We have a current AOC, or have verified the provider on a payment brand list.',
        next: 'vt-isolation',
      },
      {
        value: 'no',
        label: 'No, or we have not checked',
        description: 'The terminal is self-hosted, or we have not obtained the provider\u2019s compliance evidence.',
        outcome: 'D-Merchant',
        note: 'A validated hosting provider is a condition of SAQ C-VT, so this routes to SAQ D for now. If the terminal is hosted by a third party, request their current AOC \u2014 once you hold it you may qualify for SAQ C-VT. If you host it yourself, SAQ D is correct.',
      },
    ],
  },

  'vt-isolation': {
    id: 'vt-isolation',
    question: 'Is the computer used for the virtual terminal isolated from your other systems?',
    help:
      'SAQ C-VT requires that the machine used to key transactions is not connected to any other system or location in your business, and that no card-reading device is attached to it.',
    options: [
      {
        value: 'yes',
        label: 'Yes, it is isolated and has no card reader attached',
        description: 'It is used for the virtual terminal and is not connected to our other systems.',
        outcome: 'C-VT',
      },
      {
        value: 'no',
        label: 'No, it is a normal machine on our network',
        description: 'It is connected to other systems, or has a card-reading device attached.',
        outcome: 'D-Merchant',
        note: 'Isolation of the virtual terminal workstation is a condition of SAQ C-VT. Without it, the surrounding network is in scope and the full questionnaire applies.',
      },
    ],
  },

  'cp-equipment': {
    id: 'cp-equipment',
    question: 'What do you use to take card payments in person?',
    help: 'If more than one of these applies, choose the last option.',
    options: [
      {
        value: 'p2pe',
        label: 'Terminals in a validated P2PE solution',
        description:
          'Hardware terminals that are part of a point-to-point encryption solution listed by the PCI SSC, managed by the solution provider, where you cannot decrypt account data.',
        outcome: 'P2PE',
      },
      {
        value: 'spoc',
        label: 'A phone or tablet with a card reader, in a listed SPoC solution',
        description:
          'A commercial off-the-shelf mobile device with a secure card reader, as part of a PCI SSC-listed SPoC solution.',
        outcome: 'SPoC',
      },
      {
        value: 'standalone-ip',
        label: 'Standalone PTS-approved terminals on an internet connection',
        description:
          'Standalone terminals with an IP connection to your processor, not connected to any other system of yours.',
        outcome: 'B-IP',
      },
      {
        value: 'standalone-dialout',
        label: 'Dial-out terminals or imprint machines',
        description:
          'Terminals that dial out over a phone line, or manual imprint machines. No internet connection at all.',
        outcome: 'B',
      },
      {
        value: 'integrated-pos',
        label: 'A till or point-of-sale system connected to the internet',
        description: 'An electronic point-of-sale or payment application running on systems you operate.',
        next: 'pos-isolation',
      },
      {
        value: 'mixed',
        label: 'Several of these, or something else',
        description: 'Your setup uses more than one of the above, or none of them describes it.',
        outcome: 'D-Merchant',
        note: 'The shorter card-present SAQs each assume one specific kind of equipment used on its own. A mixed estate does not meet any of them, so SAQ D applies.',
      },
    ],
  },

  'pos-isolation': {
    id: 'pos-isolation',
    question: 'Is the payment application system isolated from the rest of your business?',
    help:
      'SAQ C requires that the payment application system is not connected to any other system you run, and that the location is not connected to other locations.',
    options: [
      {
        value: 'yes',
        label: 'Yes, it is isolated',
        description:
          'The payment system is not connected to any other system of ours, and this location is not connected to other sites.',
        outcome: 'C',
      },
      {
        value: 'no',
        label: 'No, it is connected to other systems or sites',
        description:
          'It shares a network with other systems, or our locations are connected to each other.',
        outcome: 'D-Merchant',
        note: 'Once the payment system shares a network with the rest of the business, those connected systems are in scope too, and the full questionnaire applies.',
      },
    ],
  },
};

/**
 * Walk the tree against a set of answers.
 *
 * Returns either the next question to ask, or the settled outcome together with
 * the trail of questions and answers that produced it. Answers for steps that
 * are no longer on the path (because an earlier answer changed) are ignored, so
 * going back and changing an answer cannot leave a stale branch behind.
 *
 * @param {Record<string, string>} answers keyed by step id
 */
export function determineSaq(answers = {}) {
  const path = [];
  const notes = [];
  const seen = new Set();
  let stepId = FIRST_STEP;

  while (stepId) {
    const step = ELIGIBILITY_STEPS[stepId];
    if (!step) {
      throw new Error(`Unknown eligibility step: ${stepId}`);
    }
    // A cycle would mean a malformed tree; fail loudly rather than hang.
    if (seen.has(stepId)) {
      throw new Error(`Cycle in eligibility tree at step: ${stepId}`);
    }
    seen.add(stepId);

    const value = answers[stepId];
    const option = step.options.find((o) => o.value === value);

    if (!option) {
      return { complete: false, nextStep: step, path, answeredCount: path.length };
    }

    path.push({
      stepId: step.id,
      question: step.question,
      value: option.value,
      label: option.label,
      description: option.description,
    });
    if (option.note) notes.push({ stepId: step.id, note: option.note });

    if (option.outcome) {
      const saq = SAQ_TYPES[option.outcome];
      return {
        complete: true,
        saqType: option.outcome,
        saq,
        variant: saq.variant,
        administered: Boolean(saq.variant),
        path,
        notes,
        determinedAt: new Date().toISOString(),
      };
    }

    stepId = option.next;
  }

  throw new Error('Eligibility tree ended without an outcome.');
}

/**
 * The answers stripped of anything not on the current path. Stored rather than
 * the raw submission, so a record never contains answers to questions the
 * client was not actually asked.
 */
export function prunedAnswers(answers = {}) {
  const result = determineSaq(answers);
  return Object.fromEntries(result.path.map((entry) => [entry.stepId, entry.value]));
}
