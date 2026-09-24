export default {
  id: 11,
  title: 'Test Security of Systems and Networks Regularly',
  goal: 'Regularly Monitor and Test Networks',
  intro:
    'New weaknesses turn up all the time — found by researchers, found by attackers, and introduced by the next piece of software installed. A control that was sound last quarter may not be sound now, which is why testing has to be a habit rather than a one-off.',
  questions: [
    {
      id: '11.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 11 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 11. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 11.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 11 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 11 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.2.1',
      title: 'Wireless access point detection',
      question:
        'Do you go looking for wireless access points — finding and identifying both the sanctioned and the unsanctioned, doing so at intervals no longer than three months, and, where the monitoring is automated, having it raise an alert to staff?',
      requirement:
        'Wireless access points, sanctioned and unsanctioned alike, are managed as follows: the entity actively tests for the presence of Wi-Fi access points; every access point found is identified, whether or not it was authorised; that testing, detection and identification happens at intervals no longer than three months; and where the monitoring is automated, it raises an alert that reaches personnel.',
      testing: [
        'Read the policies and procedures and confirm the handling of sanctioned and unsanctioned wireless access points is laid down.',
        'Read the output of recent wireless scans and confirm the testing happens at least every three months.',
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
        'Do you keep an inventory of the wireless access points you have sanctioned, each with a written business reason for its existence?',
      requirement:
        'An inventory of sanctioned wireless access points is kept, and a written business reason accompanies it.',
      testing: [
        'Read the inventory of sanctioned wireless access points together with the written business reasons.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no wireless access points are authorized in your environment.',
    },
    {
      id: '11.3.1',
      title: 'Internal vulnerability scans',
      question:
        'Do internal vulnerability scans run at intervals no longer than three months, with anything ranked high risk or critical fixed and a rescan proving it, the scanning tool holding current vulnerability data, and the scanning done by competent people who are organisationally independent of what they are scanning?',
      requirement:
        'Internal vulnerability scanning runs as follows: at intervals no longer than three months; anything the entity’s own risk rankings under Requirement 6.3.1 place at high risk or critical is put right; a rescan then establishes that every such finding has been put right; the scanning tool holds current vulnerability information; and the scanning is carried out by competent personnel who are organisationally independent of the subject of the scan.',
      testing: [
        'Read the internal scan reports covering the last 12 months and confirm scanning happened at least every three months.',
        'Read the rescan output and confirm high-risk and critical findings were put right.',
        'Ask staff to confirm the tool holds current data and that the tester is competent and organisationally independent.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.3.1.1',
      title: 'Management of other vulnerabilities',
      question:
        'Are the remaining vulnerabilities — those not ranked high risk or critical — dealt with according to the risk your targeted risk analysis assigns under Requirement 12.3.1, with a rescan where one is called for?',
      requirement:
        'Vulnerabilities other than those the entity’s risk rankings under Requirement 6.3.1 place at high risk or critical are handled as follows: each is dealt with according to the risk assigned to it by the entity’s targeted risk analysis, carried out against every element Requirement 12.3.1 specifies; and a rescan follows where one is called for.',
      testing: [
        'Read the targeted risk analysis and confirm it sets out how these other vulnerabilities are to be dealt with.',
        'Read the scan and rescan output and ask staff, confirming they were dealt with accordingly.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.3.1.2',
      title: 'Authenticated internal scanning',
      question:
        'Do internal scans run with credentials — with any system that cannot take credentials recorded as such, adequate privilege used on the systems that can, and any credential also usable for interactive login managed under Requirement 8.2.2?',
      requirement:
        'Internal vulnerability scanning is carried out with authentication, as follows: any system incapable of accepting credentials for an authenticated scan is recorded as such; the privilege used on systems that do accept credentials is sufficient for the scan; and where an account used for authenticated scanning is also capable of interactive login, it is managed in the manner Requirement 8.2.2 lays down.',
      testing: [
        'Inspect the scanning tool configuration and confirm authenticated scanning is in use with sufficient privilege.',
        'Read the scan output and the record of systems that cannot accept credentials.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.3.1.3',
      title: 'Internal scans after significant change',
      question:
        'After a significant change, does an internal vulnerability scan follow — with high-risk and critical findings fixed, a rescan where needed, and the scanning done by competent, organisationally independent people?',
      requirement:
        'An internal vulnerability scan follows any significant change, and: anything the entity’s risk rankings under Requirement 6.3.1 place at high risk or critical is put right; a rescan follows where one is called for; and the scanning is carried out by competent personnel who are organisationally independent of the subject of the scan.',
      testing: [
        'Read the change control records alongside the internal scan reports, confirming a scan followed each significant change.',
        'Ask staff to confirm the tester is competent and organisationally independent.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.3.2',
      title: 'External vulnerability scans (ASV)',
      question:
        'Do external scans run at intervals no longer than three months, carried out by a scanning vendor the PCI SSC has approved, with findings cleared to the standard the ASV Program Guide sets for a pass, and rescans where needed to reach that pass?',
      requirement:
        'External vulnerability scanning runs as follows: at intervals no longer than three months; carried out by a scanning vendor approved by the PCI SSC; with findings cleared such that the ASV Program Guide’s conditions for a passing scan are met; and with rescans where needed to establish that findings were cleared to those same conditions.',
      testing: [
        'Read the approved vendor’s scan reports covering the last 12 months and confirm external scanning happened at least every three months.',
        'Read those reports and confirm a passing result was reached.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no external-facing IP addresses or domains in scope for PCI DSS.',
    },
    {
      id: '11.3.2.1',
      title: 'External scans after significant change',
      question:
        'After a significant change, does an external scan follow — with anything the CVSS scores at 4.0 or above fixed, a rescan where needed, and the work done by competent, organisationally independent people, who need not be an approved scanning vendor?',
      requirement:
        'An external vulnerability scan follows any significant change, and: anything the Common Vulnerability Scoring System rates at 4.0 or above is put right; a rescan follows where one is called for; and the scanning is carried out by competent personnel who are organisationally independent of the subject of the scan, though they need be neither a qualified security assessor nor an approved scanning vendor.',
      testing: [
        'Read the change control records alongside the external scan reports, confirming a scan followed each significant change.',
        'Read those reports and confirm findings rated 4.0 or above were put right.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no external-facing IP addresses or domains in scope for PCI DSS.',
    },
    {
      id: '11.4.1',
      title: 'Penetration testing methodology',
      question:
        'Have you written down and put into practice a penetration testing method that uses recognised industry approaches, covers the whole cardholder data environment boundary and the critical systems, tests from inside the network as well as outside, checks that segmentation and scope-reduction controls actually hold, tests at both the application and network layers, takes account of the threats and weaknesses of the past 12 months, states how the risk from anything exploitable found will be judged and handled, and keeps the results and the remediation records for at least 12 months?',
      requirement:
        'A penetration testing method is written down and put into practice by the entity. It takes in: penetration testing approaches the industry recognises; coverage of the entire cardholder data environment boundary and of the critical systems; testing conducted from inside the network as well as from outside it; testing that establishes whether the segmentation and scope-reduction controls genuinely hold; application-layer testing that looks, as a minimum, for the weaknesses Requirement 6.2.4 enumerates; network-layer testing reaching every component supporting network functions, and the operating systems too; consideration of the threats and weaknesses encountered over the preceding 12 months; a stated approach to judging and handling the risk from any exploitable weakness the testing uncovers; and retention, for no less than 12 months, of the test results and of the records of what was remediated.',
      testing: [
        'Read the documentation and ask staff, confirming the penetration testing method is written down and takes in each of those points.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.4.2',
      title: 'Internal penetration testing',
      question:
        'Is internal penetration testing carried out to that method, at intervals no longer than 12 months and again after any significant infrastructure or application change, by a competent person in-house or a competent outside firm, organisationally independent of what is being tested?',
      requirement:
        'Internal penetration testing is carried out: to the method the entity has laid down; at intervals no longer than 12 months; and additionally after any significant upgrade or change to infrastructure or to an application. The work is done by a competent internal resource or a competent external third party, organisationally independent of the subject of the test; that person need be neither a qualified security assessor nor an approved scanning vendor.',
      testing: [
        'Read the scope of work and the results of the latest internal penetration test, confirming it followed the method and happened at the required interval.',
        'Ask staff to confirm the tester was competent and organisationally independent.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.4.3',
      title: 'External penetration testing',
      question:
        'Is external penetration testing carried out to that method, at intervals no longer than 12 months and again after any significant infrastructure or application change, by a competent person in-house or a competent outside firm, organisationally independent of what is being tested?',
      requirement:
        'External penetration testing is carried out: to the method the entity has laid down; at intervals no longer than 12 months; and additionally after any significant upgrade or change to infrastructure or to an application. The work is done by a competent internal resource or a competent external third party, organisationally independent of the subject of the test; that person need be neither a qualified security assessor nor an approved scanning vendor.',
      testing: [
        'Read the scope of work and the results of the latest external penetration test, confirming it followed the method and happened at the required interval.',
        'Ask staff to confirm the tester was competent and organisationally independent.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.4.4',
      title: 'Correcting penetration test findings',
      question:
        'Is anything exploitable that penetration testing turns up put right according to how you judged its risk under Requirement 6.3.1, and is the testing run again to prove the fix?',
      requirement:
        'An exploitable weakness uncovered by penetration testing is put right in accordance with the entity’s judgement of the risk it poses, that judgement being made as Requirement 6.3.1 provides; and the penetration testing is then repeated to establish that the fix holds.',
      testing: [
        'Read the penetration test results and the remediation records, confirming exploitable weaknesses were put right.',
        'Read the results of the repeat testing, confirming the fixes were validated.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.4.5',
      title: 'Segmentation penetration testing',
      question:
        'Where segmentation keeps the cardholder data environment apart from other networks, are the segmentation controls penetration tested at intervals no longer than 12 months and again whenever they change — covering every segmentation control in use, following your written method, establishing that each is working and genuinely isolates the cardholder data environment from every out-of-scope system, establishing that any isolation between systems of differing security levels works too, and carried out by a competent, organisationally independent tester?',
      requirement:
        'Where segmentation keeps the cardholder data environment apart from other networks, the segmentation controls are penetration tested as follows: at intervals no longer than 12 months, and again after any change to a segmentation control or method; covering every segmentation control and method in use; following the penetration testing method the entity has laid down; establishing that each control is working, is effective, and does isolate the cardholder data environment from every out-of-scope system; establishing that any isolation used to keep apart systems of differing security levels is effective; and carried out by a competent internal resource or competent external third party, organisationally independent of the subject of the test.',
      testing: [
        'Inspect the segmentation controls and read the penetration testing method, confirming procedures exist to test every segmentation method in use.',
        'Read the results of the latest penetration test and confirm it reached and addressed every segmentation control and method.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if segmentation is not used — that is, your entire network is in scope as the CDE.',
    },
    {
      id: '11.4.6',
      title: 'Six-monthly segmentation testing (service providers)',
      question:
        'Where segmentation keeps the cardholder data environment apart from other networks, are the segmentation controls penetration tested at intervals no longer than six months, and again whenever they change?',
      requirement:
        'An extra obligation on service providers. Where segmentation keeps the cardholder data environment apart from other networks, the segmentation controls are penetration tested as follows: at intervals no longer than six months, and again after any change to a segmentation control or method; covering every segmentation control and method in use; following the penetration testing method the entity has laid down; establishing that each control is working, is effective, and does isolate the cardholder data environment from every out-of-scope system; establishing that any isolation used to keep apart systems of differing security levels is effective; and carried out by a competent internal resource or competent external third party, organisationally independent of the subject of the test.',
      testing: [
        'Read the results of the latest penetration tests and confirm segmentation testing happens at least every six months, and after any change to a segmentation control.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A only if segmentation is not used to isolate the CDE from other networks.',
    },
    {
      id: '11.4.7',
      title: 'Multi-tenant provider support for customer testing',
      question:
        'As a provider serving multiple tenants, do you help your customers carry out the external penetration testing that Requirements 11.4.3 and 11.4.4 ask of them?',
      requirement:
        'An extra obligation on providers serving multiple tenants. Such a provider assists its customers with the external penetration testing that Requirements 11.4.3 and 11.4.4 require of them.',
      testing: [
        'Read the documented evidence and ask staff, confirming the provider assists customers with external penetration testing — either by permitting access for it, or by supplying evidence that such testing has been carried out.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if your organization is not a multi-tenant service provider.',
    },
    {
      id: '11.5.1',
      title: 'Intrusion detection and prevention',
      question:
        'Are intrusion detection or prevention techniques used against network intrusions — watching all traffic at the cardholder data environment boundary, watching all traffic at the critical points inside it, alerting staff to a suspected compromise, and keeping every engine, baseline and signature current?',
      requirement:
        'Intrusion-detection techniques, intrusion-prevention techniques, or both, are used to detect or prevent intrusions into the network, arranged as follows: all traffic crossing the cardholder data environment boundary is watched; all traffic at the critical points within that environment is watched; personnel are alerted where a compromise is suspected; and every detection and prevention engine, along with its baselines and signatures, is kept current.',
      testing: [
        'Inspect the system configuration and the network diagrams, confirming these techniques operate at the boundary and at the critical points inside the cardholder data environment.',
        'Inspect the configuration and ask staff, confirming engines, baselines and signatures are current and that personnel do get alerted.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.5.1.1',
      title: 'Covert malware communication channels (service providers)',
      question:
        'Do those techniques catch covert channels malware uses to communicate — alerting on them or blocking them, and dealing with them?',
      requirement:
        'An extra obligation on service providers. The intrusion-detection or intrusion-prevention techniques in use detect covert channels used by malware to communicate, raise an alert on them or block them, and see that they are dealt with.',
      testing: [
        'Read the documented procedures and inspect the configuration, confirming means exist to detect such covert channels and deal with them.',
        'Read the alerting and response records and ask staff, confirming covert channels are actually dealt with.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '11.5.2',
      title: 'Change-detection mechanism',
      question:
        'Is a change-detection mechanism — file integrity monitoring, for instance — in place to alert staff when a critical file is altered, added or removed without authorisation, and does it compare those critical files at least once a week?',
      requirement:
        'A change-detection mechanism, file integrity monitoring tooling for example, is deployed so that: personnel are alerted when a critical file is modified without authorisation, which takes in alteration, addition and deletion; and comparisons of the critical files take place no less often than once a week.',
      testing: [
        'Inspect the system settings, the files being monitored, and the output of that monitoring, confirming a change-detection mechanism is in use.',
        'Inspect the mechanism’s settings and confirm it compares the critical files at least weekly.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '11.6.1',
      title: 'Payment page change- and tamper-detection',
      question:
        'Is there a change- and tamper-detection mechanism that alerts staff to unauthorised alteration — signs of compromise, changes, additions, removals — of the security-relevant HTTP headers and script content of your payment pages as the shopper’s browser actually receives them, set up to examine what was received, and running at least once every seven days or at the interval your targeted risk analysis sets under Requirement 12.3.1?',
      requirement:
        'The entity deploys a mechanism that detects change and tampering. It alerts personnel to unauthorised alteration — indicators of compromise, and changes, additions and deletions — of the security-relevant HTTP headers and the script content of payment pages, judged as the consumer’s browser receives them. It is configured to examine the header and the page as received. And its functions run either no less often than once every seven days, or on a recurring basis at an interval set by the entity’s targeted risk analysis, carried out against every element Requirement 12.3.1 specifies.',
      testing: [
        'Inspect the system settings, the payment pages under watch, and the output of that monitoring, confirming such a mechanism is in use.',
        'Inspect the configuration and confirm the mechanism runs at the required interval.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no payment pages delivered to a consumer browser (for example, all payment acceptance is card-present or via a fully redirected third-party page you do not control).',
    },
  ],
};
