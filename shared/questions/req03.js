export default {
  id: 3,
  title: 'Protect Stored Account Data',
  goal: 'Protect Account Data',
  intro:
    'Encryption, truncation, masking and hashing are the techniques that make stored account data worthless to whoever obtains it. If someone gets past every other control and reaches the data, none of it is of use to them without the keys. Requirement 3 covers keeping as little as possible, rendering what is kept unreadable, and looking after the keys that do the rendering.',
  questions: [
    {
      id: '3.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 3 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 3. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 3.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 3 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 3 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.2.1',
      title: 'Data retention and disposal',
      question:
        'Do your retention and disposal arrangements hold stored account data to a minimum — reaching every place it sits, covering any sensitive authentication data held before authorisation finishes, capping how much is kept and for how long against what law, regulation or the business actually needs, stating a retention period for stored account data with a written reason for it, providing for secure deletion once the data is no longer needed, and checking at intervals no longer than three months that anything past its retention period really has gone?',
      requirement:
        'Stored account data is held to a minimum by retention and disposal policies, procedures and processes covering at least the following. They reach every location where account data is stored. They cover any sensitive authentication data held before authorisation has completed. They cap both the quantity kept and the time it is kept for at what legal or regulatory obligations, or the business itself, actually require. They state a retention period for stored account data and record a business reason for that period. They provide for securely deleting account data, or otherwise making it unrecoverable, once the retention policy no longer calls for keeping it. And they include a check, carried out at intervals no longer than three months, that stored account data which has outlived the retention period has indeed been securely deleted or made unrecoverable.',
      testing: [
        'Read the retention and disposal policies, procedures and processes.',
        'Inspect the files and system records and confirm nothing stored has outlived the retention period the entity set.',
        'Watch the deletion mechanism operate and confirm data goes securely.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.1',
      title: 'SAD not retained after authorization',
      question:
        'Once authorisation is finished, is sensitive authentication data gone — encrypted copies included — and is everything of that kind you received made unrecoverable at that point?',
      requirement:
        'Sensitive authentication data is not kept once authorisation has taken place, and encrypting it does not make keeping it permissible. Every item of such data the entity received is made unrecoverable at the point authorisation completes.',
      testing: [
        'Read the documented policies and procedures and inspect the system configuration to confirm none of this data survives authorisation.',
        'Take a sample of places data could hide — inbound transaction data, logs, history and trace files, database schemas and their contents — and confirm none of it is there.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.1.1',
      title: 'Full track data not retained',
      question:
        'Once authorisation is finished, is the complete content of the magnetic stripe or its chip equivalent no longer held?',
      requirement:
        'No track retains its complete contents once authorisation has completed.',
      testing: [
        'Inspect the places data is held and confirm no complete track content survives the end of authorisation.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.1.2',
      title: 'Card verification code not retained',
      question:
        'Once authorisation is finished, is the card verification code no longer held?',
      requirement:
        'The card verification code does not survive the completion of authorisation.',
      testing: [
        'Inspect the places data is held and confirm no card verification code survives the end of authorisation.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.1.3',
      title: 'PIN and PIN block not retained',
      question:
        'Once authorisation is finished, are the PIN and the PIN block no longer held?',
      requirement:
        'Neither the personal identification number nor the PIN block survives the completion of authorisation.',
      testing: [
        'Inspect the places data is held and confirm no PIN or PIN block survives the end of authorisation.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.3.2',
      title: 'SAD stored before authorization is encrypted',
      question:
        'Where sensitive authentication data sits electronically before authorisation has finished, is it encrypted with strong cryptography?',
      requirement:
        'Sensitive authentication data held electronically before authorisation completes is encrypted with strong cryptography.',
      testing: [
        'Inspect the data stores, the system configuration and the vendor documentation, and confirm every such item held electronically before authorisation completes is encrypted with strong cryptography.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no sensitive authentication data is stored electronically at any point prior to authorization.',
    },
    {
      id: '3.3.3',
      title: 'Issuer storage of SAD',
      question:
        'If you issue cards, or support issuing, and you hold sensitive authentication data: is what you hold confined to what a genuine issuing purpose requires, kept secure, and encrypted with strong cryptography?',
      requirement:
        'An extra obligation on issuers, and on companies supporting issuing services, that hold sensitive authentication data. Whatever is held is confined to what a legitimate issuing business purpose requires, and is kept secure; and it is encrypted with strong cryptography.',
      testing: [
        'Read the documented policies and inspect the data stores, confirming that what is held goes no further than a legitimate issuing purpose requires.',
        'Inspect the data stores and system configuration and confirm the data is encrypted with strong cryptography.',
      ],
      // Scoped by issuing activity, not by merchant or service provider status: an
      // entity that issues cards may be either. Marking this service-provider-only
      // hid it from the merchant edition entirely, so an issuing merchant had no
      // way to record it. Everyone is asked; a non-issuer marks it N/A.
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if your organization is not an issuer and does not support issuing services.',
    },
    {
      id: '3.4.1',
      title: 'PAN masking on display',
      question:
        'When a PAN appears on screen, is it masked so that at most the leading bank identification digits and the final four show — with anything beyond that visible only to people whose work genuinely requires it?',
      requirement:
        'A PAN shown on a display is masked, the most that may appear being the bank identification number together with the last four digits. Seeing more than that is confined to personnel with a genuine business need.',
      testing: [
        'Read the documented policies and procedures governing how a displayed PAN is masked.',
        'Inspect the system configuration and watch a PAN being displayed, confirming the masking behaves as described.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '3.4.2',
      title: 'Copy/relocation of PAN via remote access',
      question:
        'During a remote-access session, do technical controls stop anyone copying or moving a PAN off the system, except for the individuals holding explicit written authorisation and a stated, genuine business reason?',
      requirement:
        'Where remote-access technology is in use, technical controls prevent personnel from copying a PAN or relocating it. The exception is an individual holding documented, explicit authorisation together with a legitimate and stated business need.',
      testing: [
        'Read the documented policies and procedures and inspect how the remote-access technology is configured.',
        'Watch the process and ask staff, confirming that copying or moving a PAN is blocked for anyone lacking explicit authorisation.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no remote-access technology can be used to access systems that display or store PAN.',
    },
    {
      id: '3.5.1',
      title: 'PAN rendered unreadable in storage',
      question:
        'Wherever a PAN is stored, is it made unreadable — by a one-way hash over the whole PAN using strong cryptography, by truncation, by an index token, or by strong cryptography with the key management that goes with it?',
      requirement:
        'A stored PAN is made unreadable wherever it sits, by any of the following means. A one-way hash, computed with strong cryptography over the entire PAN. Truncation, noting that hashing may not be used to stand in for the truncated portion; and where an environment holds both a hashed and a truncated version of the same PAN, or two differently truncated versions of it, further controls exist so the versions cannot be matched up to rebuild the original. An index token. Or strong cryptography, together with the key-management processes and procedures that accompany it.',
      testing: [
        'Read the documentation on whatever renders the PAN unreadable, covering the vendor, the type of system or process, and the encryption algorithms involved.',
        'Inspect the data repositories and the audit logs, payment application logs among them, and confirm the PAN is unreadable.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if PAN is never stored electronically by your organization.',
    },
    {
      id: '3.5.1.1',
      title: 'Keyed cryptographic hashes',
      question:
        'Where hashing is what makes a stored PAN unreadable, is the hash a keyed one computed over the whole PAN, with key management meeting Requirements 3.6 and 3.7?',
      requirement:
        'Where hashing is the means of making a PAN unreadable, under the first of the options in Requirement 3.5.1, the hash is keyed and is computed over the entire PAN, and the accompanying key-management processes and procedures satisfy Requirements 3.6 and 3.7.',
      testing: [
        'Read the documentation on the hashing method and confirm the hash is keyed and spans the whole PAN.',
        'Read the key-management documentation and confirm the keys are handled as Requirements 3.6 and 3.7 demand.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if hashing is not used to render PAN unreadable.',
    },
    {
      id: '3.5.1.2',
      title: 'Disk-level encryption limitations',
      question:
        'Where whole-disk or partition encryption is what makes a PAN unreadable, is it confined to removable media — or, if used on fixed media, is the PAN additionally made unreadable by one of the other means Requirement 3.5.1 allows?',
      requirement:
        'Where encryption at the disk or partition level, as opposed to encryption at the file, column or database field level, is what renders a PAN unreadable, it is used in only one of two ways: on removable electronic media; or, if on non-removable electronic media, with the PAN additionally rendered unreadable by some other mechanism satisfying Requirement 3.5.1.',
      testing: [
        'Inspect the encryption arrangements and the system configuration, and confirm disk or partition encryption is used only in one of those two ways.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if disk-level or partition-level encryption is not used to render PAN unreadable.',
    },
    {
      id: '3.5.1.3',
      title: 'Disk-level encryption access management',
      question:
        'Where whole-disk or partition encryption is in use, is logical access to it handled separately from the operating system’s own sign-in and access controls, and are the decryption keys kept unconnected to user accounts?',
      requirement:
        'Where encryption at the disk or partition level, rather than at the file, column or database field level, renders a PAN unreadable, it is handled as follows: logical access to it is administered separately and independently from the operating system’s own authentication and access control; and the decryption keys bear no association with user accounts.',
      testing: [
        'Inspect the system configuration and watch the authentication happen, confirming logical access is administered independently of the operating system’s own sign-in.',
        'Read the key-management procedures and confirm no decryption key is tied to a user account.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if disk-level or partition-level encryption is not used to render PAN unreadable.',
    },
    {
      id: '3.6.1',
      title: 'Protection of cryptographic keys',
      question:
        'Are there procedures, actually in force, that shield the keys protecting stored account data from being disclosed or misused?',
      requirement:
        'Procedures exist and are in force that protect the cryptographic keys guarding stored account data against disclosure and against misuse. They include: confining access to the keys to as few custodians as the work allows; ensuring no key-encrypting key is weaker than the data-encrypting key beneath it; holding key-encrypting keys somewhere other than the data-encrypting keys; and keeping keys securely, in as few places and as few forms as possible.',
      testing: [
        'Read the documented key-management policies and procedures.',
        'Ask the responsible staff to confirm those procedures are actually carried out.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.6.1.1',
      title: 'Documented cryptographic architecture',
      question:
        'Do you keep a written account of your cryptographic architecture — every algorithm, protocol and key used to protect stored account data with its strength and expiry, the bar on reusing production keys in test, what each key is for, and an inventory of the secure cryptographic devices doing the key management — hardware security modules and key management systems among them — recording each one’s type and where it sits?',
      requirement:
        'An extra obligation on service providers. A written account of the cryptographic architecture is maintained, setting out: every algorithm, protocol and key used to protect stored account data, together with each key’s strength and expiry date; the measures that stop a key used in production being reused in a test environment; what each key is used for; and an inventory of every secure cryptographic device employed in key management, hardware security modules and key management systems included, recording each device’s type and where it is located.',
      testing: [
        'Read the documentation and confirm an account of the cryptographic architecture exists and covers each of those points.',
        'Ask the responsible staff to confirm it is maintained and current.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.6.1.2',
      title: 'Storage form of secret and private keys',
      question:
        'Are the secret and private keys protecting stored account data always held in at least one of these forms: encrypted under a key-encrypting key that is no weaker than the data key and kept elsewhere; inside a secure cryptographic device such as a hardware security module or a PTS-approved terminal; or split into two or more full-length components or shares by a recognised industry method?',
      requirement:
        'The secret and private keys protecting stored account data are, at every moment, held in at least one of three forms. Encrypted beneath a key-encrypting key that is no weaker than the data-encrypting key and that lives somewhere other than the data-encrypting key. Inside a secure cryptographic device, such as a hardware security module or a PTS-approved point-of-interaction device. Or split, by a method the industry recognises, into two or more components or shares, each of them full length.',
      testing: [
        'Read the documented key-management procedures and confirm keys are held in one of those forms.',
        'Inspect the system configuration and the places keys are kept, confirming each is held in a permitted form.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.6.1.3',
      title: 'Restricting access to cleartext key components',
      question:
        'Is the number of custodians who can reach a cleartext key component held to the fewest the work allows?',
      requirement:
        'Reaching a cryptographic key component in cleartext is confined to as few custodians as the work allows.',
      testing: [
        'Read the access lists and the key-custodian records, confirming that reaching a cleartext key component is confined to as few custodians as the work allows.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.6.1.4',
      title: 'Key storage locations',
      question:
        'Are cryptographic keys kept in as few places as possible?',
      requirement:
        'Cryptographic keys reside in as few places as can be managed.',
      testing: [
        'Read the key-management documentation and inspect where keys are kept, confirming the number of places is as small as can be managed.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.1',
      title: 'Generation of strong keys',
      question:
        'Do your key-management arrangements cover how strong keys are generated for protecting stored account data?',
      requirement:
        'The key-management policies and procedures in force address the generation of strong cryptographic keys for protecting stored account data.',
      testing: [
        'Read the key-management policies and procedures covering the keys that protect stored account data.',
        'Watch keys being generated and confirm the result is strong.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.2',
      title: 'Secure key distribution',
      question:
        'Do your key-management arrangements cover distributing those keys securely?',
      requirement:
        'The key-management policies and procedures in force address distributing securely the cryptographic keys that protect stored account data.',
      testing: [
        'Read the documented key-management policies and procedures.',
        'Watch keys being distributed and confirm the method is secure.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.3',
      title: 'Secure key storage',
      question:
        'Do your key-management arrangements cover storing those keys securely?',
      requirement:
        'The key-management policies and procedures in force address storing securely the cryptographic keys that protect stored account data.',
      testing: [
        'Read the documented key-management policies and procedures.',
        'Watch how keys are put into storage and confirm the method is secure.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.4',
      title: 'Key changes at cryptoperiod end',
      question:
        'Do your key-management arrangements provide for replacing a key once its cryptoperiod runs out — with a cryptoperiod set for every type of key you use, and a process for making the change, following what the application vendor or key owner specifies and what industry guidance recommends?',
      requirement:
        'Key-management policies and procedures are in force for changing a cryptographic key whose cryptoperiod has run out, the cryptoperiod being the one set by the relevant application vendor or key owner and informed by industry good practice and guidance. They include a stated cryptoperiod for every type of key in use, and a process by which a key is changed once that cryptoperiod ends.',
      testing: [
        'Read the documented key-management policies and procedures and confirm a cryptoperiod is stated for each type of key.',
        'Ask staff and read the records, confirming keys are in fact changed when the stated cryptoperiod ends.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.5',
      title: 'Key retirement, replacement and destruction',
      question:
        'Do your arrangements provide for retiring, replacing or destroying a key when its cryptoperiod ends, when its integrity has been weakened — including when somebody who knew a cleartext component leaves the company or that role — or when it is thought or known to be compromised; and where a retired key is kept, is it used only to decrypt or verify, never to encrypt?',
      requirement:
        'Key-management policies and procedures are in force for retiring, replacing or destroying a key that protects stored account data, applied whenever it is judged necessary and in particular when: the key’s stated cryptoperiod has ended; the key’s integrity has been weakened, which includes the departure of a person who knew a cleartext key component, whether from the company or from the role in which they knew it; or the key is suspected of compromise or known to be compromised. Where a retired or replaced key is kept rather than destroyed, it is never used to encrypt anything.',
      testing: [
        'Read the documented key-management policies and procedures.',
        'Ask staff to confirm that retirement, replacement and destruction of keys actually happen as described.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.6',
      title: 'Split knowledge and dual control',
      question:
        'Where people handle cleartext keys by hand, do your arrangements require split knowledge and dual control over those operations?',
      requirement:
        'Where personnel carry out cryptographic key-management operations on cleartext keys by hand, the key-management policies and procedures in force require those operations to be conducted under split knowledge and dual control.',
      testing: [
        'Read the documented key-management policies and procedures.',
        'Ask staff, or watch the process, to confirm that a manual cleartext key operation cannot proceed without split knowledge and dual control.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if no manual cleartext cryptographic key-management operations are performed.',
    },
    {
      id: '3.7.7',
      title: 'Prevention of unauthorized key substitution',
      question:
        'Do your key-management arrangements stop a cryptographic key being swapped for another without authorisation?',
      requirement:
        'The key-management policies and procedures in force guard against a cryptographic key being substituted without authorisation.',
      testing: [
        'Read the documented key-management policies and procedures.',
        'Ask staff to confirm the arrangements do prevent an unauthorised key swap.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.8',
      title: 'Key custodian acknowledgements',
      question:
        'Do your key-management arrangements require each key custodian to confirm formally, on paper or electronically, that they understand and accept what being a custodian entails?',
      requirement:
        'The key-management policies and procedures in force require every cryptographic key custodian to give formal acknowledgement, in writing or electronically, that they understand the responsibilities of a key custodian and accept them.',
      testing: [
        'Read the documented key-management policies and procedures.',
        'Read the acknowledgements the custodians have given, or other evidence that they gave them.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if cryptography is not used to protect stored account data.',
    },
    {
      id: '3.7.9',
      title: 'Key guidance shared with customers',
      question:
        'Where you share cryptographic keys with customers so they can transmit or store account data, have you written guidance on transmitting, storing and updating those keys securely, and have you issued it to them?',
      requirement:
        'An extra obligation on service providers. Where a provider gives its customers cryptographic keys to transmit or store account data with, written guidance on transmitting, storing and updating those keys securely exists and has been issued to those customers.',
      testing: [
        'Read the documentation and confirm guidance on secure transmission, storage and updating of the keys has been written.',
        'Ask staff and read the records, confirming the guidance reached the customers.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if cryptographic keys are not shared with customers.',
    },
  ],
};
