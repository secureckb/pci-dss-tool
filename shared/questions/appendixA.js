export const appendixA1 = {
  id: 'A1',
  title: 'Appendix A1: Additional PCI DSS Requirements for Multi-Tenant Service Providers',
  goal: 'Additional PCI DSS Requirements',
  intro:
    'These requirements bind providers whose customers share the same underlying resources — the same physical or virtual servers, the same infrastructure, the same applications — while serving merchants and other providers from them. The concern throughout is keeping one tenant out of another tenant’s environment.',
  questions: [
    {
      id: 'A1.1.1',
      title: 'Logical separation between provider and customers',
      question:
        'Is logical separation in place such that the provider cannot get into a customer’s environment without authorisation, and no customer can get into the provider’s environment without authorisation?',
      requirement:
        'Logical separation is in place, working in both directions: the provider cannot reach a customer’s environment without authorisation, and a customer cannot reach the provider’s environment without authorisation.',
      testing: [
        'Read the documentation and inspect the system configuration, confirming logical separation stands between the provider’s environment and the customers’.',
        'Read the authorisation records covering any occasion on which the provider entered a customer environment.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition:
        'Mark N/A if your organization is not a multi-tenant service provider — that is, if customers do not share your system resources such as physical or virtual servers, infrastructure, or applications. Appendix A1 applies only to multi-tenant providers.',
    },
    {
      id: 'A1.1.2',
      title: 'Customer access limited to own data',
      question:
        'Do the controls confine each customer to its own cardholder data and its own cardholder data environment?',
      requirement:
        'Controls are in place that permit a customer to reach only its own cardholder data and its own cardholder data environment.',
      testing: [
        'Read the documentation and inspect the system configuration, confirming no customer can reach data or an environment belonging to another.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition:
        'Mark N/A if your organization is not a multi-tenant service provider — that is, if customers do not share your system resources such as physical or virtual servers, infrastructure, or applications. Appendix A1 applies only to multi-tenant providers.',
    },
    {
      id: 'A1.1.3',
      title: 'Customer access limited to allocated resources',
      question:
        'Do the controls confine each customer to the resources allotted to it?',
      requirement:
        'Controls are in place that permit a customer to reach only those resources allotted to it.',
      testing: [
        'Inspect the system configuration and the access controls, confirming a customer can reach only the resources allotted to it.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition:
        'Mark N/A if your organization is not a multi-tenant service provider — that is, if customers do not share your system resources such as physical or virtual servers, infrastructure, or applications. Appendix A1 applies only to multi-tenant providers.',
    },
    {
      id: 'A1.1.4',
      title: 'Penetration testing of logical separation',
      question:
        'Is the logical separation between customer environments proved to be working, by penetration testing, at intervals no longer than six months?',
      requirement:
        'Penetration testing establishes, at intervals no longer than six months, that the logical separation controls keeping customer environments apart are working.',
      testing: [
        'Read the latest penetration test output, confirming it established that the separation controls work, and that such testing happens at least every six months.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition:
        'Mark N/A if your organization is not a multi-tenant service provider — that is, if customers do not share your system resources such as physical or virtual servers, infrastructure, or applications. Appendix A1 applies only to multi-tenant providers.',
    },
    {
      id: 'A1.2.1',
      title: 'Per-customer audit log capability',
      question:
        'Does each customer’s environment have audit logging of the kind Requirement 10 calls for — logging switched on for the common third-party applications, active without anyone having to turn it on, readable only by the customer it belongs to, its whereabouts made plain to that customer, and the data and its availability matching what Requirement 10 asks?',
      requirement:
        'Each customer’s environment has an audit logging capability consistent with PCI DSS Requirement 10. That means: logging is switched on for the common third-party applications; logging is active by default, without anyone having to enable it; the resulting logs may be read only by the customer they belong to; where those logs reside is made plain to that customer; and both the log data and its availability are consistent with what Requirement 10 asks.',
      testing: [
        'Read the documentation and inspect the system configuration, confirming each customer environment has this logging capability.',
        'Ask staff and inspect the logs, confirming a customer’s logs are readable only by that customer.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition:
        'Mark N/A if your organization is not a multi-tenant service provider — that is, if customers do not share your system resources such as physical or virtual servers, infrastructure, or applications. Appendix A1 applies only to multi-tenant providers.',
    },
    {
      id: 'A1.2.2',
      title: 'Support for forensic investigations',
      question:
        'Are there processes or mechanisms that let a forensic investigation get under way quickly when an incident is suspected or confirmed for any of your customers?',
      requirement:
        'Processes or mechanisms are in place that support a prompt forensic investigation, or make one easier, where a security incident is suspected or confirmed for any customer.',
      testing: [
        'Read the documented procedures and confirm they provide for supporting a prompt forensic investigation on behalf of any customer.',
        'Ask staff to confirm those processes are actually in place.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition:
        'Mark N/A if your organization is not a multi-tenant service provider — that is, if customers do not share your system resources such as physical or virtual servers, infrastructure, or applications. Appendix A1 applies only to multi-tenant providers.',
    },
    {
      id: 'A1.2.3',
      title: 'Customer incident and vulnerability reporting',
      question:
        'Is there a way for a customer to report a suspected or confirmed incident, or a vulnerability, to you securely — and do you then deal with it and put it right?',
      requirement:
        'Processes or mechanisms exist for the reporting and handling of suspected or confirmed security incidents and vulnerabilities. Under them, a customer can report such a matter to the provider securely; and the provider deals with it and remediates it in the manner Requirement 6.3.1 provides.',
      testing: [
        'Read the documented procedures and confirm a route exists for customers to report incidents and vulnerabilities.',
        'Read the records of what customers have reported, confirming each was dealt with and remediated.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition:
        'Mark N/A if your organization is not a multi-tenant service provider — that is, if customers do not share your system resources such as physical or virtual servers, infrastructure, or applications. Appendix A1 applies only to multi-tenant providers.',
    },
  ],
};

export const appendixA2 = {
  id: 'A2',
  title: 'Appendix A2: Additional PCI DSS Requirements for Entities Using SSL/Early TLS for Card-Present POS POI Terminal Connections',
  goal: 'Additional PCI DSS Requirements',
  intro:
    'These requirements bind only those entities still relying on SSL or an early version of TLS to protect connections to card-present terminals, including providers that supply the connection points for such terminals. If none of your terminal connections rely on those protocols, mark each requirement here Not Applicable and say so in the justification.',
  questions: [
    {
      id: 'A2.1.1',
      title: 'POI terminals not susceptible to known exploits',
      question:
        'Where terminals at the merchant or acceptance location rely on SSL or an early version of TLS, have you established that those devices are not open to any of the known exploits against those protocols?',
      requirement:
        'Where a terminal sited at a merchant, or anywhere else payment is taken, relies on SSL or an early version of TLS, the entity has established that the device is not open to any known exploit against those protocols.',
      testing: [
        'Read the documentation and ask staff, confirming both the terminals and the points where their connections terminate have been established as not open to any known exploit against those protocols.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if your organization does not use SSL or early TLS for any POS POI terminal connection.',
    },
    {
      id: 'A2.1.2',
      title: 'Risk mitigation and migration plan (service providers)',
      question:
        'As a provider with connection points to terminals relying on SSL or early TLS, do you hold a formal risk mitigation and migration plan — describing how the protocols are used, the results of your risk assessment, how you watch for new vulnerabilities, the change controls keeping those protocols out of new environments, and the migration project with a completion date no later than the applicable payment brand requires?',
      requirement:
        'An extra obligation on service providers. Every provider holding connection points to terminals that rely on SSL or an early version of TLS keeps a formal risk mitigation and migration plan, comprising: a description of how the protocols are used, covering what data travels over them, the kinds and number of systems using or supporting them, and the kind of environment involved; the findings of the risk assessment and the risk-reduction controls in place; a description of how the entity watches for newly published vulnerabilities in those protocols; a description of the change controls in place to keep those protocols out of newly built environments; and an outline of the migration project, carrying a target completion date no later than the date the applicable payment brand requires.',
      testing: [
        'Read the documented risk mitigation and migration plan and confirm each of those elements appears.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if your organization has no connection points to POS POI terminals that use SSL or early TLS.',
    },
    {
      id: 'A2.1.3',
      title: 'Secure service offering (service providers)',
      question:
        'As a provider, do you make a secure protocol available as an option for your service?',
      requirement:
        'An extra obligation on service providers. Every provider makes a secure offering available for its service.',
      testing: [
        'Inspect the system configuration and the supporting documentation, confirming the provider makes a secure protocol option available for its service.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition:
        'Mark N/A if your organization does not use SSL or early TLS for any POS POI terminal connection. Appendix A2 applies only to entities that do.',
    },
  ],
};

export default [appendixA1, appendixA2];
