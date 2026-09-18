export default {
  id: 2,
  title: 'Apply Secure Configurations to All System Components',
  goal: 'Build and Maintain a Secure Network and Systems',
  intro:
    'Malicious individuals often use vendor default passwords and other vendor default settings to compromise systems. These passwords and settings are well known and easily determined via public information.',
  questions: [
    {
      id: '2.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 2 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 2 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 2.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 2 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 2 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.1',
      title: 'Configuration standards',
      question:
        'Are configuration standards developed, implemented, and maintained to cover all system components, address all known security vulnerabilities, be consistent with industry-accepted system hardening standards or vendor hardening recommendations, be updated as new vulnerability issues are identified, and be applied when new systems are configured and verified as in place before or immediately after a system component is connected to a production environment?',
      requirement:
        'Configuration standards are developed, implemented, and maintained to: cover all system components; address all known security vulnerabilities; be consistent with industry-accepted system hardening standards or vendor hardening recommendations; be updated as new vulnerability issues are identified, as defined in Requirement 6.3.1; be applied when new systems are configured and verified as in place before or immediately after a system component is connected to a production environment.',
      testing: [
        'Examine system configuration standards and compare to industry-accepted hardening standards.',
        'Examine configuration settings on a sample of system components to verify the standards are applied.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.2',
      title: 'Vendor default accounts',
      question:
        'Are vendor default accounts managed such that, if used, the default password is changed in accordance with Requirement 8.3.6, and if not used, the account is removed or disabled?',
      requirement:
        'Vendor default accounts are managed as follows: if the vendor default account(s) will be used, the default password is changed per Requirement 8.3.6; if the vendor default account(s) will not be used, the account is removed or disabled.',
      testing: [
        'Examine system configuration standards to verify that vendor default accounts are addressed.',
        'Examine a sample of system components and attempt to log on using default vendor accounts and passwords.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.3',
      title: 'Primary functions with different security levels',
      question:
        'Are primary functions requiring different security levels managed so that only one primary function exists on a system component, or primary functions with differing security levels that exist on the same system component are isolated from each other, or primary functions with differing security levels on the same system component are all secured to the level required by the function with the highest security need?',
      requirement:
        'Primary functions requiring different security levels are managed as follows: only one primary function exists on a system component, OR primary functions with differing security levels that exist on the same system component are isolated from each other, OR primary functions with differing security levels on the same system component are all secured to the level required by the function with the highest security need.',
      testing: [
        'Examine system configuration standards to verify that the requirement is addressed.',
        'Examine system configurations to verify that primary functions are managed as specified.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.4',
      title: 'Unnecessary functionality removed',
      question:
        'Are only necessary services, protocols, daemons, and functions enabled, and is all unnecessary functionality removed or disabled?',
      requirement:
        'Only necessary services, protocols, daemons, and functions are enabled, and all unnecessary functionality is removed or disabled.',
      testing: [
        'Examine system configuration standards to verify necessary services, protocols, daemons, and functions are identified and documented.',
        'Examine system configurations to verify that only documented functionality is present and enabled.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.5',
      title: 'Insecure services, protocols or daemons',
      question:
        'If any insecure services, protocols, or daemons are present, is the business justification documented and are additional security features documented and implemented that reduce the risk of using them?',
      requirement:
        'If any insecure services, protocols, or daemons are present: business justification is documented; additional security features are documented and implemented that reduce the risk of using insecure services, protocols, or daemons.',
      testing: [
        'If insecure services, protocols, or daemons are present, examine system configuration standards and interview personnel to verify the business justification is documented.',
        'Examine configuration settings to verify that additional security features are implemented.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no insecure services, protocols, or daemons are present on any in-scope system component.',
    },
    {
      id: '2.2.6',
      title: 'System security parameters',
      question:
        'Are system security parameters configured to prevent misuse?',
      requirement: 'System security parameters are configured to prevent misuse.',
      testing: [
        'Examine system configuration standards to verify that common security parameter settings are defined.',
        'Examine system configurations to verify that the defined security parameters are set appropriately.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.7',
      title: 'Encrypted non-console administrative access',
      question:
        'Is all non-console administrative access encrypted using strong cryptography?',
      requirement:
        'All non-console administrative access is encrypted using strong cryptography.',
      testing: [
        'Examine system components and observe an administrator log on to verify that strong cryptography is invoked before the administrator’s password is requested.',
        'Examine system configurations to verify that services and parameter files are configured to prevent use of insecure remote login technologies.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.3.1',
      title: 'Wireless vendor defaults',
      question:
        'For wireless environments connected to the CDE or transmitting account data, are all wireless vendor defaults changed at installation or confirmed to be secure — including default wireless encryption keys, passwords on wireless access points, SNMP defaults, and any other security-related wireless vendor defaults?',
      requirement:
        'For wireless environments connected to the CDE or transmitting account data, all wireless vendor defaults are changed at installation or are confirmed to be secure, including but not limited to: default wireless encryption keys; passwords on wireless access points; SNMP defaults; any other security-related wireless vendor defaults.',
      testing: [
        'Examine policies and procedures and vendor documentation for wireless devices.',
        'Examine settings on wireless devices to verify that default passwords, encryption keys, and SNMP community strings have been changed or confirmed secure.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no wireless environment is connected to the CDE and no wireless is used to transmit account data.',
    },
    {
      id: '2.3.2',
      title: 'Wireless encryption key changes',
      question:
        'For wireless environments connected to the CDE or transmitting account data, are wireless encryption keys changed whenever personnel with knowledge of the key leave the company or the role for which the knowledge was necessary, and whenever a key is suspected of or known to be compromised?',
      requirement:
        'For wireless environments connected to the CDE or transmitting account data, wireless encryption keys are changed as follows: whenever personnel with knowledge of the key leave the company or the role for which the knowledge was necessary; whenever a key is suspected of or known to be compromised.',
      testing: [
        'Interview responsible personnel and examine key-management documentation to verify that keys are changed as specified.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no wireless environment is connected to the CDE and no wireless is used to transmit account data.',
    },
  ],
};
