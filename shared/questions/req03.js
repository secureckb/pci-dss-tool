export default {
  id: 3,
  title: 'Protect Stored Account Data',
  goal: 'Protect Account Data',
  intro:
    'Protection methods such as encryption, truncation, masking, and hashing are critical components of account data protection. If an intruder circumvents other security controls and gains access to encrypted account data, without the proper cryptographic keys the data is unreadable and unusable to that person.',
  questions: [
    {
      id: '3.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 3 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 3 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: ['Examine documented policies and procedures for Requirement 3.', 'Interview personnel to verify they are in use and known.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 3 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 3 are documented, assigned, and understood.',
      testing: ['Examine documentation of roles and responsibilities.', 'Interview responsible personnel to verify they are understood.'],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.2.1',
      title: 'Data retention and disposal',
      question:
        'Is account data storage kept to a minimum through implementation of data retention and disposal policies, procedures, and processes that cover all locations of stored account data, cover any sensitive authentication data stored prior to authorization, limit data storage amount and retention time to that required for legal, regulatory, and/or business requirements, include specific retention requirements for stored account data, include processes for secure deletion or rendering account data unrecoverable when no longer needed, and include a process for verifying at least once every three months that stored account data exceeding the defined retention period has been securely deleted or rendered unrecoverable?',
      requirement:
        'Account data storage is kept to a minimum through implementation of data retention and disposal policies, procedures, and processes that include at least the following: coverage for all locations of stored account data; coverage for any sensitive authentication data (SAD) stored prior to completion of authorization; limiting data storage amount and retention time to that which is required for legal or regulatory, and/or business requirements; specific retention requirements for stored account data that defines length of retention period and includes a documented business justification; processes for secure deletion or rendering account data unrecoverable when no longer needed per the retention policy; a process for verifying, at least once every three months, that stored account data exceeding the defined retention period has been securely deleted or rendered unrecoverable.',
      testing: [
        'Examine the data retention and disposal policies, procedures, and processes.',
        'Examine files and system records to verify that stored data does not exceed the defined retention requirements.',
        'Observe the deletion mechanism to verify data is deleted securely.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.1',
      title: 'SAD not retained after authorization',
      question:
        'Is sensitive authentication data (SAD) not retained after authorization, even if encrypted, and is all SAD received rendered unrecoverable upon completion of the authorization process?',
      requirement:
        'SAD is not retained after authorization, even if encrypted. All sensitive authentication data received is rendered unrecoverable upon completion of the authorization process.',
      testing: [
        'Examine documented policies, procedures, and system configurations to verify SAD is not retained after authorization.',
        'Examine a sample of data sources including incoming transaction data, logs, history files, trace files, database schemas, and contents to verify no SAD is retained.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.1.1',
      title: 'Full track data not retained',
      question:
        'Is the full contents of any track not retained upon completion of the authorization process?',
      requirement:
        'The full contents of any track are not retained upon completion of the authorization process.',
      testing: [
        'Examine data sources to verify that the full contents of any track are not stored upon completion of the authorization process.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.1.2',
      title: 'Card verification code not retained',
      question:
        'Is the card verification code not retained upon completion of the authorization process?',
      requirement:
        'The card verification code is not retained upon completion of the authorization process.',
      testing: [
        'Examine data sources to verify that the card verification code is not stored upon completion of the authorization process.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.1.3',
      title: 'PIN and PIN block not retained',
      question:
        'Are the personal identification number (PIN) and the PIN block not retained upon completion of the authorization process?',
      requirement:
        'The personal identification number (PIN) and the PIN block are not retained upon completion of the authorization process.',
      testing: [
        'Examine data sources to verify that PINs and PIN blocks are not stored upon completion of the authorization process.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.2',
      title: 'SAD stored before authorization is encrypted',
      question:
        'Is SAD that is stored electronically prior to completion of authorization encrypted using strong cryptography?',
      requirement:
        'SAD that is stored electronically prior to completion of authorization is encrypted using strong cryptography.',
      testing: [
        'Examine data stores, system configurations, and vendor documentation to verify that all SAD stored electronically prior to completion of authorization is encrypted using strong cryptography.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no sensitive authentication data is stored electronically at any point prior to authorization.',
    },
    {
      id: '3.3.3',
      title: 'Issuer storage of SAD',
      question:
        'For issuers and companies that support issuing services and store sensitive authentication data, is any storage of SAD limited to that which is needed for a legitimate issuing business need, secured, and encrypted using strong cryptography?',
      requirement:
        'Additional requirement for issuers and companies that support issuing services and store sensitive authentication data: Any storage of sensitive authentication data is: limited to that which is needed for a legitimate issuing business need and is secured; encrypted using strong cryptography.',
      testing: [
        'Examine documented policies and data stores to verify that SAD storage is limited to that needed for a legitimate issuing business need.',
        'Examine data stores and system configurations to verify the data is encrypted using strong cryptography.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if your organization is not an issuer and does not support issuing services.',
    },
    {
      id: '3.4.1',
      title: 'PAN masking on display',
      question:
        'Is PAN masked when displayed — with the BIN and last four digits being the maximum number of digits displayed — such that only personnel with a legitimate business need can see more than the BIN and last four digits of the PAN?',
      requirement:
        'PAN is masked when displayed (the BIN and last four digits are the maximum number of digits to be displayed), such that only personnel with a legitimate business need can see more than the BIN and last four digits of the PAN.',
      testing: [
        'Examine documented policies and procedures for masking PAN displays.',
        'Examine system configurations and observe displays of PAN to verify that PAN is masked as specified.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.4.2',
      title: 'Copy/relocation of PAN via remote access',
      question:
        'When using remote-access technologies, do technical controls prevent copy and/or relocation of PAN for all personnel, except for those with documented, explicit authorization and a legitimate, defined business need?',
      requirement:
        'When using remote-access technologies, technical controls prevent copy and/or relocation of PAN for all personnel, except for those with documented, explicit authorization and a legitimate, defined business need.',
      testing: [
        'Examine documented policies and procedures and remote-access technology configurations.',
        'Observe processes and interview personnel to verify that copy and/or relocation of PAN is prevented for personnel without explicit authorization.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no remote-access technology can be used to access systems that display or store PAN.',
    },
    {
      id: '3.5.1',
      title: 'PAN rendered unreadable in storage',
      question:
        'Is PAN rendered unreadable anywhere it is stored by using one-way hashes based on strong cryptography of the entire PAN, truncation, index tokens, or strong cryptography with associated key-management processes and procedures?',
      requirement:
        'PAN is rendered unreadable anywhere it is stored by using any of the following approaches: one-way hashes based on strong cryptography of the entire PAN; truncation (hashing cannot be used to replace the truncated segment of PAN) — if hashed and truncated versions of the same PAN, or different truncation formats of the same PAN, are present in an environment, additional controls are in place such that the different versions cannot be correlated to reconstruct the original PAN; index tokens; strong cryptography with associated key-management processes and procedures.',
      testing: [
        'Examine documentation about the system used to render PAN unreadable, including the vendor, type of system/process, and encryption algorithms.',
        'Examine data repositories and audit logs, including payment application logs, to verify the PAN is rendered unreadable.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if PAN is never stored electronically by your organization.',
    },
    {
      id: '3.5.1.1',
      title: 'Keyed cryptographic hashes',
      question:
        'If hashes are used to render PAN unreadable, are they keyed cryptographic hashes of the entire PAN, with associated key-management processes and procedures in accordance with Requirements 3.6 and 3.7?',
      requirement:
        'Hashes used to render PAN unreadable (per the first bullet of Requirement 3.5.1) are keyed cryptographic hashes of the entire PAN, with associated key-management processes and procedures in accordance with Requirements 3.6 and 3.7.',
      testing: [
        'Examine documentation about the hashing method used to verify that keyed cryptographic hashes of the entire PAN are used.',
        'Examine documentation about key-management procedures and processes to verify keys are managed per Requirements 3.6 and 3.7.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if hashing is not used to render PAN unreadable.',
    },
    {
      id: '3.5.1.2',
      title: 'Disk-level encryption limitations',
      question:
        'If disk-level or partition-level encryption is used to render PAN unreadable, is it implemented only on removable electronic media, or — if used for non-removable electronic media — is PAN also rendered unreadable via another mechanism that meets Requirement 3.5.1?',
      requirement:
        'If disk-level or partition-level encryption (rather than file-, column-, or field-level database encryption) is used to render PAN unreadable, it is implemented only as follows: on removable electronic media, OR, if used for non-removable electronic media, PAN is also rendered unreadable via another mechanism that meets Requirement 3.5.1.',
      testing: [
        'Examine encryption processes and system configurations to verify that disk-level or partition-level encryption is implemented only as specified.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if disk-level or partition-level encryption is not used to render PAN unreadable.',
    },
    {
      id: '3.5.1.3',
      title: 'Disk-level encryption access management',
      question:
        'If disk-level or partition-level encryption is used to render PAN unreadable, is logical access managed separately and independently of native operating system authentication and access control mechanisms, and are decryption keys not associated with user accounts?',
      requirement:
        'If disk-level or partition-level encryption is used (rather than file-, column-, or field-level database encryption) to render PAN unreadable, it is managed as follows: logical access is managed separately and independently of native operating system authentication and access control mechanisms; decryption keys are not associated with user accounts.',
      testing: [
        'Examine system configurations and observe the authentication process to verify that logical access is managed independently of native OS authentication.',
        'Examine key-management procedures to verify that decryption keys are not associated with user accounts.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if disk-level or partition-level encryption is not used to render PAN unreadable.',
    },
    {
      id: '3.6.1',
      title: 'Protection of cryptographic keys',
      question:
        'Are procedures defined and implemented to protect cryptographic keys used to protect stored account data against disclosure and misuse?',
      requirement:
        'Procedures are defined and implemented to protect cryptographic keys used to protect stored account data against disclosure and misuse, including: access to keys is restricted to the fewest number of custodians necessary; key-encrypting keys are at least as strong as the data-encrypting keys they protect; key-encrypting keys are stored separately from data-encrypting keys; keys are stored securely in the fewest possible locations and forms.',
      testing: [
        'Examine documented key-management policies and procedures.',
        'Interview responsible personnel to verify the procedures are implemented.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.6.1.1',
      title: 'Documented cryptographic architecture',
      question:
        'Is a documented description of the cryptographic architecture maintained that includes details of all algorithms, protocols, and keys used for the protection of stored account data, preventing the use of the same cryptographic keys in production and test environments, a description of the key usage for each key, and an inventory of any hardware security modules, key management systems, and other secure cryptographic devices used for key management?',
      requirement:
        'Additional requirement for service providers only: A documented description of the cryptographic architecture is maintained that includes: details of all algorithms, protocols, and keys used for the protection of stored account data, including key strength and expiry date; preventing the use of the same cryptographic keys in production and test environments; description of the key usage for each key; inventory of any hardware security modules (HSMs), key management systems (KMS), and other secure cryptographic devices (SCDs) used for key management, including type and location of devices.',
      testing: [
        'Examine documentation to verify that a description of the cryptographic architecture exists and includes all required elements.',
        'Interview responsible personnel to verify the documentation is maintained and current.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.6.1.2',
      title: 'Storage form of secret and private keys',
      question:
        'Are secret and private keys used to protect stored account data stored at all times in one or more of the following forms: encrypted with a key-encrypting key that is at least as strong as the data-encrypting key and stored separately from it; within a secure cryptographic device such as an HSM or PTS-approved point-of-interaction device; or as at least two full-length key components or key shares in accordance with an industry-accepted method?',
      requirement:
        'Secret and private keys used to protect stored account data are stored in one (or more) of the following forms at all times: encrypted with a key-encrypting key that is at least as strong as the data-encrypting key, and that is stored separately from the data-encrypting key; within a secure cryptographic device (SCD), such as a hardware security module (HSM) or PTS-approved point-of-interaction device; as at least two full-length key components or key shares, in accordance with an industry-accepted method.',
      testing: [
        'Examine documented key-management procedures to verify that keys are stored as specified.',
        'Examine system configurations and key storage locations to verify keys are stored in one of the permitted forms.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.6.1.3',
      title: 'Restricting access to cleartext key components',
      question:
        'Is access to cleartext cryptographic key components restricted to the fewest number of custodians necessary?',
      requirement:
        'Access to cleartext cryptographic key components is restricted to the fewest number of custodians necessary.',
      testing: [
        'Examine user access lists and key-custodian documentation to verify that access to cleartext key components is restricted to the fewest custodians necessary.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.6.1.4',
      title: 'Key storage locations',
      question:
        'Are cryptographic keys stored in the fewest possible locations?',
      requirement: 'Cryptographic keys are stored in the fewest possible locations.',
      testing: [
        'Examine key-management documentation and key storage locations to verify keys are stored in the fewest possible locations.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.1',
      title: 'Generation of strong keys',
      question:
        'Are key-management policies and procedures implemented to include the generation of strong cryptographic keys used to protect stored account data?',
      requirement:
        'Key-management policies and procedures are implemented to include generation of strong cryptographic keys used to protect stored account data.',
      testing: [
        'Examine the documented key-management policies and procedures for keys used to protect stored account data.',
        'Observe the method for generating keys to verify that strong keys are generated.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.2',
      title: 'Secure key distribution',
      question:
        'Are key-management policies and procedures implemented to include secure distribution of cryptographic keys used to protect stored account data?',
      requirement:
        'Key-management policies and procedures are implemented to include secure distribution of cryptographic keys used to protect stored account data.',
      testing: [
        'Examine documented key-management policies and procedures.',
        'Observe the method for distributing keys to verify keys are distributed securely.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.3',
      title: 'Secure key storage',
      question:
        'Are key-management policies and procedures implemented to include secure storage of cryptographic keys used to protect stored account data?',
      requirement:
        'Key-management policies and procedures are implemented to include secure storage of cryptographic keys used to protect stored account data.',
      testing: [
        'Examine documented key-management policies and procedures.',
        'Observe the method for storing keys to verify keys are stored securely.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.4',
      title: 'Key changes at cryptoperiod end',
      question:
        'Do key-management policies and procedures for cryptographic keys used to protect stored account data include cryptographic key changes for keys that have reached the end of their cryptoperiod, as defined by the associated application vendor or key owner and based on industry best practices and guidelines?',
      requirement:
        'Key-management policies and procedures are implemented for cryptographic key changes for keys that have reached the end of their cryptoperiod, as defined by the associated application vendor or key owner, and based on industry best practices and guidelines, including the following: a defined cryptoperiod for each key type in use; a process for key changes at the end of the defined cryptoperiod.',
      testing: [
        'Examine documented key-management policies and procedures to verify a defined cryptoperiod exists for each key type.',
        'Interview personnel and examine records to verify keys are changed at the end of the defined cryptoperiod.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.5',
      title: 'Key retirement, replacement and destruction',
      question:
        'Are key-management policies and procedures implemented to include the retirement, replacement, or destruction of keys used to protect stored account data when the integrity of the key has been weakened, or when the key is suspected of or known to be compromised, and are retained keys used only for decryption or verification purposes?',
      requirement:
        'Key-management policies procedures are implemented to include the retirement, replacement, or destruction of keys used to protect stored account data, as deemed necessary when: the key has reached the end of its defined cryptoperiod; the integrity of the key has been weakened, including when personnel with knowledge of a cleartext key component leaves the company or the role for which the key component was known; the key is suspected of or known to be compromised. If retired or replaced cryptographic keys are retained, these keys are not used for encryption operations.',
      testing: [
        'Examine documented key-management policies and procedures.',
        'Interview personnel to verify processes are implemented for retirement, replacement, or destruction of keys.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.6',
      title: 'Split knowledge and dual control',
      question:
        'Where manual cleartext cryptographic key-management operations are performed, are key-management policies and procedures implemented to include the use of split knowledge and dual control?',
      requirement:
        'Where manual cleartext cryptographic key-management operations are performed by personnel, key-management policies and procedures are implemented to include managing these operations using split knowledge and dual control.',
      testing: [
        'Examine documented key-management policies and procedures.',
        'Interview personnel and/or observe processes to verify that manual cleartext key operations require split knowledge and dual control.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if no manual cleartext cryptographic key-management operations are performed.',
    },
    {
      id: '3.7.7',
      title: 'Prevention of unauthorized key substitution',
      question:
        'Are key-management policies and procedures implemented to include the prevention of unauthorized substitution of cryptographic keys?',
      requirement:
        'Key-management policies and procedures are implemented to include the prevention of unauthorized substitution of cryptographic keys.',
      testing: [
        'Examine documented key-management policies and procedures.',
        'Interview personnel to verify processes prevent unauthorized key substitution.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.8',
      title: 'Key custodian acknowledgements',
      question:
        'Are key-management policies and procedures implemented to include that cryptographic key custodians formally acknowledge, in writing or electronically, that they understand and accept their key-custodian responsibilities?',
      requirement:
        'Key-management policies and procedures are implemented to include that cryptographic key custodians formally acknowledge (in writing or electronically) that they understand and accept their key-custodian responsibilities.',
      testing: [
        'Examine documented key-management policies and procedures.',
        'Examine documentation or other evidence showing that key custodians have provided acknowledgements.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.9',
      title: 'Key guidance shared with customers',
      question:
        'Where your organization shares cryptographic keys with customers for transmission or storage of account data, is guidance on secure transmission, storage, and updating of such keys documented and distributed to customers?',
      requirement:
        'Additional requirement for service providers only: Where a service provider shares cryptographic keys with customers for transmission or storage of account data, guidance on secure transmission, storage, and updating of such keys is documented and distributed to customers.',
      testing: [
        'Examine documentation to verify that guidance for secure transmission, storage, and updating of cryptographic keys is documented.',
        'Interview personnel and examine records to verify the guidance is distributed to customers.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if cryptographic keys are not shared with customers.',
    },
  ],
};
