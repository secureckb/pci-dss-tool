export default {
  id: 8,
  title: 'Identify Users and Authenticate Access to System Components',
  goal: 'Implement Strong Access Control Measures',
  intro:
    'Two separate things have to happen before someone may act on a system: they have to be identified, and that identity has to be proved. Giving every person their own identifier is what makes it possible to say afterwards who did something, and to know it was somebody entitled to.',
  questions: [
    {
      id: '8.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 8 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 8. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 8.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 8 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 8 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.1',
      title: 'Unique user IDs',
      question:
        'Does each user get an identifier of their own before they are let anywhere near a system component or cardholder data?',
      requirement:
        'Every user receives an identifier belonging to them alone, and receives it before being granted access to any system component or to cardholder data.',
      testing: [
        'Ask the responsible staff to confirm each user holds an identifier of their own.',
        'Read the audit logs and other evidence, confirming that reaching a system component or cardholder data can be traced back to one particular person.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.2',
      title: 'Shared and generic accounts',
      question:
        'Are group, shared or generic accounts — and any other shared credential — kept for genuine exceptions only, blocked the rest of the time, limited to however long the exception lasts, backed by a written business reason, expressly approved by management, opened only once the individual using them has been identified, and arranged so that every action can still be pinned to one person?',
      requirement:
        'Group, shared and generic accounts, along with any other shared authentication credential, are reserved for cases of genuine necessity and treated as exceptions. Their handling runs as follows: use of the account is blocked unless an exceptional circumstance calls for it; use lasts no longer than that circumstance requires; the business reason for it is recorded; management expressly approves it; the individual is identified before the account is opened to them; and each action taken through the account remains attributable to one particular person.',
      testing: [
        'Read the policies and procedures and confirm the use of shared accounts is dealt with.',
        'Read the user ID lists, the authorisation records and the audit logs, confirming shared accounts are handled as described.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.3',
      title: 'Unique authentication for each customer premises',
      question:
        'When you reach into a customer’s premises remotely, do you use a different authentication factor for each customer?',
      requirement:
        'An extra obligation on service providers. Where a provider has remote access into customer premises, the authentication factor it uses differs from one customer’s premises to another.',
      testing: [
        'Read the authentication policies and procedures and ask staff, confirming a distinct authentication factor is used for reaching each customer’s premises.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if your organization does not have remote access to customer premises.',
    },
    {
      id: '8.2.4',
      title: 'Management of user IDs and credentials',
      question:
        'When a user ID, authentication factor or similar identifier object is created, removed or altered, is the change authorised by the right approver — and does what gets built carry only the privileges that written approval named?',
      requirement:
        'Creating an identifier object, removing one, or altering one — a user ID, an authentication factor, or anything of that kind — proceeds on two conditions: the change carries authorisation from the appropriate approver; and what is put in place carries no privileges beyond those named on the written approval.',
      testing: [
        'Read the written authorisations and set them against the user IDs and privileges actually in place.',
        'Ask the responsible staff to confirm the process is followed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.5',
      title: 'Revoking access for terminated users',
      question:
        'When someone leaves, is their access withdrawn straight away?',
      requirement:
        'Access belonging to a user whose employment has ended is withdrawn immediately.',
      testing: [
        'Compare the record of departures against the current access lists, confirming departed users’ identifiers are deactivated or gone.',
        'Check the physical and logical authentication factors, confirming each has been handed back or deactivated.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.6',
      title: 'Inactive accounts',
      question:
        'Is an account that has gone unused for 90 days removed or disabled by the time those 90 days are up?',
      requirement:
        'A user account that has seen no activity is removed or disabled no later than 90 days after that inactivity began.',
      testing: [
        'Read the account list alongside the last sign-in records, confirming dormant accounts are removed or disabled inside the 90 days.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.7',
      title: 'Third-party remote access accounts',
      question:
        'Are the accounts third parties use to reach, support or maintain your systems remotely switched on only for as long as they are needed and switched off the rest of the time, with their use watched for anything unexpected?',
      requirement:
        'Accounts through which third parties reach, support or maintain system components remotely are handled as follows: each is enabled only for the period it is needed and disabled otherwise; and its use is monitored for activity that does not belong.',
      testing: [
        'Ask staff and examine how these accounts are enabled and disabled.',
        'Read the monitoring evidence and confirm use of third-party accounts is actually watched.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no third party has remote access to any in-scope system component.',
    },
    {
      id: '8.2.8',
      title: 'Idle session re-authentication',
      question:
        'After a session has sat idle for more than 15 minutes, must the user authenticate again before the terminal or session comes back to life?',
      requirement:
        'A session left idle beyond 15 minutes cannot be resumed without the user authenticating again.',
      testing: [
        'Inspect the system configuration and confirm the idle timeout is set to 15 minutes or less.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.1',
      title: 'Authentication factors',
      question:
        'Does every user and administrator reaching a system component authenticate with at least one of: a password or passphrase they have memorised; a token or smart card they carry; or a biometric trait that is simply theirs?',
      requirement:
        'Access to a system component, whether by an ordinary user or an administrator, is authenticated using at least one of three kinds of factor: something in the person’s memory, a password or a passphrase; something in the person’s possession, such as a token device or a smart card; or something the person is, such as a biometric trait.',
      testing: [
        'Read the documentation describing which factors are in use.',
        'Watch an authentication attempt using each factor in use and confirm it behaves as described.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.2',
      title: 'Authentication factors rendered unreadable',
      question:
        'On every system component, are authentication factors made unreadable by strong cryptography, both while travelling and while stored?',
      requirement:
        'Strong cryptography makes every authentication factor unreadable, in transit and at rest, on every system component.',
      testing: [
        'Read the vendor documentation and inspect the system configuration, confirming strong cryptography makes the factors unreadable in transit and at rest.',
        'Inspect the stores holding authentication factors and confirm they are unreadable there.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.3',
      title: 'Identity verification before credential changes',
      question:
        'Before an authentication factor is altered, is the identity of the person asking established?',
      requirement:
        'The identity of the user is established before any authentication factor of theirs is altered.',
      testing: [
        'Read the procedure for altering authentication factors and ask staff, confirming identity is established beforehand.',
        'Watch a request to alter an authentication factor and confirm identity is checked.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.4',
      title: 'Account lockout',
      question:
        'Are failed authentication attempts capped by locking the user ID after no more than 10 of them, with the lock lasting at least 30 minutes or until the person’s identity has been established?',
      requirement:
        'Failed authentication attempts are capped in two ways: the user ID locks after no more than 10 of them; and the lock holds for at least 30 minutes, or else until the user’s identity has been established.',
      testing: [
        'Inspect the system configuration and confirm a lockout is triggered by no more than 10 failed attempts.',
        'Inspect the system configuration and confirm the lock lasts at least 30 minutes, or until identity is established.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.5',
      title: 'First-time and reset passwords',
      question:
        'Where passwords or passphrases are the authentication factor, is each one set to a value unique to that user on first issue and on every reset, and must the user change it the moment they first use it?',
      requirement:
        'Where a password or passphrase serves as the authentication factor under Requirement 8.3.1, it is issued and reissued as follows: the value given is unique to that user, both on first issue and on each reset; and the user is obliged to change it immediately upon first use.',
      testing: [
        'Read the procedures for issuing and resetting a password or passphrase.',
        'Watch security staff issue or reset one, confirming a unique value is given and a change is forced at first use.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if passwords/passphrases are not used as an authentication factor anywhere in scope.',
    },
    {
      id: '8.3.6',
      title: 'Password complexity',
      question:
        'Where passwords or passphrases are the authentication factor, is each at least 12 characters long — or 8, where the system cannot manage 12 — and does it mix letters with numbers?',
      requirement:
        'Where a password or passphrase serves as the authentication factor under Requirement 8.3.1, it meets these minimums: a length of at least 12 characters, falling to at least 8 only where the system is incapable of 12; and a mixture of alphabetic and numeric characters.',
      testing: [
        'Inspect the system configuration and confirm the password and passphrase settings enforce that length and that mixture.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if passwords/passphrases are not used as an authentication factor anywhere in scope.',
    },
    {
      id: '8.3.7',
      title: 'Password history',
      question:
        'Is a person stopped from choosing a new password or passphrase that matches any of their previous four?',
      requirement:
        'A person may not adopt a new password or passphrase identical to any of the four they used before it.',
      testing: [
        'Inspect the system configuration and confirm the settings refuse a new password matching any of the previous four.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if passwords/passphrases are not used as an authentication factor anywhere in scope.',
    },
    {
      id: '8.3.8',
      title: 'Authentication policies communicated to users',
      question:
        'Are your authentication policies written down and passed on to every user — how to pick a strong factor, how to look after it, not to fall back on a password used before, and what to do and whom to tell if a password may have been compromised?',
      requirement:
        'Authentication policies and procedures are written down and conveyed to every user. They cover: how to choose a strong authentication factor; how a user should safeguard the factors they hold; an instruction against reusing a password or passphrase used previously; and an instruction to change a password or passphrase wherever there is reason to suspect, or knowledge, that it has been compromised, together with how to report that.',
      testing: [
        'Read the written authentication policies and procedures and confirm each of those points appears.',
        'Ask users to confirm the policies reached them and are understood.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.9',
      title: 'Password changes for single-factor access',
      question:
        'Where a password or passphrase is the only factor standing between a user and access, is it changed at least every 90 days — or is each account’s security posture examined continuously, with access to resources decided in real time on that basis?',
      requirement:
        'Where a password or passphrase is the sole authentication factor for user access, meaning any single-factor arrangement, one of two things holds: the password or passphrase is changed no less often than every 90 days; or each account’s security standing is under continuous examination, with access to resources granted or withheld automatically, in real time, according to what that examination finds.',
      testing: [
        'Inspect the system configuration and confirm either that a change is required at least every 90 days, or that the continuous-analysis mechanism is in place.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if multi-factor authentication is used for all user access, so passwords are never the only authentication factor.',
    },
    {
      id: '8.3.10',
      title: 'Password guidance for customer users',
      question:
        'Where a password or passphrase is the only factor protecting your customers’ access to cardholder data, have you given those customers guidance — that they should change it from time to time, and when and in what circumstances a change is called for?',
      requirement:
        'An extra obligation on service providers. Where a password or passphrase is the sole authentication factor for customer users reaching cardholder data, those customers are given guidance covering: that they should change their password or passphrase from time to time; and when, and in what circumstances, a change is called for.',
      testing: [
        'Read the guidance issued to customer users and confirm it covers both points.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if customer users do not access cardholder data, or if MFA is used for all customer user access.',
    },
    {
      id: '8.3.10.1',
      title: 'Customer password changes or dynamic analysis',
      question:
        'Where a password or passphrase is the only factor protecting customer access, is it changed at least every 90 days — or is each account’s security posture examined continuously, with access decided in real time on that basis?',
      requirement:
        'An extra obligation on service providers. Where a password or passphrase is the sole authentication factor for customer user access, one of two things holds: it is changed no less often than every 90 days; or each account’s security standing is under continuous examination, with access to resources granted or withheld automatically, in real time, according to what that examination finds.',
      testing: [
        'Inspect the system configuration and confirm either that customer passwords must change at least every 90 days, or that the continuous-analysis mechanism is in place.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if customer users do not access cardholder data, or if MFA is used for all customer user access.',
    },
    {
      id: '8.3.11',
      title: 'Tokens, smart cards and certificates',
      question:
        'Where a token, smart card or certificate is the authentication factor, does each belong to one named person rather than being shared, and do physical or logical controls make sure only that person can use it to get in?',
      requirement:
        'Where the authentication factor is a physical or logical security token, a smart card or a certificate, two things hold: each such factor belongs to one individual user and is not shared between several; and physical controls, logical controls, or both, ensure that only the person it belongs to can use it to obtain access.',
      testing: [
        'Read the authentication policies and procedures and confirm this point is dealt with.',
        'Ask staff and watch the process, confirming these factors belong to individuals and are not shared.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if physical or logical security tokens, smart cards, or certificates are not used as authentication factors.',
    },
    {
      id: '8.4.1',
      title: 'MFA for administrative non-console access',
      question:
        'Do administrators need multi-factor authentication for every route into the cardholder data environment other than its own console?',
      requirement:
        'Multi-factor authentication is required of personnel holding administrative access for every route into the cardholder data environment other than the console itself.',
      testing: [
        'Inspect the network and system configurations and confirm multi-factor authentication is demanded on every such administrative route in.',
        'Watch an administrator sign in and confirm multi-factor authentication is demanded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.4.2',
      title: 'MFA for all access into the CDE',
      question:
        'Does every way into the cardholder data environment require multi-factor authentication?',
      requirement:
        'Multi-factor authentication is required for all access into the cardholder data environment.',
      testing: [
        'Inspect the network and system configurations and confirm multi-factor authentication covers every route in.',
        'Watch personnel sign in to the cardholder data environment and confirm multi-factor authentication is demanded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.4.3',
      title: 'MFA for remote network access',
      question:
        'Does multi-factor authentication apply to every remote connection coming in from outside your network that could reach or affect the cardholder data environment — staff and administrators alike, and third parties and vendors too?',
      requirement:
        'Multi-factor authentication applies to every remote network connection originating outside the entity’s own network that could reach or affect the cardholder data environment. That covers remote access by all personnel, ordinary users and administrators alike, arriving from outside the entity’s network; and remote access by third parties and by vendors.',
      testing: [
        'Inspect the configuration of the remote access servers and systems and confirm multi-factor authentication is demanded.',
        'Watch personnel connect from outside and confirm multi-factor authentication is demanded.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.5.1',
      title: 'MFA system implementation',
      question:
        'Is the multi-factor system built so that a captured exchange cannot be replayed against it, so that nobody — administrators included — can go round it except under a documented exception management has authorised for a bounded period, so that at least two different kinds of factor are involved, and so that every factor must succeed before access opens?',
      requirement:
        'Multi-factor authentication systems are built as follows. The system is not vulnerable to a replay attack. Nobody can circumvent it, administrative users included, save under an exception that is documented and authorised by management for a limited period. No fewer than two different kinds of authentication factor are involved. And access opens only once every factor has succeeded.',
      testing: [
        'Read the vendor documentation and inspect the configuration, confirming the system is built as described.',
        'Watch personnel authenticate and confirm that access waits on every factor succeeding.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.6.1',
      title: 'Interactive login for system/application accounts',
      question:
        'Where an account belonging to a system or application can also be logged into interactively, is that interactive use blocked unless an exception calls for it, held to the length of the exception, backed by a written business reason, expressly approved by management, opened only once the individual has been identified, and arranged so every action traces back to one person?',
      requirement:
        'Where an account used by a system or an application is also capable of interactive login, that capability is handled as follows: interactive use is blocked unless an exceptional circumstance calls for it; it lasts no longer than that circumstance requires; the business reason for it is recorded; management expressly approves it; the individual is identified before the account is opened to them; and each action taken remains attributable to one particular person.',
      testing: [
        'Inspect the application and system accounts and their authentication settings, confirming interactive login is handled as described.',
        'Read the authorisation records and the audit logs covering any interactive use that occurred.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if no application or system accounts can be used for interactive login.',
    },
    {
      id: '8.6.2',
      title: 'Hard-coded credentials',
      question:
        'Are the passwords for application and system accounts capable of interactive login kept out of scripts, configuration and property files, and your own source code?',
      requirement:
        'The password or passphrase of an application or system account capable of interactive login does not appear written into a script, a configuration or property file, or bespoke and custom source code.',
      testing: [
        'Search the scripts, the configuration and property files, and your own application source, looking for any password that has been written straight into them.',
        'Ask staff to confirm the arrangements keep credentials out of code.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.6.3',
      title: 'Protection of application/system account passwords',
      question:
        'Are the passwords for application and system accounts guarded against misuse — changed at the interval your targeted risk analysis sets under Requirement 12.3.1 and whenever compromise is suspected or confirmed, and made complex enough to suit how often they change?',
      requirement:
        'The passwords and passphrases of application and system accounts are guarded against misuse in two ways. They are changed on a recurring basis, at an interval set by the entity’s targeted risk analysis carried out against every element Requirement 12.3.1 specifies, and changed additionally whenever compromise is suspected or confirmed. And each is built to a complexity that suits how often the entity changes it.',
      testing: [
        'Read the targeted risk analysis that sets the change interval.',
        'Inspect the system configuration and ask staff, confirming these passwords are changed and built as described.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
