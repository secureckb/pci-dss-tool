export default {
  id: 6,
  title: 'Develop and Maintain Secure Systems and Software',
  goal: 'Maintain a Vulnerability Management Program',
  intro:
    'A flaw in software is a way in, and a way to gain more privilege than was intended. Vendors close most of them with patches, but a patch protects nobody until the entity running the system installs it. Requirement 6 covers building software carefully, watching for the flaws that get published, and putting changes through a controlled process.',
  questions: [
    {
      id: '6.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 6 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 6. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 6.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 6 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 6 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.2.1',
      title: 'Secure software development',
      question:
        'Is your bespoke and custom software built securely — drawing on recognised industry standards or good practice for secure development, consistent with PCI DSS, and with security questions raised at every stage of the development lifecycle rather than only at the end?',
      requirement:
        'Bespoke and custom software is built securely. Development draws on recognised industry standards, good practice for secure development, or both; it is consistent with PCI DSS, in matters such as authentication and logging; and information security is considered at every stage of the software development lifecycle.',
      testing: [
        'Read the documented development procedures and confirm they set out how secure development is to be done.',
        'Ask the developers and read the records, to confirm software is actually built the way those procedures say.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.2.2',
      title: 'Developer secure coding training',
      question:
        'Do the developers working on bespoke and custom software receive training at intervals no longer than 12 months, covering software security as it bears on their own role and languages, secure design and secure coding, and — where security testing tools are used — how to drive those tools to find flaws?',
      requirement:
        'Anyone who develops bespoke or custom software receives training no less often than once every 12 months. The training covers software security as it applies to their particular role and the languages they write in; it includes secure software design and secure coding practice; and where the entity uses security testing tools, it includes how to use those tools to find flaws in software.',
      testing: [
        'Read the development procedures and confirm the training arrangements are defined.',
        'Read the training records and ask staff, to confirm training happens at intervals of no more than 12 months.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.2.3',
      title: 'Code review before release',
      question:
        'Is bespoke and custom software reviewed before it ships to production or to customers, by hand or by tool, so that coding flaws are found and fixed first?',
      requirement:
        'Bespoke and custom software is reviewed before release to production or to customers, so that potential coding flaws are found and put right. The review establishes that the code was written to the entity’s secure coding guidelines; it looks for flaws already known and for those newly emerging; and the necessary corrections are made before the software is released.',
      testing: [
        'Read the development procedures and confirm the code review process is defined.',
        'Read the evidence of reviews and ask staff, to confirm they happen before release rather than after.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.2.3.1',
      title: 'Manual code review controls',
      question:
        'Where those pre-release reviews are done by hand, is each change looked at by somebody other than its author — someone who knows both review technique and secure coding — and does management review and approve it before release?',
      requirement:
        'Where bespoke and custom software is reviewed by hand before release to production, each code change is examined by a person other than the one who wrote it, and that person is competent in code review technique and in secure coding practice. Management reviews and approves the change before it is released.',
      testing: [
        'Read the documented procedures and confirm the requirements for review by hand are defined.',
        'Read the evidence of such reviews and confirm each was carried out by a competent person who did not write the code, and that management signed it off.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if manual code reviews are not used (for example, only automated review tools are used) or if no bespoke or custom software is developed.',
    },
    {
      id: '6.2.4',
      title: 'Prevention of common software attacks',
      question:
        'Have engineering techniques or other methods been defined, and are developers actually using them, to stop or blunt the common classes of attack against bespoke and custom software — injection; attempts against data and the structures holding it; misuse of cryptography; abuse of business logic; subversion of access control; and anything your own process has rated a high-risk vulnerability?',
      requirement:
        'The entity has settled on engineering techniques, or other methods, and its developers actually use them to head off the common classes of attack on bespoke and custom software, together with the weaknesses those attacks rely on. The classes covered run to at least the following six. (1) Injection of every variety — SQL, LDAP and XPath among them, and equally those turning on a command, a parameter, an object or an induced fault. (2) Attempts against data and the structures that hold it: tampering with a buffer, a pointer, the input supplied, or data shared between components. (3) Misuse of cryptography, where the attacker exploits an implementation, algorithm, cipher suite or mode of operation that is weak, insecure or ill-suited to the job. (4) Abuse of business logic — misusing or sidestepping what the application offers, by way of its APIs, its communication protocols and channels, its client-side behaviour, or any other function or resource it exposes. (5) Subversion of the access control machinery: evading or misusing identification, authentication or authorisation, or exploiting a weakness in how any of the three was built. (6) Anything reachable by way of a weakness that the entity\u2019s own process under Requirement 6.3.1 has rated high risk.',
      testing: [
        'Read the documented development procedures and confirm techniques are defined for heading off the common classes of attack.',
        'Ask the developers and read the evidence, to confirm those techniques are genuinely in use.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.3.1',
      title: 'Vulnerability identification and risk ranking',
      question:
        'Do you find out about new vulnerabilities from recognised industry sources, including national and international CERT advisories, rank each one for risk using industry practice and its likely impact so that high-risk and critical ones are picked out, and cover both your own software and the third-party components in it?',
      requirement:
        'Vulnerabilities are found and managed as follows. Newly published vulnerabilities are learned of through recognised industry sources of vulnerability information, including advisories from national and international computer emergency response teams. Each is given a risk ranking, arrived at from industry practice and from what its impact would be. The ranking picks out, as a minimum, every vulnerability that is high risk or critical for this environment. And the process covers bespoke and custom software as well as third-party software such as operating systems and databases.',
      testing: [
        'Read the documented policies and procedures and confirm a process for finding and managing vulnerabilities is defined.',
        'Ask the responsible staff and read the evidence, to confirm vulnerabilities are found and ranked as described.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.3.2',
      title: 'Software inventory',
      question:
        'Do you keep an inventory of your bespoke and custom software, and of the third-party components built into it, so that vulnerabilities and patches can be tracked against it?',
      requirement:
        'An inventory is maintained of bespoke and custom software and of the third-party software components incorporated into it, so that vulnerability and patch management can be carried out against it.',
      testing: [
        'Read the documentation and confirm such an inventory is maintained.',
        'Compare the inventory against the software actually in use and confirm it is complete and current.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not develop any bespoke or custom software in scope for PCI DSS.',
    },
    {
      id: '6.3.3',
      title: 'Security patching',
      question:
        'Are all system components kept clear of known vulnerabilities by applying the relevant security patches — those rated critical or high within one month of release, and the rest within a period your organisation has itself decided is appropriate?',
      requirement:
        'System components are kept protected from known vulnerabilities by installing the security patches and updates that apply to them. Where the ranking process at Requirement 6.3.1 has marked a patch or update as critical or high, it is applied no more than a month after the vendor puts it out. Every other applicable security patch or update is installed within a period the entity has determined to be appropriate — within three months of release, for instance.',
      testing: [
        'Read the policies and procedures and confirm the installation timescales are defined.',
        'Inspect the system components and set the patches installed against the vendor’s most recent patch information.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.4.1',
      title: 'Public-facing web application assessments',
      question:
        'Do you deal with emerging threats and weaknesses in your internet-facing web applications continuously, and is each one reviewed — by hand or by vulnerability assessment tooling, at intervals no longer than 12 months and again after any significant change, by a party specialising in application security, covering at minimum the attack classes in Requirement 6.2.4 — and does every weakness found get ranked as Requirement 6.3.1 directs, put right, and the application looked at again once it has been?',
      requirement:
        'Internet-facing web applications are protected against known attacks, and emerging threats and weaknesses affecting them are dealt with as a continuing activity rather than a periodic one. Each is reviewed using either hands-on methods or application vulnerability assessment tooling: at intervals no longer than 12 months, and additionally after any significant change; by a party that specialises in application security; and covering as a minimum all of the common attack classes set out in Requirement 6.2.4. Every vulnerability found is ranked as Requirement 6.3.1 requires, every vulnerability is corrected, and the application is examined again once the corrections are in.',
      testing: [
        'Read the documented procedures and confirm a review process for public-facing web applications is defined.',
        'Read the assessment records and confirm reviews happened at the required interval and that findings were corrected and re-examined.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no public-facing web applications in scope.',
    },
    {
      id: '6.4.2',
      title: 'Automated technical solution for web attacks',
      question:
        'Is there an automated technical control sitting in front of your public-facing web applications that detects and stops web attacks on a continuing basis — running and current, producing audit logs, and set either to block the attack or to raise an alert that is investigated at once?',
      requirement:
        'An automated technical control is deployed for public-facing web applications that detects and prevents web-based attacks on a continuing basis, meeting at least the following. It sits in front of those applications, set up to spot web attacks and stop them. It is running, and current wherever currency applies. It produces audit logs. And it is configured either to block the attack outright or to raise an alert that is investigated immediately.',
      testing: [
        'Inspect the configuration and the audit logs to confirm such a control is deployed in front of the public-facing web applications.',
        'Ask the responsible staff to confirm it is running, current, and configured as described.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no public-facing web applications in scope.',
    },
    {
      id: '6.4.3',
      title: 'Payment page script management',
      question:
        'For every script that loads and runs in the cardholder’s browser on a payment page, is there a means of confirming the script is authorised, a means of assuring it has not been tampered with, and an inventory recording in writing why each script needs to be there?',
      requirement:
        'Every script that a payment page causes to run in the browser of the person paying is managed in three ways: a means is in place to confirm that the script is authorised; a means is in place to assure the script’s integrity; and an inventory of all such scripts is maintained, recording in writing the business or technical reason each one is needed.',
      testing: [
        'Read the documented policies and procedures and confirm a process for managing payment page scripts is defined.',
        'Read the script inventory and ask staff, to confirm the authorisation and integrity mechanisms are in place.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization has no payment pages that load scripts into the consumer’s browser (for example, all payment processing is fully redirected to a third party and you present no payment page).',
    },
    {
      id: '6.5.1',
      title: 'Change control procedures',
      question:
        'Does every change to a production system component follow a settled procedure that records the reason for and nature of the change, documents its security impact, captures approval from someone authorised, tests that security is not degraded, tests bespoke and custom software updates against Requirement 6.2.4 before they reach production, and says what to do when a change fails and how to get back to a safe state?',
      requirement:
        'Changes to system components in the production environment follow settled procedures, which include all of the following: the reason for the change and a description of it; a record of its security impact; approval recorded by a party authorised to give it; testing establishing that the change does not weaken system security; for changes to bespoke and custom software, testing every update against Requirement 6.2.4 before it is deployed to production; and procedures covering what happens if a change fails and how a secure state is restored.',
      testing: [
        'Read the documented change control procedures and confirm each of those elements is covered.',
        'Read the records of recent changes and confirm the procedures were actually followed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.5.2',
      title: 'Significant change confirmation',
      question:
        'After a significant change, do you go back and confirm that every applicable PCI DSS requirement is still in place on the systems and networks that were added or altered, and bring the documentation up to date?',
      requirement:
        'Once a significant change is complete, every applicable PCI DSS requirement is confirmed to be in place on each new or altered system and network, and the documentation is brought up to date where it needs to be.',
      testing: [
        'Read the documented change control procedures and confirm this post-change confirmation is provided for.',
        'Read the records of significant changes and ask staff, to confirm the confirmation actually took place.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '6.5.3',
      title: 'Separation of pre-production and production',
      question:
        'Are pre-production environments kept apart from production, with access controls enforcing that separation rather than convention alone?',
      requirement:
        'Pre-production environments are kept separate from production environments, and access controls enforce that separation.',
      testing: [
        'Read the network documentation and inspect the configuration to confirm pre-production is separate from production.',
        'Inspect the access control settings and confirm they enforce the separation.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization maintains no pre-production environments in scope.',
    },
    {
      id: '6.5.4',
      title: 'Separation of duties',
      question:
        'Are roles and duties split between the production and pre-production environments, so that accountability exists and only changes that have been reviewed and approved can be deployed?',
      requirement:
        'Roles and functions are divided between production and pre-production environments, establishing accountability such that only a change that has been reviewed and approved can be deployed.',
      testing: [
        'Read the documented policies and procedures and inspect the access control settings to confirm roles and functions are divided.',
        'Ask staff to confirm that only reviewed and approved changes get deployed.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization maintains no pre-production environments in scope.',
    },
    {
      id: '6.5.5',
      title: 'Live PANs in pre-production',
      question:
        'Are real PANs kept out of pre-production environments, unless such an environment is itself inside the cardholder data environment and protected to every applicable PCI DSS requirement?',
      requirement:
        'Pre-production environments do not carry real PANs. The one exception is a pre-production environment that has been brought inside the cardholder data environment and is protected in line with every applicable PCI DSS requirement.',
      testing: [
        'Read the documented policies and procedures and confirm a process exists that keeps real PANs out of pre-production.',
        'Inspect the pre-production data and ask staff, to confirm either that no real PANs are present or that the environment sits inside the cardholder data environment and is protected.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization maintains no pre-production environments in scope.',
    },
    {
      id: '6.5.6',
      title: 'Removal of test data and accounts',
      question:
        'Are test data and test accounts taken off a system component before it goes live?',
      requirement:
        'Before a system component enters production, any test data and test accounts sitting on it are taken off.',
      testing: [
        'Read the documented policies and procedures and confirm a removal process is defined.',
        'Inspect production systems recently installed or updated and confirm test data and test accounts are gone.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
