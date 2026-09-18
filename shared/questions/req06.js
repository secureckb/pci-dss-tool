export default {
  id: 6,
  title: 'Develop and Maintain Secure Systems and Software',
  goal: 'Maintain a Vulnerability Management Program',
  intro:
    'Actors with bad intentions can use security vulnerabilities to gain privileged access to systems. Many of these vulnerabilities are fixed by vendor-provided security patches, which must be installed by the entities that manage the systems.',
  questions: [
    {
      id: '6.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 6 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 6 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 6.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 6 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 6 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.2.1',
      title: 'Secure software development',
      question:
        'Is bespoke and custom software developed securely — based on industry standards and/or best practices for secure development, in accordance with PCI DSS, and incorporating consideration of information security issues during each stage of the software development lifecycle?',
      requirement:
        'Bespoke and custom software are developed securely, as follows: based on industry standards and/or best practices for secure development; in accordance with PCI DSS (for example, secure authentication and logging); incorporating consideration of information security issues during each stage of the software development lifecycle.',
      testing: [
        'Examine documented software development procedures to verify that processes are defined for secure development.',
        'Interview software development personnel and examine records to verify that software is developed in accordance with the procedures.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.2.2',
      title: 'Developer secure coding training',
      question:
        'Are software development personnel working on bespoke and custom software trained at least once every 12 months on software security relevant to their job function and development languages, including secure software design and secure coding techniques, and on how to use any security testing tools for detecting vulnerabilities in software?',
      requirement:
        'Software development personnel working on bespoke and custom software are trained at least once every 12 months as follows: on software security relevant to their job function and development languages; including secure software design and secure coding techniques; including, if security testing tools are used, how to use the tools for detecting vulnerabilities in software.',
      testing: [
        'Examine software development procedures to verify training processes are defined.',
        'Examine training records and interview personnel to verify training occurs at least once every 12 months.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.2.3',
      title: 'Code review before release',
      question:
        'Is bespoke and custom software reviewed prior to being released into production or to customers, to identify and correct potential coding vulnerabilities, using either manual or automated code review techniques?',
      requirement:
        'Bespoke and custom software is reviewed prior to being released into production or to customers, to identify and correct potential coding vulnerabilities, as follows: code reviews ensure code is developed according to secure coding guidelines; code reviews look for both existing and emerging software vulnerabilities; appropriate corrections are implemented prior to release.',
      testing: [
        'Examine software development procedures to verify that code review processes are defined.',
        'Examine evidence of code reviews and interview personnel to verify reviews are performed prior to release.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.2.3.1',
      title: 'Manual code review controls',
      question:
        'If manual code reviews are performed for bespoke and custom software prior to release to production, are code changes reviewed by individuals other than the originating code author who are knowledgeable about code-review techniques and secure coding practices, and reviewed and approved by management prior to release?',
      requirement:
        'If manual code reviews are performed for bespoke and custom software prior to release to production, code changes are: reviewed by individuals other than the originating code author, and who are knowledgeable about code-review techniques and secure coding practices; reviewed and approved by management prior to release.',
      testing: [
        'Examine documented procedures to verify manual code review requirements are defined.',
        'Examine evidence of manual code reviews to verify reviews are performed by qualified individuals other than the author and approved by management.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if manual code reviews are not used (for example, only automated review tools are used) or if no bespoke or custom software is developed.',
    },
    {
      id: '6.2.4',
      title: 'Prevention of common software attacks',
      question:
        'Are software engineering techniques or other methods defined and in use by software development personnel to prevent or mitigate common software attacks and related vulnerabilities in bespoke and custom software — including injection attacks, attacks on data and data structures, attacks on cryptography usage, attacks on business logic, attacks on access control mechanisms, and attacks via any high-risk vulnerabilities identified in the vulnerability identification process?',
      requirement:
        'Software engineering techniques or other methods are defined and in use by software development personnel to prevent or mitigate common software attacks and related vulnerabilities in bespoke and custom software, including but not limited to the following: injection attacks, including SQL, LDAP, XPath, or other command, parameter, object, fault, or injection-type flaws; attacks on data and data structures, including attempts to manipulate buffers, pointers, input data, or shared data; attacks on cryptography usage, including attempts to exploit weak, insecure, or inappropriate cryptographic implementations, algorithms, cipher suites, or modes of operation; attacks on business logic, including attempts to abuse or bypass application features and functionalities through the manipulation of APIs, communication protocols and channels, client-side functionality, or other system/application functions and resources; attacks on access control mechanisms, including attempts to bypass or abuse identification, authentication, or authorization mechanisms, or attempts to exploit weaknesses in the implementation of such mechanisms; attacks via any "high-risk" vulnerabilities identified in the vulnerability identification process, as defined in Requirement 6.3.1.',
      testing: [
        'Examine documented software development procedures to verify techniques are defined to prevent or mitigate common software attacks.',
        'Interview software development personnel and examine evidence to verify the techniques are in use.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.3.1',
      title: 'Vulnerability identification and risk ranking',
      question:
        'Are security vulnerabilities identified and managed such that new security vulnerabilities are identified using industry-recognized sources for security vulnerability information (including alerts from international and national CERTs), vulnerabilities are assigned a risk ranking based on industry best practices and consideration of potential impact including ranking as high-risk or critical, and risk rankings identify at a minimum all vulnerabilities considered to be a high risk to the environment, with vulnerabilities for bespoke and custom and third-party software components covered?',
      requirement:
        'Security vulnerabilities are identified and managed as follows: new security vulnerabilities are identified using industry-recognized sources for security vulnerability information, including alerts from international and national computer emergency response teams (CERTs); vulnerabilities are assigned a risk ranking based on industry best practices and consideration of potential impact; risk rankings identify, at a minimum, all vulnerabilities considered to be a high-risk or critical to the environment; vulnerabilities for bespoke and custom, and third-party software (for example operating systems and databases) are covered.',
      testing: [
        'Examine documented policies and procedures to verify a process is defined for identifying and managing security vulnerabilities.',
        'Interview responsible personnel and examine evidence to verify that vulnerabilities are identified and risk-ranked as specified.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.3.2',
      title: 'Software inventory',
      question:
        'Is an inventory of bespoke and custom software, and third-party software components incorporated into bespoke and custom software, maintained to facilitate vulnerability and patch management?',
      requirement:
        'An inventory of bespoke and custom software, and third-party software components incorporated into bespoke and custom software is maintained to facilitate vulnerability and patch management.',
      testing: [
        'Examine documentation to verify an inventory of bespoke and custom software and third-party software components is maintained.',
        'Examine the inventory and compare to the software in use to verify the inventory is complete and current.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.3.3',
      title: 'Security patching',
      question:
        'Are all system components protected from known vulnerabilities by installing applicable security patches/updates, with critical or high-security patches/updates installed within one month of release and all other applicable security patches/updates installed within an appropriate time frame as determined by your organization?',
      requirement:
        'All system components are protected from known vulnerabilities by installing applicable security patches/updates as follows: critical or high-security patches/updates (identified according to the risk ranking process at Requirement 6.3.1) are installed within one month of release; all other applicable security patches/updates are installed within an appropriate time frame as determined by the entity (for example, within three months of release).',
      testing: [
        'Examine policies and procedures to verify processes are defined for installing security patches/updates within the required time frames.',
        'Examine system components and compare the list of installed security patches to the most recent vendor patch information.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.4.1',
      title: 'Public-facing web application assessments',
      question:
        'For public-facing web applications, are new threats and vulnerabilities addressed on an ongoing basis, and are these applications protected against known attacks by being reviewed using manual or automated application vulnerability security assessment tools or methods at least once every 12 months and after significant changes, by an entity that specializes in application security, with all vulnerabilities per Requirement 6.3.1 corrected and the application re-evaluated after corrections?',
      requirement:
        'For public-facing web applications, new threats and vulnerabilities are addressed on an ongoing basis and these applications are protected against known attacks as follows: reviewing public-facing web applications via manual or automated application vulnerability security assessment tools or methods as follows — at least once every 12 months and after significant changes; by an entity that specializes in application security; including, at a minimum, all common software attacks in Requirement 6.2.4; all vulnerabilities are ranked in accordance with Requirement 6.3.1; all vulnerabilities are corrected; the application is re-evaluated after the corrections.',
      testing: [
        'Examine documented procedures to verify processes are defined for reviewing public-facing web applications.',
        'Examine records of application security assessments to verify they are performed at the required frequency and that vulnerabilities are corrected and re-evaluated.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no public-facing web applications in scope.',
    },
    {
      id: '6.4.2',
      title: 'Automated technical solution for web attacks',
      question:
        'For public-facing web applications, is an automated technical solution deployed that continually detects and prevents web-based attacks, is installed in front of public-facing web applications, is actively running and up to date as applicable, generates audit logs, and is configured to either block web-based attacks or generate an alert that is immediately investigated?',
      requirement:
        'For public-facing web applications, an automated technical solution is deployed that continually detects and prevents web-based attacks, with at least the following: is installed in front of public-facing web applications and is configured to detect and prevent web-based attacks; actively running and up to date as applicable; generating audit logs; configured to either block web-based attacks or generate an alert that is immediately investigated.',
      testing: [
        'Examine system configuration settings and audit logs to verify that an automated technical solution is deployed in front of public-facing web applications.',
        'Interview responsible personnel to verify the solution is actively running, up to date, and configured as specified.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no public-facing web applications in scope.',
    },
    {
      id: '6.4.3',
      title: 'Payment page script management',
      question:
        'Are all payment page scripts that are loaded and executed in the consumer’s browser managed such that a method is implemented to confirm that each script is authorized, a method is implemented to assure the integrity of each script, and an inventory of all scripts is maintained with written business or technical justification as to why each is necessary?',
      requirement:
        'All payment page scripts that are loaded and executed in the consumer’s browser are managed as follows: a method is implemented to confirm that each script is authorized; a method is implemented to assure the integrity of each script; an inventory of all scripts is maintained with written business or technical justification as to why each is necessary.',
      testing: [
        'Examine documented policies and procedures to verify processes are defined for managing payment page scripts.',
        'Examine the inventory of scripts and interview personnel to verify that authorization and integrity methods are implemented.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no payment pages that load scripts into the consumer’s browser (for example, all payment processing is fully redirected to a third party and you present no payment page).',
    },
    {
      id: '6.5.1',
      title: 'Change control procedures',
      question:
        'Are changes to all system components in the production environment made according to established procedures that include the reason for and description of the change, documentation of security impact, documented change approval by authorized parties, testing to verify that the change does not adversely impact system security, testing of all bespoke and custom software updates for compliance with Requirement 6.2.4 before deployment, and procedures to address failures and return to a secure state?',
      requirement:
        'Changes to all system components in the production environment are made according to established procedures that include: reason for, and description of, the change; documentation of security impact; documented change approval by authorized parties; testing to verify that the change does not adversely impact system security; for bespoke and custom software changes, all updates are tested for compliance with Requirement 6.2.4 before being deployed into production; procedures to address failures and return to a secure state.',
      testing: [
        'Examine documented change control procedures to verify all required elements are addressed.',
        'Examine records of recent changes to verify the procedures were followed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.5.2',
      title: 'Significant change confirmation',
      question:
        'Upon completion of a significant change, are all applicable PCI DSS requirements confirmed to be in place on all new or changed systems and networks, and is documentation updated as applicable?',
      requirement:
        'Upon completion of a significant change, all applicable PCI DSS requirements are confirmed to be in place on all new or changed systems and networks, and documentation is updated as applicable.',
      testing: [
        'Examine documented change control procedures to verify that processes are defined to confirm PCI DSS requirements are in place after significant changes.',
        'Examine records of significant changes and interview personnel to verify the confirmation was performed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.5.3',
      title: 'Separation of pre-production and production',
      question:
        'Are pre-production environments separated from production environments, and is the separation enforced with access controls?',
      requirement:
        'Pre-production environments are separated from production environments and the separation is enforced with access controls.',
      testing: [
        'Examine network documentation and configurations to verify that pre-production environments are separate from production environments.',
        'Examine access control settings to verify that the separation is enforced.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization maintains no pre-production environments in scope.',
    },
    {
      id: '6.5.4',
      title: 'Separation of duties',
      question:
        'Are roles and functions separated between production and pre-production environments to provide accountability such that only reviewed and approved changes are deployed?',
      requirement:
        'Roles and functions are separated between production and pre-production environments to provide accountability such that only reviewed and approved changes are deployed.',
      testing: [
        'Examine documented policies and procedures and access control settings to verify roles and functions are separated.',
        'Interview personnel to verify that only reviewed and approved changes are deployed.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization maintains no pre-production environments in scope.',
    },
    {
      id: '6.5.5',
      title: 'Live PANs in pre-production',
      question:
        'Are live PANs prohibited from use in pre-production environments, except where those environments are included in the CDE and protected in accordance with all applicable PCI DSS requirements?',
      requirement:
        'Live PANs are not used in pre-production environments, except where those environments are included in the CDE and protected in accordance with all applicable PCI DSS requirements.',
      testing: [
        'Examine documented policies and procedures to verify processes are defined to prohibit live PANs in pre-production environments.',
        'Examine pre-production data and interview personnel to verify that live PANs are not present, or that the environment is included in the CDE and protected.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization maintains no pre-production environments in scope.',
    },
    {
      id: '6.5.6',
      title: 'Removal of test data and accounts',
      question:
        'Are test data and test accounts removed from system components before the system goes into production?',
      requirement:
        'Test data and test accounts are removed from system components before the system goes into production.',
      testing: [
        'Examine documented policies and procedures to verify processes are defined for removing test data and test accounts.',
        'Examine recently installed or updated production systems to verify test data and test accounts have been removed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
