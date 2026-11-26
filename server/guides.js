/**
 * Public guide pages.
 *
 * These exist so that people searching for the questions this tool answers can
 * find it, and so that what they read is accurate and honest about the tool's
 * limits. They are plain data: server/seo.js turns them into HTML that is served
 * as real markup (not a client-rendered shell), which is what search engines
 * index most reliably.
 *
 * Editing rules, learned from how compliance content goes wrong:
 *   - State only what the standard, the card brands or this tool's own question
 *     bank say. Where a requirement belongs to an acquirer or a card brand, say
 *     so and tell the reader to confirm with them.
 *   - Do not promise outcomes or timelines. "Days, not weeks" depends on how
 *     ready the reader's evidence is.
 *   - Say plainly what the tool is: a self-assessment record that helps complete
 *     the official AOC, not an official SAQ or a signed AOC.
 */

export const AUTHOR_LINE = 'Written by Jeff at CKB Secure Data LLC (CISSP, CISA).';
export const CONTACT_EMAIL = 'securedata@ckbsecuredata.com';
export const GUIDES_UPDATED = '2026-11-26';

export const GUIDES = [
  {
    slug: 'saq-d-vs-saq-a',
    title: 'SAQ D vs SAQ A: which PCI self-assessment applies to you?',
    description:
      'SAQ A is for card-not-present merchants who fully outsource card data. SAQ D is the catch-all that also applies to service providers. How to tell which one you need.',
    updated: GUIDES_UPDATED,
    sections: [
      {
        heading: 'The short answer',
        paragraphs: [
          'SAQ A is the shortest PCI DSS self-assessment questionnaire. It is meant for merchants who sell only card-not-present (online, mail order or telephone order) and who have outsourced every part of handling card data to PCI DSS compliant providers. Their own systems never store, process or transmit account data.',
          'SAQ D is the longest, and it is the questionnaire for everyone who does not fit a shorter one. It comes in two forms: SAQ D for Merchants and SAQ D for Service Providers. A service provider that is eligible to complete a self-assessment at all completes SAQ D, because there is no shorter questionnaire for service providers.',
        ],
      },
      {
        heading: 'What makes a business SAQ A',
        paragraphs: [
          'The conditions are cumulative. All of them have to be true, and "most" is not enough:',
        ],
        list: [
          'You accept card-not-present transactions only.',
          'All processing of account data is fully outsourced to PCI DSS validated third-party service providers.',
          'You do not electronically store, process or transmit account data on your own systems or premises.',
          'You have confirmed that each third party handling account data is PCI DSS compliant.',
          'Anything you keep on paper is not received electronically.',
        ],
      },
      {
        heading: 'What pushes a business to SAQ D',
        paragraphs: [
          'A merchant ends up on SAQ D when it does not meet the conditions for a shorter questionnaire. Typical reasons are storing card data electronically, taking payments through more than one channel, or running its own payment page in a way that touches account data.',
          'A service provider ends up on SAQ D because it handles card data on behalf of other organisations, or runs systems that can affect the security of its customers\' card data, and there is no shorter option for it.',
        ],
      },
      {
        heading: 'How to check without guessing',
        paragraphs: [
          'Answer the questions in the free SAQ finder. It asks a handful of questions about how you take payments and tells you which questionnaire applies. Nothing you enter is saved. If the answer is SAQ A, it will say so and this tool will not be the right one for you: SAQ Sprint administers SAQ D only.',
          'Whichever result you get, confirm it with your acquirer or the card brand that asked you to validate. They decide what they accept, and the PCI Security Standards Council publishes the official questionnaires.',
        ],
      },
    ],
  },
  {
    slug: 'service-provider-pci-levels',
    title: 'PCI service provider levels: when SAQ D for Service Providers applies',
    description:
      'Service providers are split into levels by transaction volume. Level 1 usually needs an assessor; many smaller providers complete SAQ D. What the levels mean and who decides.',
    updated: GUIDES_UPDATED,
    sections: [
      {
        heading: 'Who counts as a service provider',
        paragraphs: [
          'A service provider is a business that stores, processes or transmits cardholder data on behalf of other organisations, or that manages systems that could affect the security of that data. Hosting and managed IT providers, payment gateways and payment facilitators, billing and invoicing software, and marketplaces that handle payments for their sellers are common examples.',
          'This is different from a merchant, which accepts cards in exchange for its own goods or services. A company can be both, and then both sets of obligations apply.',
        ],
      },
      {
        heading: 'Levels are set by volume and by who asks',
        paragraphs: [
          'The card brands group service providers into levels by annual transaction volume. Visa and Mastercard both use 300,000 transactions a year as the dividing line between the top two levels, but the exact definitions, and what each level must submit, are theirs to set and they change.',
          'In general, a Level 1 service provider is expected to have a full on-site assessment by a Qualified Security Assessor and to submit a Report on Compliance with an Attestation of Compliance. A provider below that threshold is commonly asked to complete SAQ D for Service Providers and submit the Attestation of Compliance. Confirm your level and your obligations with each card brand and acquirer you work with, and with the customers asking for evidence.',
        ],
      },
      {
        heading: 'Why a smaller provider is often on SAQ D',
        paragraphs: [
          'There is no shorter questionnaire for service providers. SAQ A, B, C and the others are written for merchants. So a service provider that is allowed to self-assess completes SAQ D, which covers the full set of PCI DSS requirements that apply to it. SAQ Sprint\'s service provider edition covers 260 requirements.',
        ],
      },
      {
        heading: 'What SAQ Sprint does and does not do',
        paragraphs: [
          'SAQ Sprint is a guided self-assessment: it walks through each requirement, scores the answers pass or fail, and produces a gap report and an attestation summary that helps you complete the official Attestation of Compliance. It produces a self-assessment record. It is not an official SAQ and it is not a signed AOC, and it does not replace an assessor where one is required.',
        ],
      },
    ],
  },
  {
    slug: 'customer-asked-for-your-aoc',
    title: 'A customer asked for your PCI AOC: what to do this week',
    description:
      'An enterprise customer or acquirer has asked for your PCI Attestation of Compliance. A practical sequence for the first week, without overclaiming compliance.',
    updated: GUIDES_UPDATED,
    sections: [
      {
        heading: 'Start by finding out exactly what they need',
        paragraphs: [
          'Reply to the request and ask what the customer actually requires: an Attestation of Compliance, a Report on Compliance, a completed SAQ, or a security questionnaire that mentions PCI. They are different documents with different effort. Ask which PCI DSS version and by when.',
        ],
      },
      {
        heading: 'Work out your scope',
        paragraphs: [
          'Decide whether you are a service provider for this customer, a merchant, or both, and what you actually do with account data: store it, process it, transmit it, or only run systems that could affect its security. Write down the systems, people and providers involved. Scope is the part that most often changes the amount of work.',
        ],
      },
      {
        heading: 'Collect what you already have',
        paragraphs: [
          'Gather any earlier AOC, penetration test, vulnerability scan, policies, network diagrams and access reviews. Ask your cloud and hosting providers for their own AOCs and for their shared responsibility summaries. You may be able to rely on a provider for some requirements, but only where its AOC covers the service you use.',
        ],
      },
      {
        heading: 'Choose the route',
        paragraphs: [
          'If the card brands and your customer accept a self-assessment for a provider of your size, that means SAQ D for Service Providers. If you fall under the top level, or the customer insists, you will need a Qualified Security Assessor. Do not guess: ask.',
        ],
      },
      {
        heading: 'Tell the customer where you are',
        paragraphs: [
          'Send a short status with a realistic date rather than a general statement that you are compliant. Do not write your own letter claiming compliance. The AOC is a signed attestation by an authorised officer of your company, and it is only as good as the assessment behind it.',
        ],
      },
      {
        heading: 'How long it takes',
        paragraphs: [
          'It depends almost entirely on how much evidence you can put your hands on. A team with current policies, scans and access records can move quickly. A team starting from nothing cannot.',
        ],
      },
    ],
  },
];

export function findGuide(slug) {
  return GUIDES.find((g) => g.slug === slug) || null;
}
