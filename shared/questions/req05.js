export default {
  id: 5,
  title: 'Protect All Systems and Networks from Malicious Software',
  goal: 'Maintain a Vulnerability Management Program',
  intro:
    'Malware is code written to get into a system, or damage it, without the owner agreeing to it or knowing about it. Requirement 5 is about keeping defences against it in place and current, since what those defences have to recognise changes constantly.',
  questions: [
    {
      id: '5.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 5 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 5. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 5.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 5 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 5 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.2.1',
      title: 'Anti-malware deployment',
      question:
        'Is anti-malware software running on every system component, apart from those the recurring assessments under Requirement 5.2.3 have found to face no malware risk?',
      requirement:
        'Anti-malware software is installed on every system component. The only exceptions are components that a recurring assessment under Requirement 5.2.3 has concluded are not exposed to malware risk.',
      testing: [
        'Inspect the system components and confirm anti-malware software is present on each one not carved out as free of malware risk.',
        'Read the list of components claimed to face no malware risk, along with the assessments that reached that conclusion.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.2.2',
      title: 'Anti-malware capability',
      question:
        'Does the anti-malware software in use recognise every known class of malware, and does it then remove, block or contain it?',
      requirement:
        'The anti-malware software in use recognises every known class of malware, and deals with each by removing it, blocking it, or containing it.',
      testing: [
        'Read the vendor documentation and inspect the configuration to confirm the software recognises every known class of malware and removes, blocks or contains it.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.2.3',
      title: 'Evaluation of components not at risk',
      question:
        'Where system components are claimed to face no malware risk, is that claim revisited on a recurring basis — keeping a written list of the components concerned, examining how malware threats to them are evolving, and reaching a fresh conclusion on whether they still need no protection?',
      requirement:
        'Components claimed to face no malware risk are reassessed on a recurring basis. Each reassessment covers three things: a written list of every component so claimed; consideration of how malware threats relevant to those components are developing; and a fresh determination of whether each still has no need of anti-malware protection.',
      testing: [
        'Read the documented policies and procedures and confirm a recurring reassessment process is defined.',
        'Ask staff and read the records to confirm the reassessments happen at the interval the entity has set.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if anti-malware is deployed on every in-scope system component and no components are claimed as not at risk.',
    },
    {
      id: '5.2.3.1',
      title: 'Frequency defined by targeted risk analysis',
      question:
        'Is the interval between those reassessments fixed by your own targeted risk analysis, carried out as Requirement 12.3.1 lays down?',
      requirement:
        'The interval at which components claimed to face no malware risk are reassessed is set by the entity’s targeted risk analysis, carried out against every element Requirement 12.3.1 specifies.',
      testing: [
        'Read the entity’s targeted risk analysis and confirm the interval is set and recorded in the way Requirement 12.3.1 demands.',
        'Read the reassessment records and confirm they were carried out at the interval so set.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if no system components are claimed as not at risk for malware.',
    },
    {
      id: '5.3.1',
      title: 'Automatic updates',
      question:
        'Does the anti-malware software update itself automatically, so that it stays current?',
      requirement:
        'The anti-malware software is held at its current state by means of automatic updates.',
      testing: [
        'Inspect the anti-malware configuration, taking in any master installation, and confirm updating happens automatically.',
        'Inspect the system components and confirm the software is switched on and up to date.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.3.2',
      title: 'Scanning or continuous behavioral analysis',
      question:
        'Does the anti-malware software either run scans on a recurring basis together with active or real-time scanning, or else watch system and process behaviour continuously?',
      requirement:
        'The anti-malware software does one of two things: it runs recurring scans and also scans actively or in real time; or it analyses the behaviour of systems or processes continuously.',
      testing: [
        'Inspect the anti-malware configuration and confirm one of those two approaches is in force.',
        'Read the logs or the scan output and confirm the software is actually working.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.3.2.1',
      title: 'Scan frequency defined by risk analysis',
      question:
        'If you satisfy Requirement 5.3.2 by running recurring scans, is the interval between them fixed by your own targeted risk analysis, carried out as Requirement 12.3.1 lays down?',
      requirement:
        'Where recurring malware scans are the means of satisfying Requirement 5.3.2, the interval between them is set by the entity’s targeted risk analysis, carried out against every element Requirement 12.3.1 specifies.',
      testing: [
        'Read the targeted risk analysis and find the scanning interval it sets.',
        'Read the scan records and confirm scans took place at that interval.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if continuous behavioral analysis is used instead of periodic scans.',
    },
    {
      id: '5.3.3',
      title: 'Removable electronic media',
      question:
        'When removable electronic media is put in, plugged in or mounted, does the anti-malware software scan it without being asked — or is behaviour being watched continuously at that moment instead?',
      requirement:
        'For removable electronic media, the anti-malware software does one of two things the moment that media is put in, plugged in, or logically mounted: it scans it automatically; or it is continuously analysing the behaviour of systems or processes at that point.',
      testing: [
        'Inspect the anti-malware configuration and confirm removable electronic media is either scanned or covered by continuous behavioural analysis.',
        'Watch media being inserted and confirm the software behaves as configured.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if the use of removable electronic media is technically prevented on all in-scope system components.',
    },
    {
      id: '5.3.4',
      title: 'Anti-malware audit logs',
      question:
        'Is audit logging switched on for the anti-malware software, and are those logs retained as Requirement 10.5.1 requires?',
      requirement:
        'Audit logging is enabled for the anti-malware software, and the resulting logs are retained on the terms set by Requirement 10.5.1.',
      testing: [
        'Inspect the anti-malware configuration and confirm logging is switched on and that retention matches Requirement 10.5.1.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.3.5',
      title: 'Anti-malware cannot be disabled by users',
      question:
        'Are users unable to switch off or tamper with the anti-malware mechanisms, other than where management has documented and authorised a specific exception for a bounded period?',
      requirement:
        'Users cannot switch off or alter the anti-malware mechanisms. The sole exception is where management has documented and authorised it for that particular case and for a limited period.',
      testing: [
        'Inspect the anti-malware configuration and confirm users cannot switch it off or alter it.',
        'Ask staff and read the records of any exception that was authorised.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.4.1',
      title: 'Anti-phishing mechanisms',
      question:
        'Are there processes, and automated mechanisms, that spot phishing attacks and shield staff from them?',
      requirement:
        'Processes and automated mechanisms exist that detect phishing attacks and protect personnel against them.',
      testing: [
        'Observe the mechanisms in operation and ask staff, to confirm controls are in place that detect phishing and protect personnel from it.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
