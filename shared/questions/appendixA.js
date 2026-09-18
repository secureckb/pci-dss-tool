export const appendixA1 = {
  id: 'A1',
  title: 'Appendix A1: Additional PCI DSS Requirements for Multi-Tenant Service Providers',
  goal: 'Additional PCI DSS Requirements',
  intro:
    'This appendix applies to multi-tenant service providers — providers that offer various shared services to merchants and other service providers, where customers share system resources such as physical or virtual servers, infrastructure and applications.',
  questions: [
    {
      id: 'A1.1.1',
      title: 'Logical separation between provider and customers',
      question:
        'Is logical separation implemented such that the provider cannot access its customers’ environments without authorization, and customers cannot access the provider’s environment without authorization?',
      requirement:
        'Logical separation is implemented as follows: the provider cannot access its customers’ environments without authorization; customers cannot access the provider’s environment without authorization.',
      testing: [
        'Examine documentation and system configurations to verify logical separation is implemented between the provider and customer environments.',
        'Examine authorization records for any provider access to customer environments.',
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
        'Are controls implemented such that each customer only has permission to access its own cardholder data and CDE?',
      requirement:
        'Controls are implemented such that each customer only has permission to access its own cardholder data and CDE.',
      testing: [
        'Examine documentation and system configurations to verify that controls restrict each customer to its own cardholder data and CDE.',
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
        'Are controls implemented such that each customer can only access resources allocated to them?',
      requirement:
        'Controls are implemented such that each customer can only access resources allocated to them.',
      testing: [
        'Examine system configurations and access controls to verify that customers can only access resources allocated to them.',
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
        'Is the effectiveness of logical separation controls used to separate customer environments confirmed at least once every six months via penetration testing?',
      requirement:
        'The effectiveness of logical separation controls used to separate customer environments is confirmed at least once every six months via penetration testing.',
      testing: [
        'Examine the results of the most recent penetration tests to verify that testing confirmed the effectiveness of logical separation controls at least once every six months.',
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
        'Is audit log capability enabled for each customer’s environment that is consistent with PCI DSS Requirement 10, including logs relevant to each customer’s environment and log capability for each customer’s CDE?',
      requirement:
        'Audit log capability is enabled for each customer’s environment that is consistent with PCI DSS Requirement 10, including: logs are enabled for common third-party applications; logs are active by default; logs are available for review only by the owning customer; log locations are clearly communicated to the owning customer; log data and availability is consistent with PCI DSS Requirement 10.',
      testing: [
        'Examine documentation and system configurations to verify that audit log capability is enabled for each customer’s environment.',
        'Interview personnel and examine logs to verify logs are available only to the owning customer.',
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
        'Are processes or mechanisms implemented to support and/or facilitate prompt forensic investigations in the event of a suspected or confirmed security incident for any customer?',
      requirement:
        'Processes or mechanisms are implemented to support and/or facilitate prompt forensic investigations in the event of a suspected or confirmed security incident for any customer.',
      testing: [
        'Examine documented procedures to verify that processes are defined to support prompt forensic investigations for any customer.',
        'Interview personnel to verify the processes are implemented.',
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
        'Are processes or mechanisms implemented for reporting and addressing suspected or confirmed security incidents and vulnerabilities, including that customers can report suspected or confirmed security incidents and vulnerabilities, and that your organization addresses and remediates them?',
      requirement:
        'Processes or mechanisms are implemented for reporting and addressing suspected or confirmed security incidents and vulnerabilities, including: customers can securely report security incidents and vulnerabilities to the provider; the provider addresses and remediates suspected or confirmed security incidents and vulnerabilities according to Requirement 6.3.1.',
      testing: [
        'Examine documented procedures to verify that processes are defined for customers to report incidents and vulnerabilities.',
        'Examine records of reported incidents and vulnerabilities to verify they are addressed and remediated.',
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
    'This appendix applies only to entities using SSL/early TLS as a security control to protect POS POI terminal connections, including service providers that provide connection points to such terminals. If you do not use SSL or early TLS for these connections, mark each requirement here Not Applicable and say so in the justification.',
  questions: [
    {
      id: 'A2.1.1',
      title: 'POI terminals not susceptible to known exploits',
      question:
        'Where POS POI terminals at the merchant or payment acceptance location use SSL and/or early TLS, does your organization confirm the devices are not susceptible to any known exploits for those protocols?',
      requirement:
        'Where POS POI terminals at the merchant or payment acceptance location use SSL and/or early TLS, the entity confirms the devices are not susceptible to any known exploits for those protocols.',
      testing: [
        'Examine documentation and interview personnel to verify that the POS POI terminals and the termination points are confirmed as not being susceptible to any known exploits for SSL/early TLS.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A if your organization does not use SSL or early TLS for any POS POI terminal connection.',
    },
    {
      id: 'A2.1.2',
      title: 'Risk mitigation and migration plan (service providers)',
      question:
        'Does your organization, as a service provider with existing connection points to POS POI terminals that use SSL and/or early TLS, have a formal Risk Mitigation and Migration Plan in place that includes a description of usage, risk-assessment results, a description of monitoring for new vulnerabilities, a description of change control processes, an overview of the migration project plan, and a target date for migration completion no later than the date required by the applicable payment brand?',
      requirement:
        'Additional requirement for service providers only: All service providers with existing connection points to POS POI terminals that use SSL and/or early TLS have a formal Risk Mitigation and Migration Plan in place that includes: description of usage, including what data is being transmitted, types and number of systems that use and/or support SSL/early TLS, and type of environment; risk-assessment results and risk-reduction controls in place; description of processes to monitor for new vulnerabilities associated with SSL/early TLS; description of change control processes that are implemented to ensure SSL/early TLS is not implemented into new environments; overview of migration project plan including target migration completion date no later than the date required by the applicable payment brand.',
      testing: [
        'Examine the documented Risk Mitigation and Migration Plan to verify it includes all required elements.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition: 'Mark N/A if your organization has no connection points to POS POI terminals that use SSL or early TLS.',
    },
    {
      id: 'A2.1.3',
      title: 'Secure service offering (service providers)',
      question:
        'Does your organization, as a service provider, offer a secure protocol option for its service?',
      requirement:
        'Additional requirement for service providers only: All service providers provide a secure service offering.',
      testing: [
        'Examine system configurations and supporting documentation to verify that the service provider offers a secure protocol option for its service.',
      ],
      appliesTo: 'service-provider',
      allowNA: true,
      condition:
        'Mark N/A if your organization does not use SSL or early TLS for any POS POI terminal connection. Appendix A2 applies only to entities that do.',
    },
  ],
};

export default [appendixA1, appendixA2];
