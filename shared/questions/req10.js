export default {
  id: 10,
  title: 'Log and Monitor All Access to System Components and Cardholder Data',
  goal: 'Regularly Monitor and Test Networks',
  intro:
    'Being able to say what happened, and who did it, is what turns a breach from a mystery into something that can be scoped and contained. Logs on every system component, and someone actually reading them, are what make that possible.',
  questions: [
    {
      id: '10.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 10 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 10. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 10.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 10 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 10 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1',
      title: 'Audit logs enabled',
      question:
        'Is audit logging switched on and running across every system component and for cardholder data?',
      requirement:
        'Audit logging is switched on and running for every system component and for cardholder data.',
      testing: [
        'Ask the system administrator and inspect the system configuration, confirming audit logging is switched on and running on every system component.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.1',
      title: 'Logging individual access to cardholder data',
      question:
        'Does the audit log record every occasion on which an individual user reaches cardholder data?',
      requirement:
        'Every occasion on which an individual user reaches cardholder data appears in the audit log.',
      testing: [
        'Inspect the audit log configuration and the log data itself, confirming each such occasion is recorded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.2',
      title: 'Logging administrative actions',
      question:
        'Does the audit log record everything done by anyone holding administrative access, including any interactive use of an application or system account?',
      requirement:
        'Everything done by an individual holding administrative access appears in the audit log, and that includes any interactive use of an application or system account.',
      testing: [
        'Inspect the audit log configuration and the log data itself, confirming the actions of those with administrative access are recorded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.3',
      title: 'Logging access to audit logs',
      question: 'Does the audit log record every occasion on which the audit logs themselves are reached?',
      requirement: 'Every occasion on which an audit log is reached appears in the audit log.',
      testing: [
        'Inspect the audit log configuration and the log data itself, confirming access to the logs is recorded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.4',
      title: 'Logging invalid access attempts',
      question: 'Does the audit log record every failed attempt at logical access?',
      requirement: 'Every failed attempt at logical access appears in the audit log.',
      testing: [
        'Inspect the audit log configuration and the log data itself, confirming failed logical access attempts are recorded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.5',
      title: 'Logging credential changes',
      question:
        'Does the audit log record every change to an identification or authentication credential — a new account being created, a privilege being raised, and any change, addition or removal touching an account with administrative access?',
      requirement:
        'Every change to an identification or authentication credential appears in the audit log. That takes in, without being limited to: the creation of a new account; the raising of a privilege; and any change, addition or deletion affecting an account that holds administrative access.',
      testing: [
        'Inspect the audit log configuration and the log data itself, confirming credential changes are recorded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.6',
      title: 'Logging audit log initialization and changes',
      question:
        'Does the audit log record a new log being started, and every occasion on which existing logging is started, stopped or paused?',
      requirement:
        'The audit log records the initialisation of a new audit log, and every starting, stopping or pausing of logging already running.',
      testing: [
        'Inspect the audit log configuration and the log data itself, confirming these events are recorded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.1.7',
      title: 'Logging system-level object changes',
      question:
        'Does the audit log record every system-level object being created and every one being deleted?',
      requirement:
        'The creation of a system-level object, and the deletion of one, each appear in the audit log.',
      testing: [
        'Inspect the audit log configuration and the log data itself, confirming these events are recorded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.2.2',
      title: 'Audit log details',
      question:
        'For each event logged, does the record show who the user was, what kind of event it was, when it happened, whether it succeeded or failed, where it came from, and which data, system component, resource or service it touched?',
      requirement:
        'Each auditable event is recorded with the following particulars: which user was involved; what kind of event it was; the date and time; whether it succeeded or failed; where the event originated; and the identity or name of the data, system component, resource or service affected — a name and protocol, for instance.',
      testing: [
        'Ask staff and inspect the audit log configuration and the log data, confirming every one of those particulars is recorded for each auditable event.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.3.1',
      title: 'Read access to audit logs',
      question:
        'Is the ability to read audit log files confined to people whose job requires it?',
      requirement:
        'Reading an audit log file is confined to those with a job-related need to do so.',
      testing: [
        'Ask staff and inspect the system configuration and privileges, confirming only those with a job-related need can read the audit log files.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.3.2',
      title: 'Protection of audit logs from modification',
      question:
        'Are audit log files protected so that a person cannot alter them?',
      requirement:
        'Audit log files are protected such that an individual cannot modify them.',
      testing: [
        'Inspect the system configuration and privileges and ask staff, confirming the audit log files are protected against modification.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.3.3',
      title: 'Backup of audit logs',
      question:
        'Are audit log files — those from externally exposed technologies included — copied promptly onto a secure central internal log server, or onto other media that resists alteration?',
      requirement:
        'Audit log files, including those produced by externally facing technologies, are backed up promptly to a secure, central, internal log server, or to other media that is difficult to alter.',
      testing: [
        'Inspect the backup configuration or the log files themselves, confirming prompt backup to a secure central location or to media that resists alteration.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.3.4',
      title: 'File integrity monitoring on audit logs',
      question:
        'Is file integrity monitoring, or some other change-detection mechanism, applied to the audit logs so that existing log data cannot be altered without an alert being raised?',
      requirement:
        'File integrity monitoring, or another change-detection mechanism, is applied to the audit logs, so that log data already written cannot be altered without an alert being raised.',
      testing: [
        'Inspect the system settings, the files being monitored, and the output of that monitoring, confirming such a mechanism operates on the audit logs.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.1',
      title: 'Daily audit log reviews',
      question:
        'Are these logs looked at no less than once a day: everything recorded as a security event; the logs of any system component that stores, processes or transmits cardholder data or sensitive authentication data; the logs of every critical system component; and the logs of every server and component performing a security function?',
      requirement:
        'The following logs are reviewed no less than once each day: every security event; the logs of any system component that stores, processes or transmits cardholder data or sensitive authentication data; the logs of every critical system component; and the logs of every server and system component that performs a security function, such as a network security control, an intrusion-detection or intrusion-prevention system, or an authentication server.',
      testing: [
        'Read the security policies and procedures and confirm daily review of those logs is laid down.',
        'Watch the process and ask staff, confirming the reviews really happen every day.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.1.1',
      title: 'Automated log review mechanisms',
      question:
        'Is the reviewing of audit logs done with the help of automated mechanisms?',
      requirement:
        'Audit log reviews are carried out using automated mechanisms.',
      testing: [
        'Inspect the review mechanisms and ask staff, confirming automation is used to carry out the audit log reviews.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.2',
      title: 'Periodic review of other logs',
      question:
        'Are the logs of the remaining system components — the ones Requirement 10.4.1 does not name — reviewed on a recurring basis?',
      requirement:
        'The logs of system components not named in Requirement 10.4.1 are reviewed on a recurring basis.',
      testing: [
        'Read the security policies and procedures and ask staff, confirming those other logs are reviewed on a recurring basis.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.2.1',
      title: 'Review frequency defined by risk analysis',
      question:
        'Is the interval between those reviews fixed by your targeted risk analysis, carried out as Requirement 12.3.1 lays down?',
      requirement:
        'The interval at which the logs of those other system components are reviewed is set by the entity’s targeted risk analysis, carried out against every element Requirement 12.3.1 specifies.',
      testing: [
        'Read the targeted risk analysis covering that review interval and confirm it is set out and justified.',
        'Read the recorded outcomes of the reviews and confirm they happened at that interval.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.4.3',
      title: 'Addressing exceptions and anomalies',
      question:
        'Is anything unexpected or out of place that a log review turns up actually dealt with?',
      requirement:
        'An exception or anomaly that a review brings to light is dealt with.',
      testing: [
        'Read the documented policies and procedures and confirm they say how such findings are to be dealt with.',
        'Watch the process and ask staff, confirming these findings really are dealt with.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.5.1',
      title: 'Audit log retention',
      question:
        'Is audit log history held for a minimum of 12 months, and can the most recent three months of it be analysed straight away?',
      requirement:
        'Audit log history is kept for no less than 12 months, and at least the most recent three months of it is immediately available to analyse.',
      testing: [
        'Read the documentation and confirm audit log history is kept for at least 12 months.',
        'Ask staff and inspect the logs, confirming at least the last three months can be analysed immediately.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.6.1',
      title: 'Time synchronization',
      question:
        'Are system clocks kept in step using time-synchronisation technology?',
      requirement:
        'System clocks and the time they show are kept in step by means of time-synchronisation technology.',
      testing: [
        'Inspect the system configuration and confirm time-synchronisation technology is in place and kept current.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.6.2',
      title: 'Correct and consistent time',
      question:
        'Is time set correctly and uniformly — with one or more nominated time servers, only those central servers taking time from outside, the outside time resting on either International Atomic Time or Coordinated Universal Time, updates accepted only from particular sources the industry accepts, multiple nominated servers peering with each other, and client systems taking their time only from the nominated central servers?',
      requirement:
        'Systems carry the correct time, and the same time, arranged as follows. One or more nominated time servers are in use. Only those nominated central time servers take time from an external source. Time taken from outside rests on International Atomic Time or on Coordinated Universal Time. A nominated time server accepts an update only from particular external sources that the industry accepts. Where more than one nominated time server exists, they peer with one another to hold accurate time. And a client system takes its time only from a nominated central time server.',
      testing: [
        'Inspect the configuration governing how the correct time is obtained, distributed and stored, confirming every one of those points holds.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.6.3',
      title: 'Protection of time data',
      question:
        'Are the time settings and time data protected — reaching the time data confined to people with a business need, and any change to the time on a critical system logged, watched and reviewed?',
      requirement:
        'Time-synchronisation settings and time data are protected in two ways: reaching the time data is confined to personnel with a business need to do so; and any change to the time settings of a critical system is logged, monitored and reviewed.',
      testing: [
        'Inspect the system and time-synchronisation configuration, confirming access to the time data is restricted.',
        'Inspect the logs and the monitoring configuration, confirming that when a critical system has its time altered, that alteration is recorded, watched and reviewed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.7.1',
      title: 'Detection of critical security control failures (service providers)',
      question:
        'When a critical security control system fails, is the failure noticed, alerted on and dealt with promptly — covering audit logging, anti-malware, the network security controls, intrusion detection and prevention, file integrity monitoring, access control both physical and logical, and segmentation controls where those are used?',
      requirement:
        'An extra obligation on service providers. The failure of a critical security control system is detected, raised as an alert, and dealt with promptly. The systems covered take in, without being limited to: the audit logging mechanisms; anti-malware; access control, whether physical or logical; the network security controls; intrusion-detection and intrusion-prevention systems; file integrity monitoring; and segmentation controls, where those are used.',
      testing: [
        'Read the documented policies and procedures and inspect the configuration, confirming such failures are detected and alerted on.',
        'Watch the detection and alerting in operation and ask staff, confirming failures are dealt with promptly.',
      ],
      appliesTo: 'service-provider',
      allowNA: false,
    },
    {
      id: '10.7.2',
      title: 'Detection of critical security control failures (all entities)',
      question:
        'When a critical security control system fails, is the failure noticed, alerted on and dealt with promptly — covering audit logging and the log review mechanisms themselves, anti-malware, access control both physical and logical, the network security controls, intrusion detection and prevention, change-detection mechanisms, and — where they are used — segmentation controls and automated security testing tools?',
      requirement:
        'The failure of a critical security control system is detected, raised as an alert, and dealt with promptly. The systems covered take in, without being limited to: the audit logging mechanisms, and the mechanisms that review those logs; anti-malware; access control, whether physical or logical; the network security controls; intrusion-detection and intrusion-prevention systems; change-detection mechanisms; and, where they are used, segmentation controls and automated security testing tools.',
      testing: [
        'Read the documented policies and procedures and inspect the configuration, confirming such failures are detected and alerted on.',
        'Watch the detection and alerting in operation and ask staff, confirming failures are dealt with promptly.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '10.7.3',
      title: 'Response to security control failures',
      question:
        'When a critical security control fails, does the response happen promptly and cover all of it — getting the security function working again, recording how long the failure lasted from start to finish, recording what caused it and what has to be put right, finding and dealing with anything that went wrong while it was down, deciding whether anything further is needed, putting controls in place so the same cause does not recur, and starting the monitoring up again?',
      requirement:
        'The failure of any critical security control system is responded to promptly, and the response takes in, without being limited to: restoring the security function; recording how long the failure lasted, from the date and time it began to the date and time it ended; recording what caused it, and what remediation is called for; finding and dealing with any security problem that arose while it was down; deciding whether the failure calls for anything further; putting controls in place so the same cause cannot produce the same failure again; and resuming the monitoring of security controls.',
      testing: [
        'Read the documented policies and procedures and confirm the response to a security control failure is laid down.',
        'Read the records of past responses and confirm each of those actions was taken.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
