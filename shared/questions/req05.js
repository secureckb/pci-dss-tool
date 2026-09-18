export default {
  id: 5,
  title: 'Protect All Systems and Networks from Malicious Software',
  goal: 'Maintain a Vulnerability Management Program',
  intro:
    'Malicious software (malware) is software or firmware designed to infiltrate or damage a computer system without the owner’s knowledge or consent. Anti-malware solutions and processes must be maintained to protect systems from current and evolving malware threats.',
  questions: [
    {
      id: '5.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 5 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 5 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 5.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 5 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 5 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.2.1',
      title: 'Anti-malware deployment',
      question:
        'Is an anti-malware solution(s) deployed on all system components, except for those system components identified in periodic evaluations per Requirement 5.2.3 that concluded the system components are not at risk from malware?',
      requirement:
        'An anti-malware solution(s) is deployed on all system components, except for those system components identified in periodic evaluations per Requirement 5.2.3 that concludes the system components are not at risk from malware.',
      testing: [
        'Examine system components to verify that an anti-malware solution is deployed on all system components not identified as not at risk from malware.',
        'Examine the list of system components identified as not at risk from malware and the supporting evaluations.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.2.2',
      title: 'Anti-malware capability',
      question:
        'Does the deployed anti-malware solution(s) detect all known types of malware and remove, block, or contain all known types of malware?',
      requirement:
        'The deployed anti-malware solution(s): detects all known types of malware; removes, blocks, or contains all known types of malware.',
      testing: [
        'Examine vendor documentation and system configurations to verify the anti-malware solution detects all known types of malware and removes, blocks, or contains them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.2.3',
      title: 'Evaluation of components not at risk',
      question:
        'Are any system components that are not at risk for malware evaluated periodically, including a documented list of all system components not at risk, identification and evaluation of evolving malware threats for those components, and confirmation whether such components continue to not require anti-malware protection?',
      requirement:
        'Any system components that are not at risk for malware are evaluated periodically to include: a documented list of all system components not at risk for malware; identification and evaluation of evolving malware threats for those system components; confirmation whether such system components continue to not require anti-malware protection.',
      testing: [
        'Examine documented policies and procedures to verify a process is defined for periodic evaluations.',
        'Interview personnel and examine records to verify the evaluations are performed at the defined frequency.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if anti-malware is deployed on every in-scope system component and no components are claimed as not at risk.',
    },
    {
      id: '5.2.3.1',
      title: 'Frequency defined by targeted risk analysis',
      question:
        'Is the frequency of periodic evaluations of system components identified as not at risk for malware defined in your targeted risk analysis performed according to Requirement 12.3.1?',
      requirement:
        'The frequency of periodic evaluations of system components identified as not at risk for malware is defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1.',
      testing: [
        'Examine the entity’s targeted risk analysis for the frequency of periodic evaluations to verify it is defined and documented per Requirement 12.3.1.',
        'Examine records of evaluations to verify they occur at the defined frequency.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if no system components are claimed as not at risk for malware.',
    },
    {
      id: '5.3.1',
      title: 'Automatic updates',
      question:
        'Is the anti-malware solution(s) kept current via automatic updates?',
      requirement:
        'The anti-malware solution(s) is kept current via automatic updates.',
      testing: [
        'Examine anti-malware solution configurations, including any master installation, to verify the solution is kept current via automatic updates.',
        'Examine system components to verify the solution is enabled and current.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.3.2',
      title: 'Scanning or continuous behavioral analysis',
      question:
        'Does the anti-malware solution(s) perform periodic scans and active or real-time scans, or perform continuous behavioral analysis of systems or processes?',
      requirement:
        'The anti-malware solution(s): performs periodic scans and active or real-time scans, OR performs continuous behavioral analysis of systems or processes.',
      testing: [
        'Examine anti-malware solution configurations to verify the solution performs the required scanning or behavioral analysis.',
        'Examine logs or scan results to verify the solution is active.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.3.2.1',
      title: 'Scan frequency defined by risk analysis',
      question:
        'If periodic malware scans are performed to meet Requirement 5.3.2, is the frequency of scans defined in your targeted risk analysis performed according to Requirement 12.3.1?',
      requirement:
        'If periodic malware scans are performed to meet Requirement 5.3.2, the frequency of scans is defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1.',
      testing: [
        'Examine the targeted risk analysis for the frequency of periodic malware scans.',
        'Examine scan records to verify scans occur at the defined frequency.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if continuous behavioral analysis is used instead of periodic scans.',
    },
    {
      id: '5.3.3',
      title: 'Removable electronic media',
      question:
        'For removable electronic media, does the anti-malware solution(s) perform automatic scans when the media is inserted, connected, or logically mounted, or perform continuous behavioral analysis of systems or processes when the media is inserted, connected, or logically mounted?',
      requirement:
        'For removable electronic media, the anti-malware solution(s): performs automatic scans of when the media is inserted, connected, or logically mounted, OR performs continuous behavioral analysis of systems or processes when the media is inserted, connected, or logically mounted.',
      testing: [
        'Examine anti-malware configurations to verify that removable electronic media is scanned or covered by continuous behavioral analysis.',
        'Observe media being inserted to verify that the solution acts as configured.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if the use of removable electronic media is technically prevented on all in-scope system components.',
    },
    {
      id: '5.3.4',
      title: 'Anti-malware audit logs',
      question:
        'Are audit logs for the anti-malware solution(s) enabled and retained in accordance with Requirement 10.5.1?',
      requirement:
        'Audit logs for the anti-malware solution(s) are enabled and retained in accordance with Requirement 10.5.1.',
      testing: [
        'Examine anti-malware solution configurations to verify that logs are enabled and retained per Requirement 10.5.1.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.3.5',
      title: 'Anti-malware cannot be disabled by users',
      question:
        'Are anti-malware mechanisms prevented from being disabled or altered by users, unless specifically documented and authorized by management on a case-by-case basis for a limited time period?',
      requirement:
        'Anti-malware mechanisms cannot be disabled or altered by users, unless specifically documented, and authorized by management on a case-by-case basis for a limited time period.',
      testing: [
        'Examine anti-malware configurations to verify that the solution cannot be disabled or altered by users.',
        'Interview personnel and examine records of any authorized exceptions.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '5.4.1',
      title: 'Anti-phishing mechanisms',
      question:
        'Are processes and automated mechanisms in place to detect and protect personnel against phishing attacks?',
      requirement:
        'Processes and automated mechanisms are in place to detect and protect personnel against phishing attacks.',
      testing: [
        'Observe implemented mechanisms and interview personnel to verify controls are in place to detect and protect personnel against phishing attacks.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
