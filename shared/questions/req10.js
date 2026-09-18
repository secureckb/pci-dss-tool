export default {
  id: 10,
  title: 'Log and Monitor All Access to System Components and Cardholder Data',
  goal: 'Regularly Monitor and Test Networks',
  intro:
    'Logging mechanisms and the ability to track user activities are critical in preventing, detecting, or minimizing the impact of a data compromise. The presence of logs on all system components and in the CDE allows thorough tracking, alerting, and analysis when something goes wrong.',
  questions: [
    {
      id: '10.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 10 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 10 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 10.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 10 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 10 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1',
      title: 'Audit logs enabled',
      question:
        'Are audit logs enabled and active for all system components and cardholder data?',
      requirement:
        'Audit logs are enabled and active for all system components and cardholder data.',
      testing: [
        'Interview the system administrator and examine system configurations to verify that audit logs are enabled and active for all system components.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.1',
      title: 'Logging individual access to cardholder data',
      question:
        'Do audit logs capture all individual user access to cardholder data?',
      requirement: 'Audit logs capture all individual user access to cardholder data.',
      testing: [
        'Examine audit log configurations and log data to verify that all individual user access to cardholder data is logged.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.2',
      title: 'Logging administrative actions',
      question:
        'Do audit logs capture all actions taken by any individual with administrative access, including any interactive use of application or system accounts?',
      requirement:
        'Audit logs capture all actions taken by any individual with administrative access, including any interactive use of application or system accounts.',
      testing: [
        'Examine audit log configurations and log data to verify that all actions taken by individuals with administrative access are logged.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.3',
      title: 'Logging access to audit logs',
      question: 'Do audit logs capture all access to audit logs?',
      requirement: 'Audit logs capture all access to audit logs.',
      testing: [
        'Examine audit log configurations and log data to verify that access to all audit logs is captured.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.4',
      title: 'Logging invalid access attempts',
      question: 'Do audit logs capture all invalid logical access attempts?',
      requirement: 'Audit logs capture all invalid logical access attempts.',
      testing: [
        'Examine audit log configurations and log data to verify that invalid logical access attempts are captured.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.5',
      title: 'Logging credential changes',
      question:
        'Do audit logs capture all changes to identification and authentication credentials, including creation of new accounts, elevation of privileges, and all changes, additions, or deletions to accounts with administrative access?',
      requirement:
        'Audit logs capture all changes to identification and authentication credentials including, but not limited to: creation of new accounts; elevation of privileges; all changes, additions, or deletions to accounts with administrative access.',
      testing: [
        'Examine audit log configurations and log data to verify that changes to identification and authentication credentials are captured.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.6',
      title: 'Logging audit log initialization and changes',
      question:
        'Do audit logs capture all initialization of new audit logs, and all starting, stopping, or pausing of the existing audit logs?',
      requirement:
        'Audit logs capture the following: all initialization of new audit logs, and all starting, stopping, or pausing of the existing audit logs.',
      testing: [
        'Examine audit log configurations and log data to verify that initialization, starting, stopping, or pausing of audit logs is captured.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.7',
      title: 'Logging system-level object changes',
      question:
        'Do audit logs capture all creation and deletion of system-level objects?',
      requirement:
        'Audit logs capture all creation and deletion of system-level objects.',
      testing: [
        'Examine audit log configurations and log data to verify that creation and deletion of system-level objects is captured.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.2',
      title: 'Audit log details',
      question:
        'Do audit logs record the following details for each auditable event: user identification, type of event, date and time, success and failure indication, origination of event, and identity or name of affected data, system component, resource, or service?',
      requirement:
        'Audit logs record the following details for each auditable event: user identification; type of event; date and time; success and failure indication; origination of event; identity or name of affected data, system component, resource, or service (for example, name and protocol).',
      testing: [
        'Interview personnel and examine audit log configurations and log data to verify that all required details are recorded for each auditable event.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.3.1',
      title: 'Read access to audit logs',
      question:
        'Is read access to audit log files limited to those with a job-related need?',
      requirement:
        'Read access to audit logs files is limited to those with a job-related need.',
      testing: [
        'Interview personnel and examine system configurations and privileges to verify that only individuals with a job-related need have read access to audit log files.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.3.2',
      title: 'Protection of audit logs from modification',
      question:
        'Are audit log files protected to prevent modifications by individuals?',
      requirement:
        'Audit log files are protected to prevent modifications by individuals.',
      testing: [
        'Examine system configurations and privileges and interview personnel to verify that audit log files are protected from modification.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.3.3',
      title: 'Backup of audit logs',
      question:
        'Are audit log files, including those for external-facing technologies, promptly backed up to a secure, central, internal log server(s) or other media that is difficult to modify?',
      requirement:
        'Audit log files, including those for external-facing technologies, are promptly backed up to a secure, central, internal log server(s) or other media that is difficult to modify.',
      testing: [
        'Examine backup configurations or log files to verify that audit log files are promptly backed up to a secure, central location or media that is difficult to modify.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.3.4',
      title: 'File integrity monitoring on audit logs',
      question:
        'Is file integrity monitoring or a change-detection mechanism used on audit logs to ensure that existing log data cannot be changed without generating alerts?',
      requirement:
        'File integrity monitoring or change-detection mechanisms is used on audit logs to ensure that existing log data cannot be changed without generating alerts.',
      testing: [
        'Examine system settings, monitored files, and results from monitoring activities to verify that file integrity monitoring or change-detection mechanisms are in use on audit logs.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.1',
      title: 'Daily audit log reviews',
      question:
        'Are the following audit logs reviewed at least once daily: all security events, logs of all system components that store, process, or transmit CHD and/or SAD, logs of all critical system components, and logs of all servers and system components that perform security functions?',
      requirement:
        'The following audit logs are reviewed at least once daily: all security events; logs of all system components that store, process, or transmit CHD and/or SAD; logs of all critical system components; logs of all servers and system components that perform security functions (for example, network security controls, intrusion-detection systems/intrusion-prevention systems, authentication servers).',
      testing: [
        'Examine security policies and procedures to verify that processes are defined for reviewing the specified audit logs at least once daily.',
        'Observe processes and interview personnel to verify that the reviews occur daily.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.1.1',
      title: 'Automated log review mechanisms',
      question:
        'Are automated mechanisms used to perform audit log reviews?',
      requirement: 'Automated mechanisms are used to perform audit log reviews.',
      testing: [
        'Examine log review mechanisms and interview personnel to verify that automated mechanisms are used to perform audit log reviews.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.2',
      title: 'Periodic review of other logs',
      question:
        'Are logs of all other system components (those not specified in Requirement 10.4.1) reviewed periodically?',
      requirement:
        'Logs of all other system components (those not specified in Requirement 10.4.1) are reviewed periodically.',
      testing: [
        'Examine security policies and procedures and interview personnel to verify that logs of all other system components are reviewed periodically.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.2.1',
      title: 'Review frequency defined by risk analysis',
      question:
        'Is the frequency of periodic log reviews for all other system components (not defined in Requirement 10.4.1) defined in your targeted risk analysis performed according to Requirement 12.3.1?',
      requirement:
        'The frequency of periodic log reviews for all other system components (not defined in Requirement 10.4.1) is defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1.',
      testing: [
        'Examine the targeted risk analysis for the frequency of periodic log reviews to verify it is defined and justified.',
        'Examine documented results of reviews to verify they occur at the defined frequency.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.3',
      title: 'Addressing exceptions and anomalies',
      question:
        'Are exceptions and anomalies identified during the log review process addressed?',
      requirement:
        'Exceptions and anomalies identified during the review process are addressed.',
      testing: [
        'Examine documented policies and procedures to verify that processes are defined for addressing exceptions and anomalies identified during the review process.',
        'Observe processes and interview personnel to verify that exceptions and anomalies are addressed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.5.1',
      title: 'Audit log retention',
      question:
        'Is audit log history retained for at least 12 months, with at least the most recent three months immediately available for analysis?',
      requirement:
        'Retain audit log history for at least 12 months, with at least the most recent three months immediately available for analysis.',
      testing: [
        'Examine documentation to verify that audit log history is retained for at least 12 months.',
        'Interview personnel and examine audit logs to verify that at least the most recent three months of logs are immediately available for analysis.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.6.1',
      title: 'Time synchronization',
      question:
        'Are system clocks and time synchronized using time-synchronization technology?',
      requirement:
        'System clocks and time are synchronized using time-synchronization technology.',
      testing: [
        'Examine system configuration settings to verify that time-synchronization technology is implemented and kept current.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.6.2',
      title: 'Correct and consistent time',
      question:
        'Are systems configured to the correct and consistent time such that one or more designated time servers are in use, only the designated central time server(s) receives time from external sources, time received from external sources is based on International Atomic Time or UTC, the designated time server(s) accept time updates only from specific industry-accepted external sources, where there is more than one designated time server the time servers peer with one another to keep accurate time, and client systems receive time information only from designated central time server(s)?',
      requirement:
        'Systems are configured to the correct and consistent time as follows: one or more designated time servers are in use; only the designated central time server(s) receives time from external sources; time received from external sources is based on International Atomic Time or Coordinated Universal Time (UTC); the designated time server(s) accept time updates only from specific industry-accepted external sources; where there is more than one designated time server, the time servers peer with one another to keep accurate time; client systems receive time information only from designated central time server(s).',
      testing: [
        'Examine system configuration settings for acquiring, distributing, and storing the correct time to verify all required elements are met.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.6.3',
      title: 'Protection of time data',
      question:
        'Are time synchronization settings and data protected such that access to time data is restricted to only personnel with a business need, and any changes to time settings on critical systems are logged, monitored, and reviewed?',
      requirement:
        'Time synchronization settings and data are protected as follows: access to time data is restricted to only personnel with a business need; any changes to time settings on critical systems are logged, monitored, and reviewed.',
      testing: [
        'Examine system configurations and time-synchronization settings to verify that access to time data is restricted.',
        'Examine logs and monitoring configurations to verify that changes to time settings on critical systems are logged, monitored, and reviewed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.7.1',
      title: 'Detection of critical security control failures (service providers)',
      question:
        'Are failures of critical security control systems detected, alerted, and addressed promptly — including failures of network security controls, IDS/IPS, FIM, anti-malware solutions, physical access controls, logical access controls, audit logging mechanisms, and segmentation controls if used?',
      requirement:
        'Additional requirement for service providers only: Failures of critical security control systems are detected, alerted, and addressed promptly, including but not limited to failure of the following critical security control systems: network security controls; IDS/IPS; FIM; anti-malware solutions; physical access controls; logical access controls; audit logging mechanisms; segmentation controls (if used).',
      testing: [
        'Examine documented policies and procedures and configuration settings to verify that failures of critical security control systems are detected and alerted.',
        'Observe detection and alerting processes and interview personnel to verify failures are addressed promptly.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '10.7.2',
      title: 'Detection of critical security control failures (all entities)',
      question:
        'Are failures of critical security control systems detected, alerted, and addressed promptly — including failures of network security controls, IDS/IPS, change-detection mechanisms, anti-malware solutions, physical access controls, logical access controls, audit logging mechanisms, segmentation controls if used, audit log review mechanisms, and automated security testing tools if used?',
      requirement:
        'Failures of critical security control systems are detected, alerted, and addressed promptly, including but not limited to failure of the following critical security control systems: network security controls; IDS/IPS; change-detection mechanisms; anti-malware solutions; physical access controls; logical access controls; audit logging mechanisms; segmentation controls (if used); audit log review mechanisms; automated security testing tools (if used).',
      testing: [
        'Examine documented policies and procedures and configuration settings to verify that failures of critical security control systems are detected and alerted.',
        'Observe detection and alerting processes and interview personnel to verify failures are addressed promptly.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.7.3',
      title: 'Response to security control failures',
      question:
        'Are failures of any critical security control systems responded to promptly, including restoring security functions, identifying and documenting the duration of the security failure, identifying and documenting the cause(s) of failure and required remediation, identifying and addressing any security issues that arose during the failure, determining whether further actions are required, implementing controls to prevent the cause of failure from reoccurring, and resuming monitoring of security controls?',
      requirement:
        'Failures of any critical security controls systems are responded to promptly, including but not limited to: restoring security functions; identifying and documenting the duration (date and time from start to end) of the security failure; identifying and documenting the cause(s) of failure and documenting required remediation; identifying and addressing any security issues that arose during the failure; determining whether further actions are required as a result of the security failure; implementing controls to prevent the cause of failure from reoccurring; resuming monitoring of security controls.',
      testing: [
        'Examine documented policies and procedures to verify that processes are defined for responding to security control failures.',
        'Examine records of responses to security control failures to verify all required actions were taken.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
