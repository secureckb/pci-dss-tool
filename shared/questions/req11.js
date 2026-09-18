export default {
  id: 11,
  title: 'Test Security of Systems and Networks Regularly',
  goal: 'Regularly Monitor and Test Networks',
  intro:
    'Vulnerabilities are being discovered continually by malicious individuals and researchers, and being introduced by new software. System components, processes, and bespoke and custom software should be tested frequently to ensure security controls continue to reflect a changing environment.',
  questions: [
    {
      id: '11.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 11 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 11 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 11.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 11 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 11 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.2.1',
      title: 'Wireless access point detection',
      question:
        'Are authorized and unauthorized wireless access points managed such that the presence of wireless access points is tested for, all authorized and unauthorized wireless access points are detected and identified, testing/detection/identification occurs at least once every three months, and if automated monitoring is used personnel are notified via generated alerts?',
      requirement:
        'Authorized and unauthorized wireless access points are managed as follows: the presence of wireless (Wi-Fi) access points is tested for; all authorized and unauthorized wireless access points are detected and identified; testing, detection, and identification occurs at least once every three months; if automated monitoring is used, personnel are notified via generated alerts.',
      testing: [
        'Examine policies and procedures to verify processes are defined for managing authorized and unauthorized wireless access points.',
        'Examine the results of recent wireless scans to verify testing occurs at least once every three months.',
      ],
      appliesTo: 'all',
      allowNA: false,
      guidance:
        'This requirement applies even when a policy prohibits the use of wireless technology, because scanning is how you detect unauthorized (rogue) access points.',
    },
    {
      id: '11.2.2',
      title: 'Inventory of authorized wireless access points',
      question:
        'Is an inventory of authorized wireless access points maintained, including a documented business justification for each?',
      requirement:
        'An inventory of authorized wireless access points is maintained, including a documented business justification.',
      testing: [
        'Examine the inventory of authorized wireless access points and documented business justifications.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no wireless access points are authorized in your environment.',
    },
    {
      id: '11.3.1',
      title: 'Internal vulnerability scans',
      question:
        'Are internal vulnerability scans performed at least once every three months, with high-risk and critical vulnerabilities resolved, rescans performed that confirm all high-risk and critical vulnerabilities have been resolved, the scan tool kept up to date with the latest vulnerability information, and scans performed by qualified personnel with organizational independence of the tester?',
      requirement:
        'Internal vulnerability scans are performed as follows: at least once every three months; high-risk and critical vulnerabilities (per the entity’s vulnerability risk rankings defined at Requirement 6.3.1) are resolved; rescans are performed that confirm all high-risk and critical vulnerabilities have been resolved; scan tool is kept up to date with latest vulnerability information; scans are performed by qualified personnel and organizational independence of the tester exists.',
      testing: [
        'Examine internal scan report results from the last 12 months to verify scanning occurred at least once every three months.',
        'Examine rescan results to verify high-risk and critical vulnerabilities were resolved.',
        'Interview personnel to verify the scan tool is current and the tester is qualified and organizationally independent.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.3.1.1',
      title: 'Management of other vulnerabilities',
      question:
        'Are all other applicable vulnerabilities (those not ranked as high-risk or critical) managed by being addressed based on the risk defined in your targeted risk analysis performed according to Requirement 12.3.1, with rescans conducted as needed?',
      requirement:
        'All other applicable vulnerabilities (those not ranked as high-risk or critical per the entity’s vulnerability risk rankings defined at Requirement 6.3.1) are managed as follows: addressed based on the risk defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1; rescans are conducted as needed.',
      testing: [
        'Examine the targeted risk analysis to verify the approach for addressing other vulnerabilities is defined.',
        'Examine scan and rescan results and interview personnel to verify vulnerabilities are addressed as defined.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.3.1.2',
      title: 'Authenticated internal scanning',
      question:
        'Are internal vulnerability scans performed via authenticated scanning, with systems unable to accept credentials for authenticated scanning documented, and sufficient privileges used for those systems that accept credentials, and if accounts used for authenticated scanning can be used for interactive login are they managed in accordance with Requirement 8.2.2?',
      requirement:
        'Internal vulnerability scans are performed via authenticated scanning as follows: systems that are unable to accept credentials for authenticated scanning are documented; sufficient privileges are used for those systems that accept credentials for scanning; if accounts used for authenticated scanning can be used for interactive login, they are managed in accordance with Requirement 8.2.2.',
      testing: [
        'Examine scan tool configurations to verify that authenticated scanning is used with sufficient privileges.',
        'Examine scan report results and documentation of systems unable to accept credentials.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.3.1.3',
      title: 'Internal scans after significant change',
      question:
        'Are internal vulnerability scans performed after any significant change, with high-risk and critical vulnerabilities resolved, rescans conducted as needed, and scans performed by qualified personnel with organizational independence of the tester?',
      requirement:
        'Internal vulnerability scans are performed after any significant change as follows: high-risk and critical vulnerabilities (per the entity’s vulnerability risk rankings defined at Requirement 6.3.1) are resolved; rescans are conducted as needed; scans are performed by qualified personnel and organizational independence of the tester exists.',
      testing: [
        'Examine change control documentation and internal scan reports to verify that scans were performed after significant changes.',
        'Interview personnel to verify the tester is qualified and organizationally independent.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.3.2',
      title: 'External vulnerability scans (ASV)',
      question:
        'Are external vulnerability scans performed at least once every three months by a PCI SSC Approved Scanning Vendor (ASV), with vulnerabilities resolved and ASV Program Guide requirements for a passing scan met, and rescans performed as needed to confirm a passing scan?',
      requirement:
        'External vulnerability scans are performed as follows: at least once every three months; by a PCI SSC Approved Scanning Vendor (ASV); vulnerabilities are resolved and ASV Program Guide requirements for a passing scan are met; rescans are performed as needed to confirm that vulnerabilities are resolved per the ASV Program Guide requirements for a passing scan.',
      testing: [
        'Examine ASV scan reports from the last 12 months to verify that external scans occurred at least once every three months.',
        'Examine ASV scan reports to verify that a passing scan result was achieved.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no external-facing IP addresses or domains in scope for PCI DSS.',
    },
    {
      id: '11.3.2.1',
      title: 'External scans after significant change',
      question:
        'Are external vulnerability scans performed after any significant change, with vulnerabilities scored 4.0 or higher by the CVSS resolved, rescans conducted as needed, and scans performed by qualified personnel with organizational independence of the tester (not required to be an ASV)?',
      requirement:
        'External vulnerability scans are performed after any significant change as follows: vulnerabilities that are scored 4.0 or higher by the CVSS are resolved; rescans are conducted as needed; scans are performed by qualified personnel and organizational independence of the tester exists (not required to be a QSA or ASV).',
      testing: [
        'Examine change control documentation and external scan reports to verify that scans were performed after significant changes.',
        'Examine scan reports to verify that vulnerabilities scored 4.0 or higher were resolved.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no external-facing IP addresses or domains in scope for PCI DSS.',
    },
    {
      id: '11.4.1',
      title: 'Penetration testing methodology',
      question:
        'Is a penetration testing methodology defined, documented, and implemented that includes industry-accepted approaches, coverage for the entire CDE perimeter and critical systems, testing from both inside and outside the network, testing to validate any segmentation and scope-reduction controls, application-layer and network-layer testing, review and consideration of threats and vulnerabilities experienced in the last 12 months, documented approach to assessing and addressing the risk posed by exploitable vulnerabilities and security weaknesses, and retention of penetration testing results and remediation activities for at least 12 months?',
      requirement:
        'A penetration testing methodology is defined, documented, and implemented by the entity, and includes: industry-accepted penetration testing approaches; coverage for the entire CDE perimeter and critical systems; testing from both inside and outside the network; testing to validate any segmentation and scope-reduction controls; application-layer penetration testing to identify, at a minimum, the vulnerabilities listed in Requirement 6.2.4; network-layer penetration tests that encompass all components that support network functions as well as operating systems; review and consideration of threats and vulnerabilities experienced in the last 12 months; documented approach to assessing and addressing the risk posed by exploitable vulnerabilities and security weaknesses found during penetration testing; retention of penetration testing results and remediation activities results for at least 12 months.',
      testing: [
        'Examine documentation and interview personnel to verify that the penetration testing methodology is defined, documented, and includes all required elements.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.4.2',
      title: 'Internal penetration testing',
      question:
        'Is internal penetration testing performed per your defined methodology at least once every 12 months and after any significant infrastructure or application upgrade or change, by a qualified internal resource or qualified external third party, with organizational independence of the tester?',
      requirement:
        'Internal penetration testing is performed: per the entity’s defined methodology; at least once every 12 months; after any significant infrastructure or application upgrade or change; by a qualified internal resource or qualified external third party; with organizational independence of the tester (does not require that the tester be a QSA or ASV).',
      testing: [
        'Examine the scope of work and results from the most recent internal penetration test to verify it was performed per the methodology and at the required frequency.',
        'Interview personnel to verify that the tester was qualified and organizationally independent.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.4.3',
      title: 'External penetration testing',
      question:
        'Is external penetration testing performed per your defined methodology at least once every 12 months and after any significant infrastructure or application upgrade or change, by a qualified internal resource or qualified external third party, with organizational independence of the tester?',
      requirement:
        'External penetration testing is performed: per the entity’s defined methodology; at least once every 12 months; after any significant infrastructure or application upgrade or change; by a qualified internal resource or qualified external third party; with organizational independence of the tester (does not require that the tester be a QSA or ASV).',
      testing: [
        'Examine the scope of work and results from the most recent external penetration test to verify it was performed per the methodology and at the required frequency.',
        'Interview personnel to verify that the tester was qualified and organizationally independent.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.4.4',
      title: 'Correcting penetration test findings',
      question:
        'Are exploitable vulnerabilities and security weaknesses found during penetration testing corrected in accordance with your assessment of the risk posed by the security issue as defined in Requirement 6.3.1, and is penetration testing repeated to verify the corrections?',
      requirement:
        'Exploitable vulnerabilities and security weaknesses found during penetration testing are corrected as follows: in accordance with the entity’s assessment of the risk posed by the security issue as defined in Requirement 6.3.1; penetration testing is repeated to verify the corrections.',
      testing: [
        'Examine penetration testing results and remediation records to verify that exploitable vulnerabilities and security weaknesses were corrected.',
        'Examine repeat testing results to verify the corrections were validated.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.4.5',
      title: 'Segmentation penetration testing',
      question:
        'If segmentation is used to isolate the CDE from other networks, are penetration tests performed on segmentation controls at least once every 12 months and after any changes to segmentation controls/methods, covering all segmentation controls/methods in use, according to your defined penetration testing methodology, confirming that the segmentation controls/methods are operational and effective and isolate the CDE from all out-of-scope systems, confirming effectiveness of any use of isolation to separate systems with differing security levels, and performed by a qualified internal resource or qualified external third party with organizational independence of the tester?',
      requirement:
        'If segmentation is used to isolate the CDE from other networks, penetration tests are performed on segmentation controls as follows: at least once every 12 months and after any changes to segmentation controls/methods; covering all segmentation controls/methods in use; according to the entity’s defined penetration testing methodology; confirming that the segmentation controls/methods are operational and effective, and isolate the CDE from all out-of-scope systems; confirming effectiveness of any use of isolation to separate systems with differing security levels; performed by a qualified internal resource or qualified external third party, with organizational independence of the tester.',
      testing: [
        'Examine segmentation controls and review penetration testing methodology to verify that penetration-testing procedures are defined to test all segmentation methods.',
        'Examine the results from the most recent penetration test to verify the test covers and addresses all segmentation controls/methods.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if segmentation is not used — that is, your entire network is in scope as the CDE.',
    },
    {
      id: '11.4.6',
      title: 'Six-monthly segmentation testing (service providers)',
      question:
        'If segmentation is used to isolate the CDE from other networks, are penetration tests performed on segmentation controls at least once every six months and after any changes to segmentation controls/methods?',
      requirement:
        'Additional requirement for service providers only: If segmentation is used to isolate the CDE from other networks, penetration tests are performed on segmentation controls as follows: at least once every six months and after any changes to segmentation controls/methods; covering all segmentation controls/methods in use; according to the entity’s defined penetration testing methodology; confirming that the segmentation controls/methods are operational and effective, and isolate the CDE from all out-of-scope systems; confirming effectiveness of any use of isolation to separate systems with differing security levels; performed by a qualified internal resource or qualified external third party, with organizational independence of the tester.',
      testing: [
        'Examine the results from the most recent penetration tests to verify that segmentation testing is performed at least once every six months and after any changes to segmentation controls.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A only if segmentation is not used to isolate the CDE from other networks.',
    },
    {
      id: '11.4.7',
      title: 'Multi-tenant provider support for customer testing',
      question:
        'Does your organization, as a multi-tenant service provider, support its customers for external penetration testing per Requirements 11.4.3 and 11.4.4?',
      requirement:
        'Additional requirement for multi-tenant service providers only: Multi-tenant service providers support their customers for external penetration testing per Requirement 11.4.3 and 11.4.4.',
      testing: [
        'Examine documented evidence and interview personnel to verify that the multi-tenant service provider supports customers for external penetration testing, either by providing access or evidence that penetration testing is performed.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if your organization is not a multi-tenant service provider.',
    },
    {
      id: '11.5.1',
      title: 'Intrusion detection and prevention',
      question:
        'Are intrusion-detection and/or intrusion-prevention techniques used to detect and/or prevent intrusions into the network such that all traffic is monitored at the perimeter of the CDE, all traffic is monitored at critical points in the CDE, personnel are alerted to suspected compromises, and all intrusion-detection and prevention engines, baselines, and signatures are kept up to date?',
      requirement:
        'Intrusion-detection and/or intrusion-prevention techniques are used to detect and/or prevent intrusions into the network as follows: all traffic is monitored at the perimeter of the CDE; all traffic is monitored at critical points in the CDE; personnel are alerted to suspected compromises; all intrusion-detection and prevention engines, baselines, and signatures are kept up to date.',
      testing: [
        'Examine system configurations and network diagrams to verify that intrusion-detection and/or intrusion-prevention techniques are in place at the perimeter and critical points of the CDE.',
        'Examine system configurations and interview personnel to verify engines, baselines, and signatures are kept up to date and personnel are alerted.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.5.1.1',
      title: 'Covert malware communication channels (service providers)',
      question:
        'Do intrusion-detection and/or intrusion-prevention techniques detect, alert on/prevent, and address covert malware communication channels?',
      requirement:
        'Additional requirement for service providers only: Intrusion-detection and/or intrusion-prevention techniques detect, alert on/prevent, and address covert malware communication channels.',
      testing: [
        'Examine documented procedures and system configurations to verify that methods to detect and address covert malware communication channels are in place.',
        'Examine alerting and response records and interview personnel to verify covert channels are addressed.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '11.5.2',
      title: 'Change-detection mechanism',
      question:
        'Is a change-detection mechanism (for example, file integrity monitoring tools) deployed to alert personnel to unauthorized modification — including changes, additions, and deletions — of critical files, and to perform critical file comparisons at least once weekly?',
      requirement:
        'A change-detection mechanism (for example, file integrity monitoring tools) is deployed as follows: to alert personnel to unauthorized modification (including changes, additions, and deletions) of critical files; to perform critical file comparisons at least once weekly.',
      testing: [
        'Examine system settings, monitored files, and results from monitoring activities to verify the use of a change-detection mechanism.',
        'Examine settings for the change-detection mechanism to verify it is configured to perform critical file comparisons at least once weekly.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.6.1',
      title: 'Payment page change- and tamper-detection',
      question:
        'Is a change- and tamper-detection mechanism deployed to alert personnel to unauthorized modification — including indicators of compromise, changes, additions, and deletions — to the security-impacting HTTP headers and the script contents of payment pages as received by the consumer browser, with the mechanism configured to evaluate the received HTTP headers and payment pages, and with the mechanism functions performed at least once every seven days or periodically at the frequency defined in your targeted risk analysis performed according to Requirement 12.3.1?',
      requirement:
        'A change- and tamper-detection mechanism is deployed as follows: to alert personnel to unauthorized modification (including indicators of compromise, changes, additions, and deletions) to the security-impacting HTTP headers and the script contents of payment pages as received by the consumer browser; the mechanism is configured to evaluate the received HTTP header and payment page; the mechanism functions are performed as follows — at least once every seven days OR periodically (at the frequency defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1).',
      testing: [
        'Examine system settings, monitored payment pages, and results from monitoring activities to verify the use of a change- and tamper-detection mechanism.',
        'Examine configuration settings to verify the mechanism functions are performed at the required frequency.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no payment pages delivered to a consumer browser (for example, all payment acceptance is card-present or via a fully redirected third-party page you do not control).',
    },
  ],
};
