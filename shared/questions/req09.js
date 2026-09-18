export default {
  id: 9,
  title: 'Restrict Physical Access to Cardholder Data',
  goal: 'Implement Strong Access Control Measures',
  intro:
    'Any physical access to data or systems that store account data provides the opportunity for individuals to access and/or remove devices, data, systems, or hardcopies, and should be appropriately restricted.',
  questions: [
    {
      id: '9.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 9 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 9 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 9.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 9 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 9 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.2.1',
      title: 'Facility entry controls',
      question:
        'Are appropriate facility entry controls in place to restrict physical access to systems in the CDE?',
      requirement:
        'Appropriate facility entry controls are in place to restrict physical access to systems in the CDE.',
      testing: [
        'Observe entry controls and interview responsible personnel to verify that physical security controls are in place to restrict access to systems in the CDE.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.2.1.1',
      title: 'Monitoring of sensitive areas',
      question:
        'Is individual physical access to sensitive areas within the CDE monitored with either video cameras or physical access control mechanisms (or both), such that entry and exit points to/from sensitive areas are monitored, monitoring devices or mechanisms are protected from tampering or disabling, collected data is reviewed and correlated with other entries, and collected data is stored for at least three months unless otherwise restricted by law?',
      requirement:
        'Individual physical access to sensitive areas within the CDE is monitored with either video cameras or physical access control mechanisms (or both) as follows: entry and exit points to/from sensitive areas within the CDE are monitored; monitoring devices or mechanisms are protected from tampering or disabling; collected data is reviewed and correlated with other entries; collected data is stored for at least three months, unless otherwise restricted by law.',
      testing: [
        'Observe the monitoring mechanisms at entry and exit points to sensitive areas within the CDE.',
        'Examine collected data and interview personnel to verify data is reviewed, correlated, and stored for at least three months.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if there are no sensitive areas within your CDE (for example, where all CDE systems are hosted by a third party).',
    },
    {
      id: '9.2.2',
      title: 'Publicly accessible network jacks',
      question:
        'Are physical and/or logical controls implemented to restrict use of publicly accessible network jacks within the facility?',
      requirement:
        'Physical and/or logical controls are implemented to restrict use of publicly accessible network jacks within the facility.',
      testing: [
        'Interview responsible personnel and observe locations of publicly accessible network jacks to verify that controls restrict their use.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.2.3',
      title: 'Physical access to networking hardware',
      question:
        'Is physical access to wireless access points, gateways, networking/communications hardware, and telecommunication lines within the facility restricted?',
      requirement:
        'Physical access to wireless access points, gateways, networking/communications hardware, and telecommunication lines within the facility is restricted.',
      testing: [
        'Interview responsible personnel and observe the locations of wireless access points, gateways, networking hardware, and telecommunication lines to verify physical access is restricted.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.2.4',
      title: 'Consoles in sensitive areas',
      question:
        'Is access to consoles in sensitive areas restricted via locking when not in use?',
      requirement:
        'Access to consoles in sensitive areas is restricted via locking when not in use.',
      testing: [
        'Observe a system administrator’s attempt to log into consoles in sensitive areas and verify that they are locked to prevent unauthorized use.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if there are no consoles in sensitive areas within your CDE.',
    },
    {
      id: '9.3.1',
      title: 'Authorizing physical access for personnel',
      question:
        'Are procedures implemented for authorizing and managing physical access of personnel to the CDE, including identifying personnel, managing changes to an individual’s physical access requirements, revoking or terminating personnel identification, and limiting access to the identification process or system to authorized personnel?',
      requirement:
        'Procedures are implemented for authorizing and managing physical access of personnel to the CDE, including: identifying personnel; managing changes to an individual’s physical access requirements; revoking or terminating personnel identification; limiting access to the identification process or system to authorized personnel.',
      testing: [
        'Examine documented procedures to verify that procedures to authorize and manage physical access of personnel to the CDE are defined.',
        'Observe identification methods and processes and interview responsible personnel to verify the procedures are implemented.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.3.1.1',
      title: 'Physical access to sensitive areas',
      question:
        'Is physical access to sensitive areas within the CDE for personnel controlled such that access is authorized and based on individual job function, access is revoked immediately upon termination, and all physical access mechanisms such as keys and access cards are returned or disabled upon termination?',
      requirement:
        'Physical access to sensitive areas within the CDE for personnel is controlled as follows: access is authorized and based on individual job function; access is revoked immediately upon termination; all physical access mechanisms, such as keys, access cards, etc., are returned or disabled upon termination.',
      testing: [
        'Examine documented procedures and observe processes for authorizing and revoking access to sensitive areas.',
        'Interview responsible personnel and examine records of terminated personnel to verify access was revoked and mechanisms returned or disabled.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if there are no sensitive areas within your CDE.',
    },
    {
      id: '9.3.2',
      title: 'Visitor authorization and escort',
      question:
        'Are procedures implemented for authorizing and managing visitor access to the CDE, including that visitors are authorized before entering, escorted at all times, clearly identified and given a badge or other identification that expires, and that visitor badges or other identification visibly distinguish visitors from personnel?',
      requirement:
        'Procedures are implemented for authorizing and managing visitor access to the CDE, including: visitors are authorized before entering; visitors are escorted at all times; visitors are clearly identified and given a badge or other identification that expires; visitor badges or other identification visibly distinguishes visitors from personnel.',
      testing: [
        'Examine documented procedures and observe visitor handling to verify visitors are authorized, escorted, and identified.',
        'Observe the use of visitor badges to verify they expire and visibly distinguish visitors from personnel.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.3.3',
      title: 'Visitor badge surrender',
      question:
        'Are visitor badges or identification surrendered or deactivated before visitors leave the facility or at the date of expiration?',
      requirement:
        'Visitor badges or identification are surrendered or deactivated before visitors leave the facility or at the date of expiration.',
      testing: [
        'Observe visitors leaving the facility and interview personnel to verify that visitor badges or other identification are surrendered or deactivated.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.3.4',
      title: 'Visitor log',
      question:
        'Is a visitor log used to maintain a physical record of visitor activity within the facility and within sensitive areas, including the visitor’s name and the organization represented, the date and time of the visit, the name of the personnel authorizing physical access, and is the log retained for at least three months unless otherwise restricted by law?',
      requirement:
        'A visitor log is used to maintain a physical record of visitor activity within the facility and within sensitive areas, including: the visitor’s name and the organization represented; the date and time of the visit; the name of the personnel authorizing physical access; retaining the log for at least three months, unless otherwise restricted by law.',
      testing: [
        'Examine the visitor log and interview responsible personnel to verify that it contains all required elements.',
        'Examine storage locations to verify logs are retained for at least three months.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.4.1',
      title: 'Physical security of media',
      question:
        'Is all media with cardholder data physically secured?',
      requirement: 'All media with cardholder data is physically secured.',
      testing: [
        'Examine documented policies and procedures to verify that processes are defined for physically securing media with cardholder data.',
        'Interview personnel and observe storage locations to verify media is physically secured.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no media (electronic or hard copy) containing cardholder data.',
    },
    {
      id: '9.4.1.1',
      title: 'Offline media backups stored securely',
      question:
        'Are offline media backups with cardholder data stored in a secure location?',
      requirement:
        'Offline media backups with cardholder data are stored in a secure location.',
      testing: [
        'Examine documentation and interview personnel to verify that offline media backups are stored in a secure location.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no offline media backups containing cardholder data exist.',
    },
    {
      id: '9.4.1.2',
      title: 'Annual review of backup location security',
      question:
        'Is the security of the offline media backup location(s) with cardholder data reviewed at least once every 12 months?',
      requirement:
        'The security of the offline media backup location(s) with cardholder data is reviewed at least once every 12 months.',
      testing: [
        'Examine documentation of the reviews and interview personnel to verify the security of the backup location is reviewed at least once every 12 months.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no offline media backups containing cardholder data exist.',
    },
    {
      id: '9.4.2',
      title: 'Media classification',
      question:
        'Is all media with cardholder data classified in accordance with the sensitivity of the data?',
      requirement:
        'All media with cardholder data is classified in accordance with the sensitivity of the data.',
      testing: [
        'Examine documented procedures to verify that procedures are defined for classifying media with cardholder data.',
        'Examine media logs and interview personnel to verify media is classified.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no media containing cardholder data.',
    },
    {
      id: '9.4.3',
      title: 'Media sent outside the facility',
      question:
        'Is media with cardholder data sent outside the facility secured such that media sent outside the facility is logged, media is sent by secured courier or other delivery method that can be accurately tracked, and offsite tracking logs include details about media location?',
      requirement:
        'Media with cardholder data sent outside the facility is secured as follows: media sent outside the facility is logged; media is sent by secured courier or other delivery method that can be accurately tracked; offsite tracking logs include details about media location.',
      testing: [
        'Examine documented procedures and offsite tracking logs to verify that media sent outside the facility is logged and tracked.',
        'Interview personnel to verify that a secured courier or trackable delivery method is used.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no media with cardholder data is ever sent outside the facility.',
    },
    {
      id: '9.4.4',
      title: 'Management approval for media movement',
      question:
        'Does management approve all media with cardholder data that is moved outside the facility, including when media is distributed to individuals?',
      requirement:
        'Management approves all media with cardholder data that is moved outside the facility (including when media is distributed to individuals).',
      testing: [
        'Examine documented procedures and offsite media tracking logs to verify that management approval is obtained for all media moved outside the facility.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no media with cardholder data is ever moved outside the facility.',
    },
    {
      id: '9.4.5',
      title: 'Electronic media inventory logs',
      question:
        'Are inventory logs of all electronic media with cardholder data maintained?',
      requirement:
        'Inventory logs of all electronic media with cardholder data are maintained.',
      testing: [
        'Examine documented procedures to verify that processes are defined for maintaining electronic media inventory logs.',
        'Examine the inventory logs and interview personnel to verify they are maintained.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no electronic media containing cardholder data.',
    },
    {
      id: '9.4.5.1',
      title: 'Annual media inventories',
      question:
        'Are inventories of electronic media with cardholder data conducted at least once every 12 months?',
      requirement:
        'Inventories of electronic media with cardholder data are conducted at least once every 12 months.',
      testing: [
        'Examine inventory records and interview personnel to verify that inventories of electronic media are conducted at least once every 12 months.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no electronic media containing cardholder data.',
    },
    {
      id: '9.4.6',
      title: 'Destruction of hard-copy materials',
      question:
        'Are hard-copy materials with cardholder data destroyed when no longer needed for business or legal reasons, with materials cross-cut shredded, incinerated, or pulped so that cardholder data cannot be reconstructed, and materials stored in secure storage containers prior to destruction?',
      requirement:
        'Hard-copy materials with cardholder data are destroyed when no longer needed for business or legal reasons, as follows: materials are cross-cut shredded, incinerated, or pulped so that cardholder data cannot be reconstructed; materials are stored in secure storage containers prior to destruction.',
      testing: [
        'Examine the periodic media destruction policy and observe processes to verify hard-copy materials are destroyed as specified.',
        'Observe storage containers used for materials that contain information to be destroyed to verify they are secure.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no hard-copy materials containing cardholder data.',
    },
    {
      id: '9.4.7',
      title: 'Destruction of electronic media',
      question:
        'Is electronic media with cardholder data destroyed when no longer needed for business or legal reasons, via a secure wipe program in accordance with industry-accepted standards for secure deletion, or by otherwise physically destroying the media so that cardholder data cannot be reconstructed?',
      requirement:
        'Electronic media with cardholder data is destroyed when no longer needed for business or legal reasons via one of the following: the electronic media is destroyed; the cardholder data is rendered unrecoverable so that it cannot be reconstructed.',
      testing: [
        'Examine the periodic media destruction policy and observe processes to verify electronic media is destroyed or rendered unrecoverable.',
        'Interview personnel to verify that the process is followed.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no electronic media containing cardholder data.',
    },
    {
      id: '9.5.1',
      title: 'Protection of POI devices',
      question:
        'Are POI devices that capture payment card data via direct physical interaction with the payment card form factor protected from tampering and unauthorized substitution, including maintaining a list of POI devices, periodically inspecting POI devices to look for tampering or unauthorized substitution, and training personnel to be aware of suspicious behavior and to report tampering or unauthorized substitution of devices?',
      requirement:
        'POI devices that capture payment card data via direct physical interaction with the payment card form factor are protected from tampering and unauthorized substitution, including the following: maintaining a list of POI devices; periodically inspecting POI devices to look for tampering or unauthorized substitution; training personnel to be aware of suspicious behavior and to report tampering or unauthorized substitution of devices.',
      testing: [
        'Examine documented policies and procedures to verify processes are defined to protect POI devices.',
        'Interview personnel and observe processes to verify the procedures are implemented.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction (for example, e-commerce only).',
    },
    {
      id: '9.5.1.1',
      title: 'POI device list',
      question:
        'Is an up-to-date list of POI devices maintained that includes the make and model of the device, the location of the device, and the device serial number or other method of unique identification?',
      requirement:
        'An up-to-date list of POI devices is maintained, including: make and model of the device; location of device; device serial number or other methods of unique identification.',
      testing: [
        'Examine the list of POI devices to verify it includes all required elements.',
        'Observe a sample of devices and their locations and compare to the list to verify the list is accurate and up to date.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction.',
    },
    {
      id: '9.5.1.2',
      title: 'POI device inspections',
      question:
        'Are POI device surfaces periodically inspected to detect tampering and unauthorized substitution?',
      requirement:
        'POI device surfaces are periodically inspected to detect tampering and unauthorized substitution.',
      testing: [
        'Examine documented procedures to verify processes are defined for periodic inspection of POI device surfaces.',
        'Interview personnel and observe inspection processes to verify inspections are performed.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction.',
    },
    {
      id: '9.5.1.2.1',
      title: 'POI inspection frequency defined by risk analysis',
      question:
        'Is the frequency of periodic POI device inspections and the type of inspections performed defined in your targeted risk analysis performed according to Requirement 12.3.1?',
      requirement:
        'The frequency of periodic POI device inspections and the type of inspections performed is defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1.',
      testing: [
        'Examine the targeted risk analysis for POI device inspections to verify the frequency and type of inspections are defined and justified.',
        'Examine inspection records to verify inspections occur at the defined frequency.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction.',
    },
    {
      id: '9.5.1.3',
      title: 'POI personnel training',
      question:
        'Is training provided for personnel in POI environments to be aware of attempted tampering or replacement of POI devices, including verifying the identity of any third-party persons claiming to be repair or maintenance personnel before granting them access to modify or troubleshoot devices, procedures to ensure devices are not installed, replaced, or returned without verification, being aware of suspicious behavior around devices, and reporting suspicious behavior and indications of device tampering or substitution to appropriate personnel?',
      requirement:
        'Training is provided for personnel in POI environments to be aware of attempted tampering or replacement of POI devices, and includes: verifying the identity of any third-party persons claiming to be repair or maintenance personnel, before granting them access to modify or troubleshoot devices; procedures to ensure devices are not installed, replaced, or returned without verification; being aware of suspicious behavior around devices; reporting suspicious behavior and indications of device tampering or substitution to appropriate personnel.',
      testing: [
        'Examine training materials for personnel in POI environments to verify they include all required elements.',
        'Interview personnel in POI environments to verify they have received training and are aware of the procedures.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction.',
    },
  ],
};
