export default {
  id: 2,
  title: 'Apply Secure Configurations to All System Components',
  goal: 'Build and Maintain a Secure Network and Systems',
  intro:
    'Equipment and software usually arrive configured for convenience rather than safety, and the accounts and settings they ship with are a matter of public record. Requirement 2 is about replacing what the vendor chose with what the entity has decided, and doing it before the system carries live traffic.',
  questions: [
    {
      id: '2.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 2 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 2. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 2.',
        'Ask the personnel governed by them whether they are followed in practice and known to those affected.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 2 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 2 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.1',
      title: 'Configuration standards',
      question:
        'Has the organisation written hardening standards that reach every system component, close off each vulnerability it knows about, align with recognised industry hardening guidance or the vendor’s own recommendations, get revised as new vulnerabilities come to light, and are applied and checked as present by the time a component joins production — or immediately after?',
      requirement:
        'Hardening standards are written, applied and maintained. They extend to every system component; they deal with each security vulnerability known to the entity; they follow either recognised industry hardening guidance or the vendor’s hardening recommendations; they are revised as new vulnerabilities are identified, in the manner Requirement 6.3.1 sets out; and they are applied whenever a new system is built, with their presence confirmed either before the component is attached to a production environment or immediately afterwards.',
      testing: [
        'Read the hardening standards and measure them against recognised industry hardening guidance.',
        'Take a sample of system components, inspect how they are configured, and confirm the standards were actually applied.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.2',
      title: 'Vendor default accounts',
      question:
        'For every account a vendor ships with its product: where the account is kept in use, has its shipped password been replaced as Requirement 8.3.6 demands, and where it is not needed, has it been deleted or disabled?',
      requirement:
        'Accounts supplied by a vendor are handled one of two ways. Where such an account is to remain in use, its shipped password is replaced in line with Requirement 8.3.6. Where it is not to be used, the account is deleted or disabled.',
      testing: [
        'Read the hardening standards and confirm they say what is to happen to vendor-supplied accounts.',
        'Take a sample of system components and try signing in with the vendor’s shipped accounts and passwords.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.3',
      title: 'Primary functions with different security levels',
      question:
        'Where primary functions need different levels of protection, does each system component carry only one such function — or, if it carries several, are they kept isolated from one another, or is the whole component protected to the standard the most demanding function requires?',
      requirement:
        'Primary functions that call for different levels of protection are handled by one of three arrangements: a system component hosts only a single primary function; or several primary functions of differing protection levels share a component but are isolated from each other; or several such functions share a component and the whole of it is protected to the level demanded by the function with the greatest need.',
      testing: [
        'Read the hardening standards and confirm this point is covered.',
        'Inspect the system configurations and confirm primary functions are arranged in one of the permitted ways.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.4',
      title: 'Unnecessary functionality removed',
      question:
        'Is only what is needed switched on — services, protocols, daemons and functions alike — with everything unnecessary taken off the system or disabled?',
      requirement:
        'Only the services, protocols, daemons and functions that are needed are enabled. Anything unnecessary is either removed from the system or disabled.',
      testing: [
        'Read the hardening standards and confirm the needed services, protocols, daemons and functions are named and recorded.',
        'Inspect the system configurations and confirm nothing is present and running that the documentation does not account for.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.5',
      title: 'Insecure services, protocols or daemons',
      question:
        'Where an insecure service, protocol or daemon is present, is the business reason for keeping it recorded, and are extra security features both written down and actually in place to bring the resulting risk down?',
      requirement:
        'Where any insecure service, protocol or daemon is present, two things follow: the business reason for its presence is recorded; and additional security features that lower the risk of running it are both documented and implemented.',
      testing: [
        'Where such services, protocols or daemons exist, read the hardening standards and ask staff, to confirm the business reason is on record.',
        'Inspect the configuration and confirm the additional security features are in place.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no insecure services, protocols, or daemons are present on any in-scope system component.',
    },
    {
      id: '2.2.6',
      title: 'System security parameters',
      question:
        'Are the systems’ security parameters set so that they cannot readily be turned to the wrong purpose?',
      requirement:
        'Security parameters on systems are set in a way that forestalls misuse.',
      testing: [
        'Read the hardening standards and confirm the security parameter settings that matter are specified.',
        'Inspect the systems and confirm those parameters carry the specified values.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.2.7',
      title: 'Encrypted non-console administrative access',
      question:
        'Is every administrative session that does not take place at the machine’s own console carried over strong cryptography?',
      requirement:
        'Administrative access by any route other than the system’s own console is encrypted with strong cryptography.',
      testing: [
        'Watch an administrator sign in to a system component and confirm strong cryptography is in force before the point at which a password is asked for.',
        'Inspect the system configuration, including services and parameter files, and confirm insecure remote login methods cannot be used.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '2.3.1',
      title: 'Wireless vendor defaults',
      question:
        'In any wireless environment that touches the cardholder data environment or carries account data, has every security-relevant setting the vendor shipped been changed at installation, or else established to be safe — encryption keys, access point passwords and SNMP values included?',
      requirement:
        'For wireless environments that connect to the cardholder data environment or carry account data, every security-relevant vendor-shipped setting is either changed when the equipment is installed or established to be secure as shipped. This covers, without being limited to, the encryption keys a wireless product ships with, the passwords guarding its access points, its SNMP community values, and any other security-relevant setting supplied by the vendor.',
      testing: [
        'Read the policies and procedures, together with the vendor documentation for the wireless equipment in use.',
        'Inspect the settings on the wireless devices and confirm shipped passwords, encryption keys and SNMP community strings were changed or established to be safe.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no wireless environment is connected to the CDE and no wireless is used to transmit account data.',
    },
    {
      id: '2.3.2',
      title: 'Wireless encryption key changes',
      question:
        'In those same wireless environments, are encryption keys replaced when someone who knew a key leaves the company or moves out of the role that required knowing it, and whenever a key is thought or known to have been compromised?',
      requirement:
        'For wireless environments that connect to the cardholder data environment or carry account data, encryption keys are replaced on two occasions: when a person who knew the key departs the company, or leaves the role for which that knowledge was needed; and whenever a key is suspected of compromise or known to be compromised.',
      testing: [
        'Ask the responsible staff and read the key-management records to confirm keys are replaced on both occasions.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no wireless environment is connected to the CDE and no wireless is used to transmit account data.',
    },
  ],
};
