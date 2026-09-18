export default {
  id: 12,
  title: 'Support Information Security with Organizational Policies and Programs',
  goal: 'Maintain an Information Security Policy',
  intro:
    'The organization’s overall information security policy sets the tone for the whole entity and informs personnel what is expected of them. All personnel should be aware of the sensitivity of cardholder data and their responsibilities for protecting it.',
  questions: [
    {
      id: '12.1.1',
      title: 'Overall information security policy',
      question:
        'Is an overall information security policy established, published, maintained, and disseminated to all relevant personnel, as well as to relevant vendors and business partners?',
      requirement:
        'An overall information security policy is: established; published; maintained; disseminated to all relevant personnel, as well as to relevant vendors and business partners.',
      testing: [
        'Examine the information security policy to verify it is established and published.',
        'Interview personnel to verify the policy has been disseminated and is understood.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.1.2',
      title: 'Annual policy review',
      question:
        'Is the information security policy reviewed at least once every 12 months and updated as needed to reflect changes to business objectives or risks to the environment?',
      requirement:
        'The information security policy is: reviewed at least once every 12 months; updated as needed to reflect changes to business objectives or risks to the environment.',
      testing: [
        'Examine the information security policy and records of reviews to verify the policy is reviewed at least once every 12 months and updated as needed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.1.3',
      title: 'Security roles and responsibilities',
      question:
        'Does the security policy clearly define information security roles and responsibilities for all personnel, and are all personnel aware of and do they acknowledge their information security responsibilities?',
      requirement:
        'The security policy clearly defines information security roles and responsibilities for all personnel, and all personnel are aware of and acknowledge their information security responsibilities.',
      testing: [
        'Examine the information security policy to verify that roles and responsibilities are clearly defined.',
        'Examine documented acknowledgements and interview personnel to verify they are aware of and acknowledge their responsibilities.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.1.4',
      title: 'Executive responsibility for information security',
      question:
        'Is responsibility for information security formally assigned to a Chief Information Security Officer or other information security knowledgeable member of executive management?',
      requirement:
        'Responsibility for information security is formally assigned to a Chief Information Security Officer or other information security knowledgeable member of executive management.',
      testing: [
        'Examine the information security policy and organizational documentation to verify that responsibility is formally assigned to a CISO or other knowledgeable member of executive management.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.2.1',
      title: 'Acceptable use policies',
      question:
        'Are acceptable use policies for end-user technologies documented and implemented, including explicit approval by authorized parties, acceptable uses of the technology, and a list of products approved by the company for employee use including hardware and software?',
      requirement:
        'Acceptable use policies for end-user technologies are documented and implemented, including: explicit approval by authorized parties; acceptable uses of the technology; list of products approved by the company for employee use, including hardware and software.',
      testing: [
        'Examine the acceptable use policies to verify all required elements are included.',
        'Interview personnel to verify the policies are implemented and understood.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.3.1',
      title: 'Targeted risk analyses for flexible requirements',
      question:
        'Is each PCI DSS requirement that provides flexibility for how frequently it is performed supported by a targeted risk analysis that is documented and includes identification of the assets being protected, identification of the threat(s) that the requirement is protecting against, identification of factors that contribute to the likelihood and/or impact of a threat being realized, a resulting analysis that determines and includes justification for how frequently the requirement must be performed to minimize the likelihood of the threat being realized, and a review of each targeted risk analysis at least once every 12 months?',
      requirement:
        'Each PCI DSS requirement that provides flexibility for how frequently it is performed (for example, requirements to be performed periodically) is supported by a targeted risk analysis that is documented and includes: identification of the assets being protected; identification of the threat(s) that the requirement is protecting against; identification of factors that contribute to the likelihood and/or impact of a threat being realized; resulting analysis that determines, and includes justification for, how frequently the requirement must be performed to minimize the likelihood of the threat being realized; review of each targeted risk analysis at least once every 12 months to determine whether the results are still valid or if an updated risk analysis is needed; performance of updated risk analyses when needed, as determined by the annual review.',
      testing: [
        'Examine documented policies and procedures to verify a process is defined for performing targeted risk analyses.',
        'Examine each targeted risk analysis to verify it includes all required elements and has been reviewed within the last 12 months.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.3.2',
      title: 'Targeted risk analysis for customized approach',
      question:
        'Is a targeted risk analysis performed for each PCI DSS requirement that your organization meets with the customized approach, including documented evidence detailing each element specified in Appendix D (Customized Approach), approval of documented evidence by senior management, and performance of the targeted analysis of risk at least once every 12 months?',
      requirement:
        'A targeted risk analysis is performed for each PCI DSS requirement that the entity meets with the customized approach, to include: documented evidence detailing each element specified in Appendix D: Customized Approach (including, at a minimum, a controls matrix and risk analysis); approval of documented evidence by senior management; performance of the targeted analysis of risk at least once every 12 months.',
      testing: [
        'Examine the targeted risk analysis for each requirement met with the customized approach to verify all required elements are documented and approved.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if your organization does not use the customized approach for any PCI DSS requirement.',
    },
    {
      id: '12.3.3',
      title: 'Cryptographic cipher suite inventory and review',
      question:
        'Are cryptographic cipher suites and protocols in use documented and reviewed at least once every 12 months, including an up-to-date inventory of all cryptographic cipher suites and protocols in use with purpose and where used, active monitoring of industry trends regarding continued viability of all cryptographic cipher suites and protocols in use, and a documented strategy to respond to anticipated changes in cryptographic vulnerabilities?',
      requirement:
        'Cryptographic cipher suites and protocols in use are documented and reviewed at least once every 12 months, including at least the following: an up-to-date inventory of all cryptographic cipher suites and protocols in use, including purpose and where used; active monitoring of industry trends regarding continued viability of all cryptographic cipher suites and protocols in use; a documented strategy to respond to anticipated changes in cryptographic vulnerabilities.',
      testing: [
        'Examine documentation of cryptographic cipher suites and protocols in use to verify the inventory is complete and current.',
        'Interview responsible personnel to verify monitoring and the documented response strategy are in place.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.3.4',
      title: 'Hardware and software technology review',
      question:
        'Are hardware and software technologies in use reviewed at least once every 12 months, including analysis that the technologies continue to receive security fixes from vendors promptly, analysis that the technologies continue to support and do not preclude your PCI DSS compliance, documentation of any industry announcements or trends related to a technology such as end-of-life plans, and documentation of a plan approved by executive management to remediate outdated technologies including those for which vendors have announced end-of-life plans?',
      requirement:
        'Hardware and software technologies in use are reviewed at least once every 12 months, including at least the following: analysis that the technologies continue to receive security fixes from vendors promptly; analysis that the technologies continue to support (and do not preclude) the entity’s PCI DSS compliance; documentation of any industry announcements or trends related to a technology, such as when a vendor has announced "end of life" plans for a technology; documentation of a plan, approved by executive management, to remediate outdated technologies, including those for which vendors have announced "end of life" plans.',
      testing: [
        'Examine documentation of the annual review of hardware and software technologies to verify all required elements are included.',
        'Examine the remediation plan and evidence of executive management approval.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.4.1',
      title: 'Executive responsibility for PCI DSS program (service providers)',
      question:
        'Is responsibility established by executive management for the protection of cardholder data and a PCI DSS compliance program, including overall accountability for maintaining PCI DSS compliance and defining a charter for a PCI DSS compliance program and communication to executive management?',
      requirement:
        'Additional requirement for service providers only: Responsibility is established by executive management for the protection of cardholder data and a PCI DSS compliance program to include: overall accountability for maintaining PCI DSS compliance; defining a charter for a PCI DSS compliance program and communication to executive management.',
      testing: [
        'Examine documentation to verify that executive management has established responsibility for the protection of cardholder data and a PCI DSS compliance program.',
        'Examine the PCI DSS compliance program charter and evidence of communication to executive management.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.4.2',
      title: 'Quarterly reviews of personnel task performance (service providers)',
      question:
        'At least once every three months, are reviews performed by personnel other than those responsible for performing the given task to confirm that personnel are performing their tasks in accordance with all security policies and all operational procedures?',
      requirement:
        'Additional requirement for service providers only: At least once every three months, reviews are performed to confirm that personnel are performing their tasks in accordance with all security policies and all operational procedures. Reviews are performed by personnel other than those responsible for performing the given task and include, but are not limited to, the following tasks: daily log reviews; configuration reviews for network security controls; applying configuration standards to new systems; responding to security alerts; change management processes.',
      testing: [
        'Examine documented policies and procedures to verify a process is defined for conducting reviews at least once every three months.',
        'Examine records of reviews and interview personnel to verify that reviews are performed by personnel other than those performing the task.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.4.2.1',
      title: 'Documentation of quarterly reviews (service providers)',
      question:
        'Are the reviews performed in accordance with Requirement 12.4.2 documented to include results of the reviews, documented remediation actions taken for any tasks that were found to not be performed, and review and sign-off of results by personnel assigned responsibility for the PCI DSS compliance program?',
      requirement:
        'Additional requirement for service providers only: Reviews conducted in accordance with Requirement 12.4.2 are documented to include: results of the reviews; documented remediation actions taken for any tasks that were found to not be performed at Requirement 12.4.2; review and sign-off of results by personnel assigned responsibility for the PCI DSS compliance program.',
      testing: [
        'Examine documentation of the reviews to verify all required elements are documented and signed off.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.5.1',
      title: 'Inventory of in-scope system components',
      question:
        'Is an inventory of system components that are in scope for PCI DSS, including a description of function/use, maintained and kept current?',
      requirement:
        'An inventory of system components that are in scope for PCI DSS, including a description of function/use, is maintained and kept current.',
      testing: [
        'Examine the inventory to verify it includes all in-scope system components and a description of function/use for each.',
        'Interview personnel to verify the inventory is kept current.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.5.2',
      title: 'Annual scope confirmation',
      question:
        'Is PCI DSS scope documented and confirmed by your organization at least once every 12 months and upon significant change to the in-scope environment, with the confirmation including identifying all data flows for the various payment stages and acceptance channels, updating all data-flow diagrams, identifying all locations where account data is stored/processed/transmitted, identifying all system components in the CDE or connected to or that could affect the security of the CDE, identifying all segmentation controls in use, identifying all connections from third-party entities with access to the CDE, and confirming that all identified data flows, account data, system components, segmentation controls, and connections from third parties are included in scope?',
      requirement:
        'PCI DSS scope is documented and confirmed by the entity at least once every 12 months and upon significant change to the in-scope environment. At a minimum, the scoping validation includes: identifying all data flows for the various payment stages and acceptance channels; updating all data-flow diagrams per Requirement 1.2.4; identifying all locations where account data is stored, processed, and transmitted; identifying all system components in the CDE, connected to the CDE, or that could impact security of the CDE; identifying all segmentation controls in use and the environment(s) from which the CDE is segmented; identifying all connections from third-party entities with access to the CDE; confirming that all identified data flows, account data, system components, segmentation controls, and connections from third parties with access to the CDE are included in scope.',
      testing: [
        'Examine documented results of scope reviews to verify the reviews are performed at least once every 12 months and after significant changes.',
        'Interview personnel to verify that the reviews include all required elements.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.5.2.1',
      title: 'Six-monthly scope confirmation (service providers)',
      question:
        'Is PCI DSS scope documented and confirmed by your organization at least once every six months and upon significant change to the in-scope environment?',
      requirement:
        'Additional requirement for service providers only: PCI DSS scope is documented and confirmed by the entity at least once every six months and upon significant change to the in-scope environment. At a minimum, the scoping validation includes all the elements specified in Requirement 12.5.2.',
      testing: [
        'Examine documented results of scope reviews to verify the reviews are performed at least once every six months and after significant changes.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.5.3',
      title: 'Organizational change impact review (service providers)',
      question:
        'Do significant changes to organizational structure result in a documented internal review of the impact to PCI DSS scope and applicability of controls, with results communicated to executive management?',
      requirement:
        'Additional requirement for service providers only: Significant changes to organizational structure result in a documented (internal) review of the impact to PCI DSS scope and applicability of controls, with results communicated to executive management.',
      testing: [
        'Examine policies and procedures to verify a process is defined for reviewing the impact of organizational changes on PCI DSS scope.',
        'Examine documentation of reviews and evidence of communication to executive management.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.6.1',
      title: 'Security awareness program',
      question:
        'Is a formal security awareness program implemented to make all personnel aware of your information security policy and procedures, and their role in protecting the cardholder data?',
      requirement:
        'A formal security awareness program is implemented to make all personnel aware of the entity’s information security policy and procedures, and their role in protecting the cardholder data.',
      testing: [
        'Examine the security awareness program to verify it is formal and documented.',
        'Interview personnel to verify they are aware of the policy and their role in protecting cardholder data.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.6.2',
      title: 'Annual review of awareness program',
      question:
        'Is the security awareness program reviewed at least once every 12 months and updated as needed to address any new threats and vulnerabilities that may impact the security of the CDE, and to communicate to personnel their role in protecting cardholder data?',
      requirement:
        'The security awareness program is: reviewed at least once every 12 months; updated as needed to address any new threats and vulnerabilities that may impact the security of the entity’s CDE, or the information provided to personnel about their role in protecting cardholder data.',
      testing: [
        'Examine security awareness program content and records of reviews to verify the program is reviewed at least once every 12 months and updated as needed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.6.3',
      title: 'Personnel security awareness training',
      question:
        'Do personnel receive security awareness training upon hire and at least once every 12 months, with multiple methods of communication used, and do personnel acknowledge at least once every 12 months that they have read and understood the information security policy and procedures?',
      requirement:
        'Personnel receive security awareness training as follows: upon hire and at least once every 12 months; multiple methods of communication are used; personnel acknowledge at least once every 12 months that they have read and understood the information security policy and procedures.',
      testing: [
        'Examine security awareness program records to verify that personnel attend training upon hire and at least once every 12 months.',
        'Examine documented acknowledgements from personnel.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.6.3.1',
      title: 'Phishing and social engineering awareness',
      question:
        'Does security awareness training include awareness of threats and vulnerabilities that could impact the security of the CDE, including but not limited to phishing and related attacks, and social engineering?',
      requirement:
        'Security awareness training includes awareness of threats and vulnerabilities that could impact the security of the CDE, including but not limited to: phishing and related attacks; social engineering.',
      testing: [
        'Examine security awareness training content to verify it includes awareness of phishing, related attacks, and social engineering.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.6.3.2',
      title: 'Acceptable use awareness',
      question:
        'Does security awareness training include awareness about the acceptable use of end-user technologies in accordance with Requirement 12.2.1?',
      requirement:
        'Security awareness training includes awareness about the acceptable use of end-user technologies in accordance with Requirement 12.2.1.',
      testing: [
        'Examine security awareness training content to verify it includes awareness about the acceptable use of end-user technologies.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.7.1',
      title: 'Personnel screening',
      question:
        'Are potential personnel who will have access to the CDE screened, within the constraints of local laws, prior to hire to minimize the risk of attacks from internal sources?',
      requirement:
        'Potential personnel who will have access to the CDE are screened, within the constraints of local laws, prior to hire to minimize the risk of attacks from internal sources.',
      testing: [
        'Examine screening procedures and interview responsible human resource personnel to verify that screening is conducted prior to hire for personnel who will have access to the CDE.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.8.1',
      title: 'List of third-party service providers',
      question:
        'Is a list of all third-party service providers (TPSPs) with which account data is shared, or that could affect the security of account data, maintained, including a description of the services provided by each?',
      requirement:
        'A list of all third-party service providers (TPSPs) with which account data is shared or that could affect the security of account data is maintained, including a description for each of the services provided.',
      testing: [
        'Examine the list of TPSPs to verify it includes all TPSPs with which account data is shared or that could affect the security of account data.',
        'Examine the list to verify a description of services provided is included for each.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.8.2',
      title: 'Written agreements with TPSPs',
      question:
        'Are written agreements maintained with all TPSPs with which account data is shared or that could affect the security of account data, and do those written agreements include acknowledgements from TPSPs that they are responsible for the security of account data the TPSPs possess or otherwise store, process, or transmit on behalf of your organization, or to the extent that they could impact the security of your CDE?',
      requirement:
        'Written agreements with TPSPs are maintained as follows: written agreements are maintained with all TPSPs with which account data is shared or that could affect the security of the CDE; written agreements include acknowledgments from TPSPs that they are responsible for the security of account data the TPSPs possess or otherwise store, process, or transmit on behalf of the entity, or to the extent that they could impact the security of the entity’s CDE.',
      testing: [
        'Examine written agreements with TPSPs to verify they include the required acknowledgements.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.8.3',
      title: 'Due diligence for engaging TPSPs',
      question:
        'Is an established process implemented for engaging TPSPs, including proper due diligence prior to engagement?',
      requirement:
        'An established process is implemented for engaging TPSPs, including proper due diligence prior to engagement.',
      testing: [
        'Examine policies and procedures to verify that processes are defined for engaging TPSPs, including due diligence prior to engagement.',
        'Examine evidence and interview personnel to verify the process was followed for recently engaged TPSPs.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.8.4',
      title: 'Monitoring TPSP compliance status',
      question:
        'Is a program implemented to monitor TPSPs’ PCI DSS compliance status at least once every 12 months?',
      requirement:
        'A program is implemented to monitor TPSPs’ PCI DSS compliance status at least once every 12 months.',
      testing: [
        'Examine policies and procedures to verify that processes are defined to monitor TPSPs’ PCI DSS compliance status at least once every 12 months.',
        'Examine documentation of monitoring activities to verify the program is implemented.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.8.5',
      title: 'Responsibility matrix for TPSPs',
      question:
        'Is information maintained about which PCI DSS requirements are managed by each TPSP, which are managed by your organization, and any that are shared between the TPSP and your organization?',
      requirement:
        'Information is maintained about which PCI DSS requirements are managed by each TPSP, which are managed by the entity, and any that are shared between the TPSP and the entity.',
      testing: [
        'Examine the documented responsibility matrix and interview personnel to verify it identifies which requirements are managed by each TPSP, by the entity, and shared.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.9.1',
      title: 'Written acknowledgement to customers (service providers)',
      question:
        'Does your organization acknowledge in writing to customers that it is responsible for the security of account data it possesses or otherwise stores, processes, or transmits on behalf of the customer, or to the extent that it could impact the security of the customer’s CDE?',
      requirement:
        'Additional requirement for service providers only: TPSPs acknowledge in writing to customers that they are responsible for the security of account data the TPSP possesses or otherwise stores, processes, or transmits on behalf of the customer, or to the extent that they could impact the security of the customer’s cardholder data environment.',
      testing: [
        'Examine TPSP policies, procedures, and templates used for written agreements to verify that the acknowledgement is provided to customers.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.9.2',
      title: 'Supporting customer information requests (service providers)',
      question:
        'Does your organization support its customers’ requests for information to meet Requirements 12.8.4 and 12.8.5 by providing, upon customer request, PCI DSS compliance status information for any service performed on behalf of customers, and information about which PCI DSS requirements are the responsibility of your organization and which are the responsibility of the customer, including any shared responsibilities?',
      requirement:
        'Additional requirement for service providers only: TPSPs support their customers’ requests for information to meet Requirements 12.8.4 and 12.8.5 by providing the following upon customer request: PCI DSS compliance status information for any service the TPSP performs on behalf of customers (Requirement 12.8.4); information about which PCI DSS requirements are the responsibility of the TPSP and which are the responsibility of the customer, including any shared responsibilities (Requirement 12.8.5).',
      testing: [
        'Examine policies and procedures to verify processes are defined to support customers’ requests for information.',
        'Examine evidence of information provided to customers upon request.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.10.1',
      title: 'Incident response plan',
      question:
        'Does an incident response plan exist that is ready to be activated in the event of a suspected or confirmed security incident, and does the plan include roles, responsibilities, and communication and contact strategies including notification of payment brands and acquirers at a minimum, incident response procedures with specific containment and mitigation activities for different types of incidents, business recovery and continuity procedures, data backup processes, analysis of legal requirements for reporting compromises, coverage and responses of all critical system components, and reference or inclusion of incident response procedures from the payment brands?',
      requirement:
        'An incident response plan exists and is ready to be activated in the event of a suspected or confirmed security incident. The plan includes, but is not limited to: roles, responsibilities, and communication and contact strategies in the event of a suspected or confirmed security incident, including notification of payment brands and acquirers, at a minimum; incident response procedures with specific containment and mitigation activities for different types of incidents; business recovery and continuity procedures; data backup processes; analysis of legal requirements for reporting compromises; coverage and responses of all critical system components; reference or inclusion of incident response procedures from the payment brands.',
      testing: [
        'Examine the incident response plan to verify it includes all required elements.',
        'Interview personnel and examine documentation from previously reported incidents or alerts to verify the plan is ready to be activated.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.2',
      title: 'Annual review and testing of the incident response plan',
      question:
        'At least once every 12 months, is the security incident response plan reviewed and the content updated as needed, and tested including all elements listed in Requirement 12.10.1?',
      requirement:
        'At least once every 12 months, the security incident response plan is: reviewed and the content is updated as needed; tested, including all elements listed in Requirement 12.10.1.',
      testing: [
        'Examine documentation of reviews and testing of the incident response plan to verify these occur at least once every 12 months and include all required elements.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.3',
      title: '24/7 incident response availability',
      question:
        'Are specific personnel designated to be available on a 24/7 basis to respond to suspected or confirmed security incidents?',
      requirement:
        'Specific personnel are designated to be available on a 24/7 basis to respond to suspected or confirmed security incidents.',
      testing: [
        'Examine documentation and interview responsible personnel to verify that specific personnel are designated and available on a 24/7 basis.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.4',
      title: 'Incident response personnel training',
      question:
        'Are personnel responsible for responding to suspected or confirmed security incidents appropriately and periodically trained on their incident response responsibilities?',
      requirement:
        'Personnel responsible for responding to suspected or confirmed security incidents are appropriately and periodically trained on their incident response responsibilities.',
      testing: [
        'Examine training records and interview personnel to verify that incident response personnel are appropriately and periodically trained.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.4.1',
      title: 'Training frequency defined by risk analysis',
      question:
        'Is the frequency of periodic training for incident response personnel defined in your targeted risk analysis performed according to Requirement 12.3.1?',
      requirement:
        'The frequency of periodic training for incident response personnel is defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1.',
      testing: [
        'Examine the targeted risk analysis for the frequency of incident response training to verify it is defined and justified.',
        'Examine training records to verify training occurs at the defined frequency.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.5',
      title: 'Monitoring and responding to security alerts',
      question:
        'Does the security incident response plan include monitoring and responding to alerts from security monitoring systems, including intrusion-detection and intrusion-prevention systems, network security controls, change-detection mechanisms for critical files, the change- and tamper-detection mechanism for payment pages, and detection of unauthorized wireless access points?',
      requirement:
        'The security incident response plan includes monitoring and responding to alerts from security monitoring systems, including but not limited to: intrusion-detection and intrusion-prevention systems; network security controls; change-detection mechanisms for critical files; the change-and tamper-detection mechanism for payment pages; detection of unauthorized wireless access points.',
      testing: [
        'Examine the security incident response plan to verify it includes monitoring and responding to alerts from all specified security monitoring systems.',
        'Examine records of alerts and responses to verify the plan is followed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.6',
      title: 'Evolving the incident response plan',
      question:
        'Is the security incident response plan modified and evolved according to lessons learned and to incorporate industry developments?',
      requirement:
        'The security incident response plan is modified and evolved according to lessons learned and to incorporate industry developments.',
      testing: [
        'Examine policies and procedures to verify a process is defined to modify and evolve the plan according to lessons learned and industry developments.',
        'Examine documentation of modifications to the plan and interview personnel.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.7',
      title: 'Response to PAN found where not expected',
      question:
        'Are incident response procedures in place, to be initiated upon the detection of stored PAN anywhere it is not expected, that include determining what to do if PAN is discovered outside the CDE including its retrieval, secure deletion, and/or migration into the currently defined CDE as applicable, identifying whether sensitive authentication data is stored with PAN, determining where the account data came from and how it ended up where it was not expected, and remediating data leaks or process gaps that resulted in the account data being where it was not expected?',
      requirement:
        'Incident response procedures are in place, to be initiated upon the detection of stored PAN anywhere it is not expected, and include: determining what to do if PAN is discovered outside the CDE, including its retrieval, secure deletion, and/or migration into the currently defined CDE, as applicable; identifying whether sensitive authentication data is stored with PAN; determining where the account data came from and how it ended up where it was not expected; remediating data leaks or process gaps that resulted in the account data being where it was not expected.',
      testing: [
        'Examine documented incident response procedures to verify that procedures for responding to the detection of stored PAN anywhere it is not expected include all required elements.',
        'Interview personnel and examine records of responses to verify the procedures are implemented.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
