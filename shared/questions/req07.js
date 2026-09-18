export default {
  id: 7,
  title: 'Restrict Access to System Components and Cardholder Data by Business Need to Know',
  goal: 'Implement Strong Access Control Measures',
  intro:
    'Unauthorized individuals may gain access to critical data or systems due to ineffective access control rules and definitions. To ensure critical data can only be accessed by authorized personnel, systems and processes must be in place to limit access based on need to know and according to job responsibilities.',
  questions: [
    {
      id: '7.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 7 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 7 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 7.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 7 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 7 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.1',
      title: 'Access control model',
      question:
        'Is an access control model defined that includes granting access as follows: appropriate access depending on your business and access needs, access to system components and data resources based on users’ job classification and functions, and the least privileges required to perform a job function?',
      requirement:
        'An access control model is defined and includes granting access as follows: appropriate access depending on the entity’s business and access needs; access to system components and data resources that is based on users’ job classification and functions; the least privileges required (for example, user, administrator) to perform a job function.',
      testing: [
        'Examine documented policies and procedures and interview personnel to verify the access control model is defined.',
        'Examine access control model settings to verify access needs are appropriately defined.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.2',
      title: 'Least privilege assignment',
      question:
        'Is access assigned to users, including privileged users, based on job classification and function, and least privileges necessary to perform job responsibilities?',
      requirement:
        'Access is assigned to users, including privileged users, based on: job classification and function; least privileges necessary to perform job responsibilities.',
      testing: [
        'Examine policies and procedures to verify they cover assigning access based on job classification, function, and least privileges.',
        'Examine user access settings, including for privileged users, and compare with job classifications and functions.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.3',
      title: 'Approval of privileges',
      question:
        'Are required privileges approved by authorized personnel?',
      requirement: 'Required privileges are approved by authorized personnel.',
      testing: [
        'Examine documented approvals for a sample of user IDs with assigned privileges.',
        'Compare the approvals with the privileges actually assigned to verify they match.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.4',
      title: 'Six-monthly user access reviews',
      question:
        'Are all user accounts and related access privileges, including third-party/vendor accounts, reviewed at least once every six months to ensure user accounts and access remain appropriate based on job function, with any inappropriate access addressed and management acknowledging that access remains appropriate?',
      requirement:
        'All user accounts and related access privileges, including third-party/vendor accounts, are reviewed as follows: at least once every six months; to ensure user accounts and access remain appropriate based on job function; any inappropriate access is addressed; management acknowledges that access remains appropriate.',
      testing: [
        'Examine documented policies and procedures to verify that a process is defined for reviewing user accounts at least once every six months.',
        'Examine documentation of reviews and interview personnel to verify reviews occur at the required frequency and that inappropriate access is addressed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.5',
      title: 'Application and system account privileges',
      question:
        'Are all application and system accounts and related access privileges assigned and managed based on the least privileges necessary for the operability of the system or application, with access limited to the systems, applications, or processes that specifically require their use?',
      requirement:
        'All application and system accounts and related access privileges are assigned and managed as follows: based on the least privileges necessary for the operability of the system or application; access is limited to the systems, applications, or processes that specifically require their use.',
      testing: [
        'Examine policies and procedures to verify a process is defined for managing application and system accounts.',
        'Examine privileges associated with application and system accounts and interview personnel to verify least privilege is applied.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.5.1',
      title: 'Periodic review of application/system account access',
      question:
        'Are all access by application and system accounts and related access privileges reviewed periodically, at the frequency defined in your targeted risk analysis performed according to Requirement 12.3.1, to verify that the access remains appropriate for the function being performed, with any inappropriate access addressed and management acknowledging that access remains appropriate?',
      requirement:
        'All access by application and system accounts and related access privileges are reviewed as follows: periodically (at the frequency defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1); the application/system access remains appropriate for the function being performed; any inappropriate access is addressed; management acknowledges that access remains appropriate.',
      testing: [
        'Examine the targeted risk analysis defining the review frequency.',
        'Examine documentation of reviews and interview personnel to verify reviews are performed at the defined frequency.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.6',
      title: 'Access to cardholder data repositories',
      question:
        'Is all user access to query repositories of stored cardholder data restricted via applications or other programmatic methods, with access and allowed actions based on user roles and least privileges, and is direct access to or querying of repositories of stored cardholder data restricted to only the responsible administrator(s)?',
      requirement:
        'All user access to query repositories of stored cardholder data is restricted as follows: via applications or other programmatic methods, with access and allowed actions based on user roles and least privileges; only the responsible administrator(s) can directly access or query repositories of stored cardholder data.',
      testing: [
        'Examine policies and procedures and configuration settings to verify that user access to query repositories of stored cardholder data is restricted.',
        'Interview personnel to verify that only responsible administrators can directly access or query the repositories.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not store cardholder data in any queryable repository.',
    },
    {
      id: '7.3.1',
      title: 'Access control system in place',
      question:
        'Is an access control system(s) in place that restricts access based on a user’s need to know and covers all system components?',
      requirement:
        'An access control system(s) is in place that restricts access based on a user’s need to know and covers all system components.',
      testing: [
        'Examine vendor documentation and system settings to verify that an access control system is in place on all system components.',
        'Examine access control system configurations to verify access is restricted based on need to know.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.3.2',
      title: 'Enforcement of assigned permissions',
      question:
        'Is the access control system(s) configured to enforce permissions assigned to individuals, applications, and systems based on job classification and function?',
      requirement:
        'The access control system(s) is configured to enforce permissions assigned to individuals, applications, and systems based on job classification and function.',
      testing: [
        'Examine access control system configurations to verify that permissions are enforced as assigned.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.3.3',
      title: 'Deny all by default',
      question:
        'Is the access control system(s) set to "deny all" by default?',
      requirement: 'The access control system(s) is set to "deny all" by default.',
      testing: [
        'Examine vendor documentation and system settings to verify that the access control system is set to "deny all" by default.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
