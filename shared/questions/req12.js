export default {
  id: 12,
  title: 'Support Information Security with Organizational Policies and Programs',
  goal: 'Maintain an Information Security Policy',
  intro:
    'Technical controls only hold if the organisation around them expects them to. A written policy is how an entity says what it expects of its people, and the programmes under it — training, screening, vendor oversight, incident response — are how that expectation becomes practice.',
  questions: [
    {
      id: '12.1.1',
      title: 'Overall information security policy',
      question:
        'Is there an overarching information security policy that has been settled, published, kept up, and put in the hands of the staff it applies to as well as the vendors and business partners it applies to?',
      requirement:
        'An overarching information security policy has been settled on and published, is maintained, and has been circulated to every member of staff it concerns, and to the vendors and business partners it concerns.',
      testing: [
        'Read the information security policy and confirm it has been settled and published.',
        'Ask staff to confirm the policy reached them and is understood.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.1.2',
      title: 'Annual policy review',
      question:
        'Is that policy revisited at intervals no longer than 12 months, and amended where the business’s objectives or the risks to its environment have moved?',
      requirement:
        'The information security policy is revisited at intervals no longer than 12 months, and is amended as needed to keep pace with changes in the business’s objectives or in the risks facing its environment.',
      testing: [
        'Read the policy and the records of its reviews, confirming it is revisited at least that often and amended where needed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.1.3',
      title: 'Security roles and responsibilities',
      question:
        'Does the policy spell out each person’s information security role and duties, and do staff know about theirs and acknowledge them?',
      requirement:
        'The security policy sets out plainly the information security role and duties of every member of staff, and staff both know what theirs are and acknowledge them.',
      testing: [
        'Read the information security policy and confirm roles and duties are set out plainly.',
        'Read the recorded acknowledgements and ask staff, confirming they know their duties and have acknowledged them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.1.4',
      title: 'Executive responsibility for information security',
      question:
        'Has information security been formally placed with a chief information security officer, or with another member of the executive who knows the subject?',
      requirement:
        'Responsibility for information security is formally vested in a chief information security officer, or in another member of executive management with knowledge of information security.',
      testing: [
        'Read the information security policy and the organisational documentation, confirming the responsibility is formally vested in such a person.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.2.1',
      title: 'Acceptable use policies',
      question:
        'Are acceptable use policies for end-user technology written down and actually applied — carrying express approval from those authorised to give it, saying what use of the technology is acceptable, and listing the hardware and software products the company has approved for staff use?',
      requirement:
        'Acceptable use policies covering end-user technology are written down and put into practice. They carry express approval from parties authorised to give it; they state what uses of the technology are acceptable; and they list the products the company has approved for employee use, hardware and software alike.',
      testing: [
        'Read the acceptable use policies and confirm each of those points appears.',
        'Ask staff to confirm the policies are applied and understood.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.3.1',
      title: 'Targeted risk analyses for flexible requirements',
      question:
        'For every PCI DSS requirement that leaves the frequency up to you, is there a written targeted risk analysis behind the interval you chose — naming the assets being protected, naming the threat the requirement guards against, naming what makes that threat more likely or more damaging, reasoning from those to the interval and justifying it, revisited at intervals no longer than 12 months, and redone when that annual look says it should be?',
      requirement:
        'Every PCI DSS requirement that leaves its frequency to the entity — anything to be done on a recurring basis — rests on a written targeted risk analysis. That analysis names the assets being protected; names the threat or threats the requirement guards against; names the factors bearing on how likely the threat is to be realised, or how damaging it would be; reasons from those to how often the requirement must be carried out in order to keep the threat unlikely, and justifies that conclusion; is revisited at intervals no longer than 12 months, to establish whether its conclusions still hold or a fresh analysis is needed; and is redone where that annual look determines it should be.',
      testing: [
        'Read the documented policies and procedures and confirm a process for carrying out these analyses is laid down.',
        'Read each targeted risk analysis and confirm it covers each of those points and has been revisited within the last 12 months.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.3.2',
      title: 'Targeted risk analysis for customized approach',
      question:
        'For each requirement you satisfy by the customized approach, is a targeted risk analysis carried out — with written evidence covering every element Appendix D sets out, senior management approving that evidence, and the analysis redone at intervals no longer than 12 months?',
      requirement:
        'A targeted risk analysis is carried out for every PCI DSS requirement the entity satisfies by way of the customized approach. It comprises: written evidence addressing each element set out in Appendix D, which covers as a minimum a controls matrix and a risk analysis; approval of that evidence by senior management; and repetition of the analysis at intervals no longer than 12 months.',
      testing: [
        'For every requirement satisfied that way, read its targeted risk analysis and confirm each element is written down and approved.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if your organization does not use the customized approach for any PCI DSS requirement.',
    },
    {
      id: '12.3.3',
      title: 'Cryptographic cipher suite inventory and review',
      question:
        'Are the cipher suites and protocols you use written down and reviewed at intervals no longer than 12 months — with a current inventory saying what each is for and where it is used, active attention to industry thinking on whether each remains viable, and a written plan for what you will do as cryptographic weaknesses emerge?',
      requirement:
        'Whatever cipher suites and cryptographic protocols the entity runs are recorded, and come under review at intervals no longer than 12 months. That covers at least: a current inventory of every cipher suite and protocol in use, stating its purpose and where it is used; active attention to industry thinking on whether each remains viable; and a written strategy for responding to cryptographic weaknesses as they are anticipated.',
      testing: [
        'Read the documentation of the cipher suites and protocols in use and confirm the inventory is complete and current.',
        'Ask the responsible staff to confirm the monitoring happens and that the written response strategy exists.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.3.4',
      title: 'Hardware and software technology review',
      question:
        'Is the hardware and software you run reviewed at intervals no longer than 12 months — considering whether each still gets timely security fixes from its vendor, whether each still allows you to stay compliant, recording any industry announcement or trend such as an end-of-life notice, and recording a plan, approved by the executive, for replacing what has gone out of date?',
      requirement:
        'Whatever hardware and software the entity runs comes under review at intervals no longer than 12 months. That review covers at least: consideration of whether each technology still receives security fixes from its vendor promptly; consideration of whether each still permits, rather than obstructs, the entity’s PCI DSS compliance; a record of any industry announcement or trend bearing on a technology, such as a vendor declaring it end of life; and a record of a plan, approved by executive management, for dealing with technologies that have gone out of date, those declared end of life among them.',
      testing: [
        'Read the documentation of this annual review and confirm each of those points is covered.',
        'Read the replacement plan and the evidence that executive management approved it.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.4.1',
      title: 'Executive responsibility for PCI DSS program (service providers)',
      question:
        'Has the executive taken on responsibility for protecting cardholder data and for a compliance programme — holding overall accountability for staying compliant, and setting out a charter for that programme which is communicated up to the executive?',
      requirement:
        'An extra obligation on service providers. Executive management has assumed responsibility for the protection of cardholder data and for a PCI DSS compliance programme. That takes in overall accountability for remaining compliant, and the settling of a charter for the compliance programme, which is communicated to executive management.',
      testing: [
        'Read the documentation confirming executive management has assumed responsibility for protecting cardholder data and for a compliance programme.',
        'Read the programme charter and the evidence that it was communicated to executive management.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.4.2',
      title: 'Quarterly reviews of personnel task performance (service providers)',
      question:
        'At intervals no longer than three months, does somebody other than the person doing a task check that staff are carrying out their tasks in line with the security policies and operating procedures?',
      requirement:
        'An extra obligation on service providers. At intervals no longer than three months, checks establish that staff are carrying out their tasks in line with the security policies and the operating procedures. Each check is performed by someone other than the person responsible for the task under review. The tasks covered take in, without being limited to: the daily log reviews; review of how the network security controls are configured; the application of hardening standards to newly built systems; the handling of security alerts; and the change management process.',
      testing: [
        'Read the documented policies and procedures and confirm a process for these checks is laid down with an interval of no more than three months.',
        'Read the records of the checks and ask staff, confirming each was performed by someone other than the person responsible for the task.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.4.2.1',
      title: 'Documentation of quarterly reviews (service providers)',
      question:
        'Are those checks written up — what they found, what was put right where a task was not being done, and sign-off by whoever holds responsibility for the compliance programme?',
      requirement:
        'An extra obligation on service providers. The checks carried out under Requirement 12.4.2 are written up, recording: what each check found; what remediation followed where a task covered by Requirement 12.4.2 was found not to be happening; and the review and sign-off of the findings by the personnel who hold responsibility for the PCI DSS compliance programme.',
      testing: [
        'Read the write-ups of the checks and confirm each of those points is recorded and signed off.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.5.1',
      title: 'Inventory of in-scope system components',
      question:
        'Is there an inventory of the system components in scope, saying what each is for, and is it kept current?',
      requirement:
        'An inventory of the system components within PCI DSS scope is kept and kept current, and it describes what each component does or is used for.',
      testing: [
        'Read the inventory and confirm it covers every in-scope system component and describes the function or use of each.',
        'Ask staff to confirm the inventory is kept current.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.5.2',
      title: 'Annual scope confirmation',
      question:
        'Do you write down and confirm your PCI DSS scope at intervals no longer than 12 months, and again after a significant change — tracing the data flows for each payment stage and acceptance channel, bringing the data-flow diagrams up to date, finding every place account data is stored, processed or transmitted, finding every component in the cardholder data environment, connected to it, or able to affect its security, finding every segmentation control in use, finding every third-party connection into that environment, and then confirming all of it sits inside your stated scope?',
      requirement:
        'The entity records and confirms its PCI DSS scope at intervals no longer than 12 months, and again upon any significant change to the in-scope environment. That confirmation covers, as a minimum: tracing every data flow across the various payment stages and acceptance channels; bringing every data-flow diagram up to date, as Requirement 1.2.4 provides; finding every location at which account data is stored, processed or transmitted; finding every system component inside the cardholder data environment, connected to it, or capable of affecting its security; finding every segmentation control in use, and the environments the cardholder data environment is segmented from; finding every connection from a third party that has access to that environment; and establishing that all of the above — the flows, the account data, the components, the segmentation controls and the third-party connections — falls inside the scope as stated.',
      testing: [
        'Read the recorded results of these scope reviews and confirm they happen at least every 12 months and after significant changes.',
        'Ask staff to confirm the reviews cover each of those points.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.5.2.1',
      title: 'Six-monthly scope confirmation (service providers)',
      question:
        'Do you write down and confirm your scope at intervals no longer than six months, and again after a significant change to the in-scope environment?',
      requirement:
        'An extra obligation on service providers. The entity records and confirms its PCI DSS scope at intervals no longer than six months, and again upon any significant change to the in-scope environment. The confirmation covers, as a minimum, everything Requirement 12.5.2 sets out.',
      testing: [
        'Read the recorded results of these scope reviews and confirm they happen at least every six months and after significant changes.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.5.3',
      title: 'Organizational change impact review (service providers)',
      question:
        'When the shape of the organisation changes significantly, does an internal review follow that records the effect on scope and on which controls apply, with the findings passed to the executive?',
      requirement:
        'An extra obligation on service providers. A significant change to organisational structure is followed by an internal review, recorded in writing, of what that change does to PCI DSS scope and to which controls apply; and the findings are communicated to executive management.',
      testing: [
        'Read the policies and procedures and confirm a process for reviewing the effect of organisational change on scope is laid down.',
        'Read the records of such reviews and the evidence they were communicated to executive management.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.6.1',
      title: 'Security awareness program',
      question:
        'Is there a formal awareness programme through which staff come to know your policy and procedures on information security, and to understand their own part in keeping cardholder data safe?',
      requirement:
        'A formal security awareness programme is in place. Through it, staff come to know the entity’s policy and procedures on information security, and to understand the part each of them plays in keeping cardholder data safe.',
      testing: [
        'Read the security awareness programme and confirm it is formal and written down.',
        'Ask staff to confirm they know the policy and know their part in protecting cardholder data.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.6.2',
      title: 'Annual review of awareness program',
      question:
        'Is that programme reviewed at intervals no longer than 12 months, and amended where new threats and weaknesses bear on the security of the cardholder data environment, or where what staff are told about their own part needs updating?',
      requirement:
        'The security awareness programme is reviewed at intervals no longer than 12 months, and is amended as needed to take account of new threats and weaknesses bearing on the security of the entity’s cardholder data environment, or to update what staff are told about the part they play in protecting cardholder data.',
      testing: [
        'Read the content of the awareness programme and the records of its reviews, confirming it is reviewed at least that often and amended where needed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.6.3',
      title: 'Personnel security awareness training',
      question:
        'Do staff get awareness training when they join and at intervals no longer than 12 months, delivered by more than one means, and do they acknowledge at least that often that they have read and understood the policy and procedures?',
      requirement:
        'Staff receive security awareness training on joining, and thereafter at intervals no longer than 12 months. More than one means of communication is used to deliver it. And at intervals no longer than 12 months, each member of staff confirms having read the policy and procedures on information security and having understood them.',
      testing: [
        'Read the awareness programme records and confirm staff are trained on joining and at least every 12 months thereafter.',
        'Read the acknowledgements staff have given.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.6.3.1',
      title: 'Phishing and social engineering awareness',
      question:
        'Does that training cover the threats and weaknesses that could bear on the cardholder data environment’s security, phishing and kindred attacks and social engineering among them?',
      requirement:
        'Security awareness training covers the threats and weaknesses capable of bearing on the security of the cardholder data environment. Those covered take in, without being limited to, phishing and attacks akin to it, and social engineering.',
      testing: [
        'Read the awareness training content and confirm phishing, kindred attacks, and social engineering are covered.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.6.3.2',
      title: 'Acceptable use awareness',
      question:
        'Does that training also cover acceptable use of end-user technology, as Requirement 12.2.1 provides?',
      requirement:
        'Security awareness training also covers the acceptable use of end-user technology, in the terms Requirement 12.2.1 sets out.',
      testing: [
        'Read the awareness training content and confirm acceptable use of end-user technology is covered.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.7.1',
      title: 'Personnel screening',
      question:
        'Are candidates who will have access to the cardholder data environment screened before hiring, so far as local law permits, to reduce the risk of an attack from inside?',
      requirement:
        'Candidates who will have access to the cardholder data environment are screened before they are hired, so far as local law allows, in order to reduce the risk of attack originating internally.',
      testing: [
        'Read the screening procedures and ask the responsible human resources staff, confirming screening happens before hiring for anyone who will have such access.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.8.1',
      title: 'List of third-party service providers',
      question:
        'Do you keep a list of every third-party service provider you share account data with, or that could bear on the security of account data, saying what service each provides?',
      requirement:
        'A list is kept of every third-party service provider with which account data is shared, and of every one capable of bearing on the security of account data. Against each is a description of the service it provides.',
      testing: [
        'Read the list and confirm it covers every such provider — those account data is shared with, and those capable of affecting its security.',
        'Read the list and confirm a description of the service provided accompanies each entry.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.8.2',
      title: 'Written agreements with TPSPs',
      question:
        'Do you hold written agreements with all those providers, and does each contain the provider’s acknowledgement that it is responsible for the security of the account data it holds, or stores, processes or transmits on your behalf, or for its conduct to the extent that could bear on your cardholder data environment’s security?',
      requirement:
        'Written agreements are held with every third-party service provider with which account data is shared, and with every one capable of bearing on the security of the cardholder data environment. Each such agreement contains that provider’s acknowledgement that it is responsible for the security of the account data it holds, or otherwise stores, processes or transmits on the entity’s behalf, and responsible to the extent its conduct could bear on the security of the entity’s cardholder data environment.',
      testing: [
        'Read the written agreements with those providers and confirm the acknowledgement appears in each.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.8.3',
      title: 'Due diligence for engaging TPSPs',
      question:
        'Is there a settled process for taking such a provider on, and does it include proper due diligence beforehand?',
      requirement:
        'A settled process governs the engagement of a third-party service provider, and it includes proper due diligence conducted before the engagement begins.',
      testing: [
        'Read the policies and procedures and confirm the engagement process, due diligence included, is laid down.',
        'Read the evidence and ask staff, confirming the process was followed for providers taken on recently.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.8.4',
      title: 'Monitoring TPSP compliance status',
      question:
        'Is there a programme under which you check each provider’s compliance standing at intervals no longer than 12 months?',
      requirement:
        'A programme is in place under which the PCI DSS compliance standing of each third-party service provider is checked at intervals no longer than 12 months.',
      testing: [
        'Read the policies and procedures and confirm such checking is laid down with an interval of no more than 12 months.',
        'Read the records of the checking and confirm the programme is actually running.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.8.5',
      title: 'Responsibility matrix for TPSPs',
      question:
        'Do you keep a record of which PCI DSS requirements each provider looks after, which you look after yourselves, and which the two of you share?',
      requirement:
        'A record is kept of which PCI DSS requirements are looked after by each third-party service provider, which are looked after by the entity, and which are shared between the two.',
      testing: [
        'Read the documented responsibility matrix and ask staff, confirming it identifies what each provider looks after, what the entity looks after, and what is shared.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no third-party service providers that handle account data or could affect the security of account data.',
    },
    {
      id: '12.9.1',
      title: 'Written acknowledgement to customers (service providers)',
      question:
        'Do you acknowledge to your customers in writing that you are responsible for the security of the account data you hold, or store, process or transmit for them, and responsible so far as your conduct could bear on their cardholder data environment’s security?',
      requirement:
        'An extra obligation on service providers. A provider acknowledges to its customers in writing that it is responsible for the security of the account data it holds, or otherwise stores, processes or transmits on a customer’s behalf, and responsible to the extent its conduct could bear on the security of that customer’s cardholder data environment.',
      testing: [
        'Read the provider’s policies, procedures and written-agreement templates, confirming this acknowledgement reaches customers.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.9.2',
      title: 'Supporting customer information requests (service providers)',
      question:
        'When a customer asks for what they need to satisfy Requirements 12.8.4 and 12.8.5, do you supply it — your compliance standing for any service you perform for them, and which requirements fall to you, which to them, and which are shared?',
      requirement:
        'An extra obligation on service providers. A provider assists its customers in meeting Requirements 12.8.4 and 12.8.5 by supplying, on a customer’s request: its PCI DSS compliance standing for any service it performs on that customer’s behalf, which answers Requirement 12.8.4; and a statement of which PCI DSS requirements fall to the provider, which fall to the customer, and which are shared, which answers Requirement 12.8.5.',
      testing: [
        'Read the policies and procedures and confirm a process for meeting such customer requests is laid down.',
        'Read the evidence of information actually supplied to customers on request.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '12.10.1',
      title: 'Incident response plan',
      question:
        'Is there an incident response plan ready to be put into action when an incident is suspected or confirmed, covering roles and duties, how and whom to communicate with — payment brands and acquirers at minimum — containment and mitigation steps for the different kinds of incident, business recovery and continuity, data backup, what the law requires you to report, every critical system component and the response for it, and the payment brands’ own incident procedures either included or referenced?',
      requirement:
        'An incident response plan exists and stands ready to be put into action when a security incident is suspected or confirmed. The plan takes in, without being limited to: roles and duties, and how and with whom to communicate should an incident be suspected or confirmed, which at minimum includes notifying the payment brands and the acquirers; response procedures setting out the containment and mitigation particular to each kind of incident; business recovery and continuity procedures; processes for backing up data; consideration of what the law requires by way of reporting a compromise; coverage of every critical system component and the response applicable to it; and the payment brands’ own incident response procedures, whether reproduced in the plan or referenced by it.',
      testing: [
        'Read the incident response plan and confirm each of those points appears.',
        'Ask staff and read the documentation from incidents or alerts previously reported, confirming the plan stands ready to be used.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.2',
      title: 'Annual review and testing of the incident response plan',
      question:
        'At intervals no longer than 12 months, is the plan reviewed and amended where needed, and exercised across everything Requirement 12.10.1 lists?',
      requirement:
        'At intervals no longer than 12 months, the incident response plan is reviewed and its content amended where needed, and it is exercised across every element that Requirement 12.10.1 lists.',
      testing: [
        'Read the records of the reviews and the exercises, confirming both happen at least that often and reach every required element.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.3',
      title: '24/7 incident response availability',
      question:
        'Are named people on call around the clock, every day, to respond when an incident is suspected or confirmed?',
      requirement:
        'Named personnel are designated to be available at any hour of any day to respond to a suspected or confirmed security incident.',
      testing: [
        'Read the documentation and ask the responsible staff, confirming named personnel are designated and available around the clock.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.4',
      title: 'Incident response personnel training',
      question:
        'Are the people who respond to incidents trained for it, suitably and on a recurring basis?',
      requirement:
        'The personnel responsible for responding to a suspected or confirmed security incident are trained for those duties, suitably and on a recurring basis.',
      testing: [
        'Read the training records and ask staff, confirming those who respond to incidents are suitably trained and trained recurrently.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.4.1',
      title: 'Training frequency defined by risk analysis',
      question:
        'Is the interval between those training sessions fixed by your targeted risk analysis, carried out as Requirement 12.3.1 lays down?',
      requirement:
        'The interval at which incident response personnel are trained is set by the entity’s targeted risk analysis, carried out against every element Requirement 12.3.1 specifies.',
      testing: [
        'Read the targeted risk analysis covering that training interval and confirm it is set out and justified.',
        'Read the training records and confirm training happened at that interval.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.5',
      title: 'Monitoring and responding to security alerts',
      question:
        'Does the plan cover watching and acting on alerts from your security monitoring — intrusion detection and prevention, the network security controls, change detection on critical files, the change- and tamper-detection on payment pages, and the detection of wireless access points you did not sanction?',
      requirement:
        'The incident response plan covers the watching of, and acting on, alerts raised by the security monitoring in place. The sources covered take in, without being limited to: the network security controls; systems that detect or prevent intrusion; change-detection on critical files; the change- and tamper-detection covering payment pages; and the detection of wireless access points that were never sanctioned.',
      testing: [
        'Read the incident response plan and confirm it covers watching and acting on alerts from each of those sources.',
        'Read the records of alerts and the responses to them, confirming the plan is followed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.6',
      title: 'Evolving the incident response plan',
      question:
        'Is the plan changed and developed in light of what past incidents taught you, and of what is happening in the industry?',
      requirement:
        'The incident response plan is altered and developed in light of lessons learned, and to take in developments across the industry.',
      testing: [
        'Read the policies and procedures and confirm a process for altering and developing the plan on those grounds is laid down.',
        'Read the record of alterations made to the plan and ask staff about them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '12.10.7',
      title: 'Response to PAN found where not expected',
      question:
        'Are there response procedures that start the moment a stored PAN turns up somewhere it should not be — settling what to do when one is found outside the cardholder data environment, whether that means retrieving it, securely deleting it or bringing it inside that environment; establishing whether sensitive authentication data sits alongside it; tracing the data back to its origin and working out by what route it arrived; and closing the leak or the process gap that let it happen?',
      requirement:
        'Response procedures exist, and are set in motion the moment a stored PAN is discovered somewhere it does not belong. They cover: settling what is to be done where PAN is found outside the cardholder data environment — retrieving it, securely deleting it, or bringing it within the currently defined environment, as the case requires; establishing whether sensitive authentication data is stored alongside the PAN; tracing the account data to its origin and working out by what route it arrived somewhere it did not belong; and closing the data leak, or the gap in a process, that allowed it to end up there.',
      testing: [
        'Read the documented response procedures for this situation and confirm each of those points is covered.',
        'Ask staff and read the records of past responses, confirming the procedures are actually used.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
