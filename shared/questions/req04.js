export default {
  id: 4,
  title: 'Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public Networks',
  goal: 'Protect Account Data',
  intro:
    'Sensitive information must be encrypted during transmission over networks that are easily accessed by malicious individuals. Misconfigured wireless networks and vulnerabilities in legacy encryption and authentication protocols continue to be targets of malicious individuals who exploit these vulnerabilities to gain privileged access to CDEs.',
  questions: [
    {
      id: '4.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 4 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 4 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 4.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '4.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 4 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 4 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '4.2.1',
      title: 'Strong cryptography for PAN in transit',
      question:
        'Are strong cryptography and security protocols implemented to safeguard PAN during transmission over open, public networks, such that only trusted keys and certificates are accepted, certificates used to safeguard PAN are confirmed as valid and not expired or revoked, the protocol in use supports only secure versions or configurations and does not support fallback to insecure versions, algorithms, key sizes, or implementations, and the encryption strength is appropriate for the encryption methodology in use?',
      requirement:
        'Strong cryptography and security protocols are implemented as follows to safeguard PAN during transmission over open, public networks: only trusted keys and certificates are accepted; certificates used to safeguard PAN during transmission over open, public networks are confirmed as valid and are not expired or revoked; the protocol in use supports only secure versions or configurations and does not support fallback to, or use of insecure versions, algorithms, key sizes, or implementations; the encryption strength is appropriate for the encryption methodology in use.',
      testing: [
        'Examine documented policies and procedures and system configurations to verify that strong cryptography and security protocols are implemented.',
        'Observe system configurations to verify only trusted keys and certificates are accepted and that insecure versions or configurations are not supported.',
        'Examine certificates in use to verify they are valid and not expired or revoked.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if PAN is never transmitted over open, public networks by your organization.',
    },
    {
      id: '4.2.1.1',
      title: 'Inventory of trusted keys and certificates',
      question:
        'Is an inventory of your organization’s trusted keys and certificates used to protect PAN during transmission maintained?',
      requirement:
        'An inventory of the entity’s trusted keys and certificates used to protect PAN during transmission is maintained.',
      testing: [
        'Examine documented procedures to verify processes are defined for maintaining an inventory of trusted keys and certificates.',
        'Examine the inventory and compare with system configurations to verify the inventory is complete and current.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if PAN is never transmitted over open, public networks by your organization.',
    },
    {
      id: '4.2.1.2',
      title: 'Wireless transmission of PAN',
      question:
        'Are wireless networks transmitting PAN, or connected to the CDE, using industry best practices to implement strong cryptography for authentication and transmission?',
      requirement:
        'Wireless networks transmitting PAN or connected to the CDE use industry best practices to implement strong cryptography for authentication and transmission.',
      testing: [
        'Examine system configurations to verify that wireless networks transmitting PAN or connected to the CDE use industry best practices for strong cryptography.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no wireless network transmits PAN and no wireless network is connected to the CDE.',
    },
    {
      id: '4.2.2',
      title: 'PAN sent via end-user messaging',
      question:
        'Is PAN secured with strong cryptography whenever it is sent via end-user messaging technologies such as email, instant messaging, SMS, or chat?',
      requirement:
        'PAN is secured with strong cryptography whenever it is sent via end-user messaging technologies.',
      testing: [
        'Examine documented policies and procedures to verify processes are in place to secure PAN with strong cryptography whenever sent via end-user messaging technologies.',
        'Examine system configurations and vendor documentation to verify PAN is secured with strong cryptography whenever sent via end-user messaging technologies.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if PAN is never sent via end-user messaging technologies. Note: a documented prohibition alone is not sufficient if the practice actually occurs.',
    },
  ],
};
