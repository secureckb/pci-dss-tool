export default {
  id: 7,
  title: 'Restrict Access to System Components and Cardholder Data by Business Need to Know',
  goal: 'Implement Strong Access Control Measures',
  intro:
    'When access rules are vague or too generous, people end up able to reach data and systems their work never required. Requirement 7 is about deciding who needs what, granting only that, and checking periodically that the grants still match the jobs.',
  questions: [
    {
      id: '7.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 7 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 7. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 7.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 7 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 7 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.1',
      title: 'Access control model',
      question:
        'Have you defined an access control model that grants access according to what your business actually needs, ties access to system components and data to the user’s job classification and duties, and hands out no more privilege than the job calls for?',
      requirement:
        'An access control model is defined. Under it, access is granted in keeping with the entity’s business and access needs; reaching system components and data resources depends on the user’s job classification and duties; and the privilege granted is the smallest that lets the job be done — an ordinary user account rather than an administrative one, where that suffices.',
      testing: [
        'Read the documented policies and procedures and ask staff, to confirm the access control model is defined.',
        'Inspect the settings that implement the model and confirm access needs are defined sensibly.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.2',
      title: 'Least privilege assignment',
      question:
        'Is every user’s access — privileged users included — decided by their job classification and duties, and held to the minimum those duties require?',
      requirement:
        'Access granted to users, privileged users among them, is decided on two bases: the user’s job classification and duties; and the smallest set of privileges those duties require.',
      testing: [
        'Read the policies and procedures and confirm they address granting access on job classification, duties and minimum privilege.',
        'Inspect the access granted to users, privileged users included, and set it against their job classifications and duties.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.3',
      title: 'Approval of privileges',
      question:
        'Does someone with the authority to do so sign off on the privileges a user is given?',
      requirement:
        'Privileges a user requires are approved by personnel authorised to approve them.',
      testing: [
        'Take a sample of user IDs holding privileges and read the recorded approvals for them.',
        'Set those approvals against the privileges actually in force and confirm the two agree.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.4',
      title: 'Six-monthly user access reviews',
      question:
        'Are all user accounts and their privileges — third-party and vendor accounts included — reviewed at intervals no longer than six months to establish that each still suits the holder’s job, with anything unsuitable put right and management confirming the remainder is still appropriate?',
      requirement:
        'Every user account and the privileges attached to it, including accounts held by third parties and vendors, is reviewed at intervals no longer than six months. The review establishes whether the account and its access still suit the holder’s job. Access found to be unsuitable is dealt with, and management confirms that what remains is appropriate.',
      testing: [
        'Read the documented policies and procedures and confirm a review process is defined with an interval of no more than six months.',
        'Read the records of the reviews and ask staff, to confirm they happened at that interval and that unsuitable access was dealt with.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.5',
      title: 'Application and system account privileges',
      question:
        'Are application and system accounts granted no more privilege than the system or application needs to run, and is each one confined to the systems, applications or processes that actually require it?',
      requirement:
        'Application and system accounts, and the privileges attached to them, are granted and managed on two bases: the smallest privilege that lets the system or application operate; and confinement to those systems, applications or processes that specifically need the account.',
      testing: [
        'Read the policies and procedures and confirm they lay down how accounts of this kind are to be managed.',
        'Inspect the privileges these accounts hold and ask staff, to confirm minimum privilege is being applied.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.5.1',
      title: 'Periodic review of application/system account access',
      question:
        'Is the access held by application and system accounts reviewed on a recurring basis — at the interval your targeted risk analysis sets under Requirement 12.3.1 — to establish that it still fits the function being served, with anything unsuitable put right and management confirming the remainder?',
      requirement:
        'Access held by application and system accounts, and the privileges attached, is reviewed on a recurring basis at an interval set by the entity’s targeted risk analysis, carried out against every element Requirement 12.3.1 specifies. The review establishes that the access still fits the function being performed. Unsuitable access is dealt with, and management confirms that what remains is appropriate.',
      testing: [
        'Read the targeted risk analysis that sets the review interval.',
        'Read the review records and ask staff, to confirm reviews happened at that interval.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.2.6',
      title: 'Access to cardholder data repositories',
      question:
        'Can users only query stored cardholder data through an application or similar programmatic route, with what they may see and do governed by their role and held to minimum privilege — and is querying the store directly confined to the administrators responsible for it?',
      requirement:
        'User access to query stores of cardholder data is confined in two ways. It happens through applications or other programmatic means, with the access granted and the actions permitted governed by the user’s role and held to minimum privilege. And direct access to, or direct querying of, those stores is available only to the administrators responsible for them.',
      testing: [
        'Read the policies and procedures and inspect the configuration to confirm querying of cardholder data stores by users is confined as described.',
        'Ask staff to confirm that direct access to, or querying of, the stores is available only to the responsible administrators.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if your organization does not store cardholder data in any queryable repository.',
    },
    {
      id: '7.3.1',
      title: 'Access control system in place',
      question:
        'Is there an access control system that limits access by what each user needs to know, and does it reach every system component?',
      requirement:
        'An access control system is deployed that limits access according to each user’s need to know, and its reach extends to every system component.',
      testing: [
        'Read the vendor documentation and inspect the settings to confirm such a system is deployed on every system component.',
        'Inspect its configuration and confirm access is limited by need to know.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.3.2',
      title: 'Enforcement of assigned permissions',
      question:
        'Is the access control system configured so that it actually enforces the permissions granted to people, applications and systems on the basis of job classification and duties?',
      requirement:
        'The access control system is configured to enforce the permissions granted to individuals, applications and systems, those permissions having been set according to job classification and duties.',
      testing: [
        'Inspect the access control system configuration and confirm granted permissions are enforced as granted.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '7.3.3',
      title: 'Deny all by default',
      question:
        'Does the access control system refuse by default, so that anything not expressly permitted is denied?',
      requirement:
        'The access control system’s default position is refusal: what has not been expressly permitted is denied.',
      testing: [
        'Read the vendor documentation and inspect the settings to confirm the system’s default position is refusal.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
  ],
};
