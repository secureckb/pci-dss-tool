export default {
  id: 4,
  title: 'Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public Networks',
  goal: 'Protect Account Data',
  intro:
    'Once data leaves the entity’s own network it travels over ground the entity does not control, where anyone positioned on the path can read it. Requirement 4 is about making that traffic unintelligible to them — and about not quietly falling back to an older protocol that no longer makes it so.',
  questions: [
    {
      id: '4.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 4 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 4. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 4.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '4.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 4 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 4 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '4.2.1',
      title: 'Strong cryptography for PAN in transit',
      question:
        'When PAN crosses an open or public network, is it protected by strong cryptography and secure protocols — accepting only keys and certificates you trust, checking that each certificate is valid rather than expired or revoked, running the protocol in a secure version and configuration with no route back to a weak one, and using an encryption strength that suits the method chosen?',
      requirement:
        'PAN travelling over open or public networks is protected by strong cryptography and secure protocols, arranged as follows. Only keys and certificates the entity trusts are accepted. Certificates relied on for this protection are verified as valid, and are neither expired nor revoked. The protocol runs only in secure versions and configurations, with no ability to fall back to, or otherwise use, an insecure version, algorithm, key size or implementation. The strength of encryption suits the encryption method in use.',
      testing: [
        'Read the documented policies and procedures and inspect the system configurations to confirm strong cryptography and secure protocols are in force.',
        'Observe the configurations and confirm two things: nothing but a trusted key or certificate is accepted, and no weak version or configuration remains reachable.',
        'Inspect the certificates in use and confirm each is valid, unexpired and unrevoked.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if PAN is never transmitted over open, public networks by your organization.',
    },
    {
      id: '4.2.1.1',
      title: 'Inventory of trusted keys and certificates',
      question:
        'Do you keep a list of the trusted keys and certificates your organisation relies on to protect PAN in transit?',
      requirement:
        'The entity maintains an inventory of the trusted keys and certificates it relies on to protect PAN while in transit.',
      testing: [
        'Read the documented procedures and confirm a process is defined for keeping this inventory.',
        'Compare the inventory against the system configurations and confirm it is both complete and current.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if PAN is never transmitted over open, public networks by your organization.',
    },
    {
      id: '4.2.1.2',
      title: 'Wireless transmission of PAN',
      question:
        'Where a wireless network carries PAN or attaches to the cardholder data environment, does it follow current industry practice in applying strong cryptography to both authentication and the traffic itself?',
      requirement:
        'Wireless networks that carry PAN, or that attach to the cardholder data environment, apply strong cryptography to authentication and to transmission, following prevailing industry practice.',
      testing: [
        'Inspect the configurations of wireless networks that carry PAN or attach to the cardholder data environment, and confirm strong cryptography is applied in line with prevailing industry practice.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no wireless network transmits PAN and no wireless network is connected to the CDE.',
    },
    {
      id: '4.2.2',
      title: 'PAN sent via end-user messaging',
      question:
        'Any time PAN goes out through a messaging tool people use directly — email, instant messaging, SMS, chat — is it protected by strong cryptography?',
      requirement:
        'Whenever PAN is sent using an end-user messaging technology, it is protected by strong cryptography.',
      testing: [
        'Read the documented policies and procedures and confirm a process exists to protect PAN with strong cryptography on every such transmission.',
        'Inspect the system configurations and the vendor documentation and confirm that protection is actually applied.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if PAN is never sent via end-user messaging technologies. Note: a documented prohibition alone is not sufficient if the practice actually occurs.',
    },
  ],
};
