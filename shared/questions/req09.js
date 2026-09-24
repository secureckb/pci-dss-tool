export default {
  id: 9,
  title: 'Restrict Physical Access to Cardholder Data',
  goal: 'Implement Strong Access Control Measures',
  intro:
    'Somebody standing next to a system, a disk or a filing cabinet can take what is in it, and no amount of network control prevents that. Requirement 9 is about who can get into the room, who can walk out with the media, and who can interfere with the terminals customers put their cards into.',
  questions: [
    {
      id: '9.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 9 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 9. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 9.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 9 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 9 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.2.1',
      title: 'Facility entry controls',
      question:
        'Are there entry controls at the building suitable for keeping people physically away from the systems in the cardholder data environment?',
      requirement:
        'Entry controls suitable to the premises are in place, limiting who can physically reach the systems that make up the cardholder data environment.',
      testing: [
        'Watch the entry controls operate and ask the responsible staff, confirming physical measures keep people away from the cardholder data environment’s systems.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.2.1.1',
      title: 'Monitoring of sensitive areas',
      question:
        'Is each person’s entry into a sensitive area of the cardholder data environment watched — by camera, by access control mechanism, or both — with the ways in and out covered, the watching equipment itself protected from being tampered with or switched off, the recordings reviewed and matched against other records, and kept for at least three months unless the law says otherwise?',
      requirement:
        'Physical entry by an individual into a sensitive area of the cardholder data environment is monitored, by video camera or by physical access control mechanism, or by both. The arrangement runs as follows: the points of entry to and exit from those sensitive areas are covered; the monitoring equipment or mechanism is itself protected against tampering and against being disabled; what is collected is reviewed and matched against other records of entry; and what is collected is kept for no less than three months, except where the law restricts that.',
      testing: [
        'Watch the monitoring mechanisms covering the ways into and out of sensitive areas of the cardholder data environment.',
        'Read what has been collected and ask staff, confirming it is reviewed, matched against other records, and kept for at least three months.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if there are no sensitive areas within your CDE (for example, where all CDE systems are hosted by a third party).',
    },
    {
      id: '9.2.2',
      title: 'Publicly accessible network jacks',
      question:
        'Are there controls, physical or logical, that stop a network socket in a publicly reachable part of the premises being used?',
      requirement:
        'Physical controls, logical controls, or both, restrict the use of network jacks located where the public can reach them.',
      testing: [
        'Ask the responsible staff and look at where the publicly reachable network jacks are, confirming controls restrict their use.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.2.3',
      title: 'Physical access to networking hardware',
      question:
        'Is physical access restricted to the wireless access points, gateways, networking and communications hardware, and telecommunication lines on the premises?',
      requirement:
        'Physical access is restricted to the premises’ wireless access points, gateways, networking and communications hardware, and telecommunication lines.',
      testing: [
        'Ask the responsible staff and look at where that equipment and cabling sit, confirming physical access to it is restricted.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.2.4',
      title: 'Consoles in sensitive areas',
      question:
        'Are consoles in sensitive areas locked whenever nobody is using them?',
      requirement:
        'A console situated in a sensitive area is locked while not in use, so access through it is restricted.',
      testing: [
        'Watch an administrator try to sign in at a console in a sensitive area, confirming it is locked against use by anyone unauthorised.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if there are no consoles in sensitive areas within your CDE.',
    },
    {
      id: '9.3.1',
      title: 'Authorizing physical access for personnel',
      question:
        'Are there working procedures for granting and managing staff physical access to the cardholder data environment — identifying people, handling changes to what access an individual needs, withdrawing or ending their identification, and restricting who can operate the identification process or system?',
      requirement:
        'Procedures are in force for granting and managing staff physical access to the cardholder data environment. They cover: establishing who a person is; handling changes in what physical access an individual requires; withdrawing or cancelling a person’s identification; and confining use of the identification process or system to authorised personnel.',
      testing: [
        'Read the documented procedures and confirm the granting and managing of staff physical access to the cardholder data environment is laid down.',
        'Watch the identification methods in operation and ask the responsible staff, confirming the procedures are actually followed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.3.1.1',
      title: 'Physical access to sensitive areas',
      question:
        'For sensitive areas of the cardholder data environment, is staff access authorised and tied to the individual’s job, withdrawn the moment they leave, with every key, card or similar handed back or deactivated at that point?',
      requirement:
        'Staff physical access to sensitive areas within the cardholder data environment is controlled as follows: access is authorised, and rests on what the individual’s job requires; it is withdrawn immediately when their employment ends; and every means of physical access they held — keys, access cards and the like — is handed back or deactivated at that point.',
      testing: [
        'Read the documented procedures and watch how access to sensitive areas is granted and withdrawn.',
        'Ask the responsible staff and read the records for departed personnel, confirming access was withdrawn and the means of access returned or deactivated.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if there are no sensitive areas within your CDE.',
    },
    {
      id: '9.3.2',
      title: 'Visitor authorization and escort',
      question:
        'Are there working procedures for visitors to the cardholder data environment — authorised before they come in, accompanied throughout, plainly identified with a badge or equivalent that runs out, and that badge visibly telling a visitor apart from staff?',
      requirement:
        'Procedures are in force for authorising and managing visitor access to the cardholder data environment. They provide that: a visitor is authorised before entering; a visitor is accompanied at all times; a visitor is plainly identified and issued a badge or other identification that ceases to be valid after a period; and that badge or identification makes a visitor visibly distinguishable from a member of staff.',
      testing: [
        'Read the documented procedures and watch how visitors are handled, confirming they are authorised, accompanied and identified.',
        'Watch the visitor badges in use, confirming they expire and that they visibly set a visitor apart from staff.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.3.3',
      title: 'Visitor badge surrender',
      question:
        'Is a visitor’s badge handed back or deactivated before they leave the premises, or once it has run out?',
      requirement:
        'A visitor badge or identification is handed back, or deactivated, before the visitor leaves the premises or upon the date it ceases to be valid.',
      testing: [
        'Watch visitors leaving and ask staff, confirming badges and other identification are handed back or deactivated.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.3.4',
      title: 'Visitor log',
      question:
        'Is there a visitor log recording visits to the premises and to sensitive areas — the visitor’s name and who they represent, when the visit took place, who authorised their entry — kept for at least three months unless the law says otherwise?',
      requirement:
        'A visitor log is kept as a physical record of visitor activity on the premises and within sensitive areas. It records: the visitor’s name and the organisation they represent; the date and time of the visit; and the name of the person who authorised their physical entry. The log is retained for no less than three months, except where the law restricts that.',
      testing: [
        'Read the visitor log and ask the responsible staff, confirming each of those particulars is recorded.',
        'Look at where the logs are held and confirm they are kept for at least three months.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '9.4.1',
      title: 'Physical security of media',
      question:
        'Is every piece of media holding cardholder data physically secured?',
      requirement:
        'Media holding cardholder data is physically secured, whatever form it takes.',
      testing: [
        'Read the documented policies and procedures and confirm they say how media holding cardholder data is to be physically secured.',
        'Ask staff and look at where it is kept, confirming it is physically secured.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no media (electronic or hard copy) containing cardholder data.',
    },
    {
      id: '9.4.1.1',
      title: 'Offline media backups stored securely',
      question:
        'Are offline backup media holding cardholder data kept somewhere secure?',
      requirement:
        'Offline backup media holding cardholder data is kept in a secure location.',
      testing: [
        'Read the documentation and ask staff, confirming offline backup media is kept somewhere secure.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no offline media backups containing cardholder data exist.',
    },
    {
      id: '9.4.1.2',
      title: 'Annual review of backup location security',
      question:
        'Is the security of wherever those offline backups are kept reviewed at intervals no longer than 12 months?',
      requirement:
        'The security of the location or locations holding offline backup media with cardholder data is reviewed at intervals no longer than 12 months.',
      testing: [
        'Read the records of those reviews and ask staff, confirming the location’s security is reviewed at least that often.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no offline media backups containing cardholder data exist.',
    },
    {
      id: '9.4.2',
      title: 'Media classification',
      question:
        'Is media holding cardholder data classified according to how sensitive that data is?',
      requirement:
        'Media holding cardholder data carries a classification reflecting the sensitivity of the data on it.',
      testing: [
        'Read the documented procedures and confirm they say how such media is to be classified.',
        'Read the media logs and ask staff, confirming the classification is actually applied.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no media containing cardholder data.',
    },
    {
      id: '9.4.3',
      title: 'Media sent outside the facility',
      question:
        'When media holding cardholder data leaves the premises, is the dispatch logged, does it travel by secured courier or another method whose whereabouts can be tracked accurately, and do the offsite tracking records show where the media is?',
      requirement:
        'Media holding cardholder data that leaves the premises is protected as follows: the dispatch is logged; the media travels by secured courier, or by another delivery method whose progress can be tracked accurately; and the offsite tracking records show where the media is.',
      testing: [
        'Read the documented procedures and the offsite tracking records, confirming departures are logged and consignments tracked.',
        'Ask staff to confirm a secured courier or another trackable method is used.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no media with cardholder data is ever sent outside the facility.',
    },
    {
      id: '9.4.4',
      title: 'Management approval for media movement',
      question:
        'Does management approve every movement of cardholder-data media off the premises, handing it to an individual included?',
      requirement:
        'Management approves every instance of media holding cardholder data being moved off the premises, including where the media is handed to an individual.',
      testing: [
        'Read the documented procedures and the offsite media tracking records, confirming management approval was obtained for each movement off the premises.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no media with cardholder data is ever moved outside the facility.',
    },
    {
      id: '9.4.5',
      title: 'Electronic media inventory logs',
      question:
        'Do you keep inventory records of the electronic media holding cardholder data?',
      requirement:
        'Inventory records are kept of every piece of electronic media holding cardholder data.',
      testing: [
        'Read the documented procedures and confirm the keeping of these inventory records is laid down.',
        'Read the inventory records and ask staff, confirming they are actually kept up.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no electronic media containing cardholder data.',
    },
    {
      id: '9.4.5.1',
      title: 'Annual media inventories',
      question:
        'Is an inventory of that electronic media taken at intervals no longer than 12 months?',
      requirement:
        'An inventory of the electronic media holding cardholder data is taken at intervals no longer than 12 months.',
      testing: [
        'Read the inventory records and ask staff, confirming an inventory is taken at least that often.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no electronic media containing cardholder data.',
    },
    {
      id: '9.4.6',
      title: 'Destruction of hard-copy materials',
      question:
        'Once the business and the law have no further use for paper holding cardholder data, is it destroyed — cross-cut shredded, incinerated or pulped so the data cannot be pieced back together — and held in secure containers until that happens?',
      requirement:
        'Paper materials holding cardholder data are destroyed once no business or legal reason for keeping them remains. Destruction is by cross-cut shredding, incineration or pulping, such that the cardholder data cannot afterwards be pieced back together; and until destruction the materials are held in secure storage containers.',
      testing: [
        'Read the media destruction policy and watch the process, confirming paper materials are destroyed as described.',
        'Look at the containers holding material awaiting destruction and confirm they are secure.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no hard-copy materials containing cardholder data.',
    },
    {
      id: '9.4.7',
      title: 'Destruction of electronic media',
      question:
        'Once the business and the law have no further use for electronic media holding cardholder data, is the media destroyed, or the data on it put beyond recovery so it cannot be pieced back together?',
      requirement:
        'Electronic media holding cardholder data is dealt with once no business or legal reason for keeping it remains, by one of two means: the media itself is destroyed; or the cardholder data on it is put beyond recovery, so that it cannot be pieced back together.',
      testing: [
        'Read the media destruction policy and watch the process, confirming electronic media is destroyed or the data on it put beyond recovery.',
        'Ask staff to confirm the process is followed.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization retains no electronic media containing cardholder data.',
    },
    {
      id: '9.5.1',
      title: 'Protection of POI devices',
      question:
        'Are the terminals that read a card by physical contact with it protected against tampering and against being swapped for another — with a list of those devices kept, the devices inspected on a recurring basis for signs of either, and staff trained to notice odd behaviour and report tampering or substitution?',
      requirement:
        'Point-of-interaction devices that capture payment card data through direct physical interaction with the card itself are protected against tampering and against unauthorised substitution. That protection takes in: keeping a list of those devices; inspecting them on a recurring basis for signs of tampering or substitution; and training staff to notice suspicious behaviour and to report any tampering or substitution.',
      testing: [
        'Read the documented policies and procedures and confirm the protection of these devices is laid down.',
        'Ask staff and watch the process, confirming the procedures are actually followed.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction (for example, e-commerce only).',
    },
    {
      id: '9.5.1.1',
      title: 'POI device list',
      question:
        'Is the list of those terminals current, and does each entry give the make and model, where the device is, and its serial number or some other way of telling it apart?',
      requirement:
        'A current list of point-of-interaction devices is kept. Each entry records the device’s make and model, where it is located, and its serial number or another means of identifying that device uniquely.',
      testing: [
        'Read the list and confirm each of those particulars appears.',
        'Take a sample of devices, look at them and where they sit, and compare against the list to confirm it is accurate and current.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction.',
    },
    {
      id: '9.5.1.2',
      title: 'POI device inspections',
      question:
        'Are the surfaces of those terminals inspected on a recurring basis to catch tampering or a substituted device?',
      requirement:
        'The surfaces of point-of-interaction devices are inspected on a recurring basis, to catch tampering and unauthorised substitution.',
      testing: [
        'Read the documented procedures and confirm recurring inspection of these device surfaces is laid down.',
        'Ask staff and watch an inspection, confirming they actually happen.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction.',
    },
    {
      id: '9.5.1.2.1',
      title: 'POI inspection frequency defined by risk analysis',
      question:
        'Are both how often those inspections happen and what kind of inspection is done fixed by your targeted risk analysis, carried out as Requirement 12.3.1 lays down?',
      requirement:
        'How often point-of-interaction devices are inspected, and what form the inspection takes, are both set by the entity’s targeted risk analysis, carried out against every element Requirement 12.3.1 specifies.',
      testing: [
        'Read the targeted risk analysis covering these inspections and confirm the interval and the form of inspection are set out and justified.',
        'Read the inspection records and confirm inspections happened at the interval so set.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction.',
    },
    {
      id: '9.5.1.3',
      title: 'POI personnel training',
      question:
        'Are staff in terminal environments trained to spot an attempt at tampering or swapping a device — checking who a supposed repair or maintenance visitor really is before letting them touch anything, following procedures so no device is fitted, replaced or returned unverified, staying alert to odd behaviour around the devices, and reporting that behaviour and any sign of tampering or substitution to the right people?',
      requirement:
        'Staff working in point-of-interaction environments are trained to be alert to attempted tampering with a device, or its replacement. The training covers: establishing the identity of any outsider presenting themselves as repair or maintenance personnel, before that person is allowed to alter or investigate a device; procedures ensuring no device is installed, replaced or returned without verification; alertness to suspicious behaviour in the vicinity of the devices; and reporting such behaviour, and any indication of tampering or substitution, to the appropriate people.',
      testing: [
        'Read the training material used for staff in these environments and confirm each of those points appears.',
        'Ask those staff to confirm they received the training and know the procedures.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization uses no POI devices that capture payment card data via direct physical interaction.',
    },
  ],
};
