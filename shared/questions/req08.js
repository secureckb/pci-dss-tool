export default {
  id: 8,
  title: 'Identify Users and Authenticate Access to System Components',
  goal: 'Implement Strong Access Control Measures',
  intro:
    'Two fundamental principles of identifying and authenticating users are to establish the identity of an individual or process on a computer system, and to prove or verify the user associated with the identity. Assigning a unique identification to each person with access ensures that actions taken on critical data and systems are performed by, and can be traced to, known and authorized users and processes.',
  questions: [
    {
      id: '8.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 8 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 8 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 8.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 8 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 8 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.1',
      title: 'Unique user IDs',
      question:
        'Are all users assigned a unique ID before access to system components or cardholder data is allowed?',
      requirement:
        'All users are assigned a unique ID before access to system components or cardholder data is allowed.',
      testing: [
        'Interview responsible personnel to verify that all users are assigned a unique ID.',
        'Examine audit logs and other evidence to verify that access to system components and cardholder data can be traced to individual users.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.2',
      title: 'Shared and generic accounts',
      question:
        'Are group, shared, or generic accounts, or other shared authentication credentials, used only when necessary on an exception basis, and managed such that account use is prevented unless needed for an exceptional circumstance, use is limited to the time needed, business justification is documented, use is explicitly approved by management, individual user identity is confirmed before access is granted, and every action taken is attributable to an individual user?',
      requirement:
        'Group, shared, or generic accounts, or other shared authentication credentials are only used when necessary on an exception basis, and are managed as follows: account use is prevented unless needed for an exceptional circumstance; use is limited to the time needed for the exceptional circumstance; business justification for use is documented; use is explicitly approved by management; individual user identity is confirmed before access to an account is granted; every action taken is attributable to an individual user.',
      testing: [
        'Examine policies and procedures to verify that use of shared accounts is addressed.',
        'Examine user ID lists, authorization records, and audit logs to verify shared account use is managed as specified.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.3',
      title: 'Unique authentication for each customer premises',
      question:
        'Does your organization, when providing remote access to customer premises, use unique authentication factors for each customer premises?',
      requirement:
        'Additional requirement for service providers only: Service providers with remote access to customer premises use unique authentication factors for each customer premises.',
      testing: [
        'Examine authentication policies and procedures and interview personnel to verify that unique authentication factors are used for access to each customer premises.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if your organization does not have remote access to customer premises.',
    },
    {
      id: '8.2.4',
      title: 'Management of user IDs and credentials',
      question:
        'Is the addition, deletion, and modification of user IDs, authentication factors, and other identifier objects managed such that changes are authorized with the appropriate approval and implemented with only the privileges specified on the documented approval?',
      requirement:
        'Addition, deletion, and modification of user IDs, authentication factors, and other identifier objects are managed as follows: authorized with the appropriate approval; implemented with only the privileges specified on the documented approval.',
      testing: [
        'Examine documented authorizations and compare with the user IDs and privileges implemented.',
        'Interview responsible personnel to verify the process is followed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.5',
      title: 'Revoking access for terminated users',
      question:
        'Is access for terminated users immediately revoked?',
      requirement: 'Access for terminated users is immediately revoked.',
      testing: [
        'Examine information sources for terminated users and review current user access lists to verify that terminated users’ IDs have been deactivated or removed.',
        'Examine physical and logical authentication factors to verify they have been returned or deactivated.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.6',
      title: 'Inactive accounts',
      question:
        'Are inactive user accounts removed or disabled within 90 days of inactivity?',
      requirement:
        'Inactive user accounts are removed or disabled within 90 days of inactivity.',
      testing: [
        'Examine user accounts and last logon information to verify that inactive accounts are removed or disabled within 90 days of inactivity.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.2.7',
      title: 'Third-party remote access accounts',
      question:
        'Are accounts used by third parties to access, support, or maintain system components via remote access enabled only during the time period needed and disabled when not in use, with use monitored for unexpected activity?',
      requirement:
        'Accounts used by third parties to access, support, or maintain system components via remote access are managed as follows: enabled only during the time period needed and disabled when not in use; use is monitored for unexpected activity.',
      testing: [
        'Interview personnel and examine processes for enabling and disabling third-party remote access accounts.',
        'Examine evidence of monitoring to verify that third-party account use is monitored.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no third party has remote access to any in-scope system component.',
    },
    {
      id: '8.2.8',
      title: 'Idle session re-authentication',
      question:
        'If a user session has been idle for more than 15 minutes, is the user required to re-authenticate to re-activate the terminal or session?',
      requirement:
        'If a user session has been idle for more than 15 minutes, the user is required to re-authenticate to re-activate the terminal or session.',
      testing: [
        'Examine system configuration settings to verify that system/session idle time out features have been set to 15 minutes or less.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.1',
      title: 'Authentication factors',
      question:
        'Is all user access to system components for users and administrators authenticated via at least one of the following authentication factors: something you know (such as a password or passphrase), something you have (such as a token device or smart card), or something you are (such as a biometric element)?',
      requirement:
        'All user access to system components for users and administrators is authenticated via at least one of the following authentication factors: something you know, such as a password or passphrase; something you have, such as a token device or smart card; something you are, such as a biometric element.',
      testing: [
        'Examine documentation describing the authentication factor(s) used.',
        'Observe an authentication attempt for each in-use factor to verify authentication is performed as described.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.2',
      title: 'Authentication factors rendered unreadable',
      question:
        'Is strong cryptography used to render all authentication factors unreadable during transmission and storage on all system components?',
      requirement:
        'Strong cryptography is used to render all authentication factors unreadable during transmission and storage on all system components.',
      testing: [
        'Examine vendor documentation and system configuration settings to verify that authentication factors are rendered unreadable with strong cryptography during transmission and storage.',
        'Examine repositories of authentication factors to verify they are unreadable during storage.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.3',
      title: 'Identity verification before credential changes',
      question:
        'Is user identity verified before modifying any authentication factor?',
      requirement:
        'User identity is verified before modifying any authentication factor.',
      testing: [
        'Examine procedures for modifying authentication factors and interview personnel to verify that user identity is verified before any modification.',
        'Observe a request to modify an authentication factor to verify identity is confirmed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.4',
      title: 'Account lockout',
      question:
        'Are invalid authentication attempts limited by locking out the user ID after not more than 10 attempts, and setting the lockout duration to a minimum of 30 minutes or until the user’s identity is confirmed?',
      requirement:
        'Invalid authentication attempts are limited by: locking out the user ID after not more than 10 attempts; setting the lockout duration to a minimum of 30 minutes or until the user’s identity is confirmed.',
      testing: [
        'Examine system configuration settings to verify that authentication parameters are set to require lockout after not more than 10 invalid attempts.',
        'Examine system configuration settings to verify that the lockout duration is set to a minimum of 30 minutes or until identity is confirmed.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.5',
      title: 'First-time and reset passwords',
      question:
        'If passwords/passphrases are used as authentication factors, are they set and reset for each user such that they are set to a unique value for first-time use and upon reset, and forced to be changed immediately after the first use?',
      requirement:
        'If passwords/passphrases are used as authentication factors to meet Requirement 8.3.1, they are set and reset for each user as follows: set to a unique value for first-time use and upon reset; forced to be changed immediately after the first use.',
      testing: [
        'Examine procedures for setting and resetting passwords/passphrases.',
        'Observe security personnel set or reset a password/passphrase to verify a unique value is set and a change is forced on first use.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if passwords/passphrases are not used as an authentication factor anywhere in scope.',
    },
    {
      id: '8.3.6',
      title: 'Password complexity',
      question:
        'If passwords/passphrases are used as authentication factors, do they meet a minimum length of 12 characters (or, if the system does not support 12 characters, a minimum length of 8 characters) and contain both numeric and alphabetic characters?',
      requirement:
        'If passwords/passphrases are used as authentication factors to meet Requirement 8.3.1, they meet the following minimum level of complexity: a minimum length of 12 characters (or IF the system does not support 12 characters, a minimum length of eight characters); contain both numeric and alphabetic characters.',
      testing: [
        'Examine system configuration settings to verify that password/passphrase parameters are set to require the specified complexity.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if passwords/passphrases are not used as an authentication factor anywhere in scope.',
    },
    {
      id: '8.3.7',
      title: 'Password history',
      question:
        'Are individuals prevented from submitting a new password/passphrase that is the same as any of the last four passwords/passphrases used?',
      requirement:
        'Individuals are not allowed to submit a new password/passphrase that is the same as any of the last four passwords/passphrases used.',
      testing: [
        'Examine system configuration settings to verify that password parameters are set to require that new passwords cannot be the same as the four previously used passwords.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if passwords/passphrases are not used as an authentication factor anywhere in scope.',
    },
    {
      id: '8.3.8',
      title: 'Authentication policies communicated to users',
      question:
        'Are authentication policies and procedures documented and communicated to all users, including guidance on selecting strong authentication factors, guidance for how users should protect their authentication factors, instructions not to reuse previously used passwords/passphrases, and instructions to change passwords/passphrases if there is any suspicion or knowledge of compromise and how to report the incident?',
      requirement:
        'Authentication policies and procedures are documented and communicated to all users including: guidance on selecting strong authentication factors; guidance for how users should protect their authentication factors; instructions not to reuse previously used passwords/passphrases; instructions to change passwords/passphrases if there is any suspicion or knowledge that the password/passphrases have been compromised and how to report the incident.',
      testing: [
        'Examine documented authentication policies and procedures to verify all required elements are included.',
        'Interview users to verify the policies and procedures have been communicated and are understood.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.3.9',
      title: 'Password changes for single-factor access',
      question:
        'If passwords/passphrases are used as the only authentication factor for user access (single-factor authentication), are they changed at least once every 90 days, or is the security posture of accounts dynamically analyzed with real-time access to resources automatically determined accordingly?',
      requirement:
        'If passwords/passphrases are used as the only authentication factor for user access (i.e., in any single-factor authentication implementation) then either: passwords/passphrases are changed at least once every 90 days, OR the security posture of accounts is dynamically analyzed, and real-time access to resources is automatically determined accordingly.',
      testing: [
        'Examine system configuration settings to verify that password parameters require changes at least once every 90 days, OR examine the dynamic analysis mechanism.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if multi-factor authentication is used for all user access, so passwords are never the only authentication factor.',
    },
    {
      id: '8.3.10',
      title: 'Password guidance for customer users',
      question:
        'If passwords/passphrases are used as the only authentication factor for customer user access to cardholder data, is guidance provided to customer users including guidance for customers to change their passwords/passphrases periodically, and guidance as to when and under what circumstances passwords/passphrases are to be changed?',
      requirement:
        'Additional requirement for service providers only: If passwords/passphrases are used as the only authentication factor for customer user access to cardholder data, then guidance is provided to customer users including: guidance for customers to change their user passwords/passphrases periodically; guidance as to when, and under what circumstances, passwords/passphrases are to be changed.',
      testing: [
        'Examine the guidance provided to customer users to verify it includes all required elements.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if customer users do not access cardholder data, or if MFA is used for all customer user access.',
    },
    {
      id: '8.3.10.1',
      title: 'Customer password changes or dynamic analysis',
      question:
        'If passwords/passphrases are used as the only authentication factor for customer user access, are passwords/passphrases changed at least once every 90 days, or is the security posture of accounts dynamically analyzed with real-time access to resources automatically determined accordingly?',
      requirement:
        'Additional requirement for service providers only: If passwords/passphrases are used as the only authentication factor for customer user access then either: passwords/passphrases are changed at least once every 90 days, OR the security posture of accounts is dynamically analyzed, and real-time access to resources is automatically determined accordingly.',
      testing: [
        'Examine system configuration settings to verify that customer user passwords are required to be changed at least once every 90 days, OR examine the dynamic analysis mechanism.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if customer users do not access cardholder data, or if MFA is used for all customer user access.',
    },
    {
      id: '8.3.11',
      title: 'Tokens, smart cards and certificates',
      question:
        'Where authentication factors such as physical or logical security tokens, smart cards, or certificates are used, are these factors assigned to an individual user and not shared among multiple users, and do physical and/or logical controls ensure only the intended user can use that factor to gain access?',
      requirement:
        'Where authentication factors such as physical or logical security tokens, smart cards, or certificates are used: factors are assigned to an individual user and not shared among multiple users; physical and/or logical controls ensure only the intended user can use that factor to gain access.',
      testing: [
        'Examine authentication policies and procedures to verify that the requirement is addressed.',
        'Interview personnel and observe processes to verify that factors are assigned to individuals and not shared.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if physical or logical security tokens, smart cards, or certificates are not used as authentication factors.',
    },
    {
      id: '8.4.1',
      title: 'MFA for administrative non-console access',
      question:
        'Is multi-factor authentication implemented for all non-console access into the CDE for personnel with administrative access?',
      requirement:
        'MFA is implemented for all non-console access into the CDE for personnel with administrative access.',
      testing: [
        'Examine network and system configurations to verify that MFA is required for all non-console administrative access into the CDE.',
        'Observe an administrator logging in to verify that MFA is required.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.4.2',
      title: 'MFA for all access into the CDE',
      question:
        'Is multi-factor authentication implemented for all access into the CDE?',
      requirement: 'MFA is implemented for all access into the CDE.',
      testing: [
        'Examine network and system configurations to verify that MFA is implemented for all access into the CDE.',
        'Observe personnel logging in to the CDE to verify that MFA is required.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.4.3',
      title: 'MFA for remote network access',
      question:
        'Is multi-factor authentication implemented for all remote network access originating from outside your network that could access or impact the CDE — including all remote access by all personnel, both users and administrators, and all remote access by third parties and vendors?',
      requirement:
        'MFA is implemented for all remote network access originating from outside the entity’s network that could access or impact the CDE as follows: all remote access by all personnel, both users and administrators, originating from outside the entity’s network; all remote access by third parties and vendors.',
      testing: [
        'Examine network and system configurations for remote access servers and systems to verify MFA is required.',
        'Observe personnel connecting remotely to verify that MFA is required.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.5.1',
      title: 'MFA system implementation',
      question:
        'Are MFA systems implemented such that the MFA system is not susceptible to replay attacks, MFA systems cannot be bypassed by any users including administrative users unless specifically documented and authorized by management on an exception basis for a limited time period, at least two different types of authentication factors are used, and success of all authentication factors is required before access is granted?',
      requirement:
        'MFA systems are implemented as follows: the MFA system is not susceptible to replay attacks; MFA systems cannot be bypassed by any users, including administrative users unless specifically documented, and authorized by management on an exception basis, for a limited time period; at least two different types of authentication factors are used; success of all authentication factors is required before access is granted.',
      testing: [
        'Examine vendor system documentation and configuration settings to verify that the MFA system is implemented as specified.',
        'Observe personnel authenticating to verify that all factors must succeed before access is granted.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.6.1',
      title: 'Interactive login for system/application accounts',
      question:
        'If accounts used by systems or applications can be used for interactive login, are they managed such that interactive use is prevented unless needed for an exceptional circumstance, limited to the time needed, with business justification documented, explicitly approved by management, individual user identity confirmed before access is granted, and every action attributable to an individual user?',
      requirement:
        'If accounts used by systems or applications can be used for interactive login, they are managed as follows: interactive use is prevented unless needed for an exceptional circumstance; interactive use is limited to the time needed for the exceptional circumstance; business justification for interactive use is documented; interactive use is explicitly approved by management; individual user identity is confirmed before access to an account is granted; every action taken is attributable to an individual user.',
      testing: [
        'Examine application and system accounts and related authentication settings to verify interactive login is managed as specified.',
        'Examine authorization records and audit logs for any interactive use.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if no application or system accounts can be used for interactive login.',
    },
    {
      id: '8.6.2',
      title: 'Hard-coded credentials',
      question:
        'Are passwords/passphrases for any application and system accounts that can be used for interactive login prevented from being hard coded in scripts, configuration/property files, or bespoke and custom source code?',
      requirement:
        'Passwords/passphrases for any application and system accounts that can be used for interactive login are not hard coded in scripts, configuration/property files, or bespoke and custom source code.',
      testing: [
        'Examine scripts, configuration/property files, and bespoke and custom source code for evidence that passwords/passphrases are not hard coded.',
        'Interview personnel to verify that processes prevent hard-coded credentials.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '8.6.3',
      title: 'Protection of application/system account passwords',
      question:
        'Are passwords/passphrases for any application and system accounts protected against misuse by being changed periodically at the frequency defined in your targeted risk analysis performed according to Requirement 12.3.1 and upon suspicion or confirmation of compromise, and constructed with sufficient complexity appropriate for how frequently they are changed?',
      requirement:
        'Passwords/passphrases for any application and system accounts are protected against misuse as follows: passwords/passphrases are changed periodically (at the frequency defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1) and upon suspicion or confirmation of compromise; passwords/passphrases are constructed with sufficient complexity appropriate for how frequently the entity changes the passwords/passphrases.',
      testing: [
        'Examine the targeted risk analysis defining the change frequency.',
        'Examine system configuration settings and interview personnel to verify passwords for application and system accounts are changed and constructed as specified.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
