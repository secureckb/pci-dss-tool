export default {
  id: 1,
  title: 'Install and Maintain Network Security Controls',
  goal: 'Build and Maintain a Secure Network and Systems',
  intro:
    'Network security controls (NSCs), such as firewalls and other network security technologies, are network policy enforcement points that typically control network traffic between two or more logical or physical network segments.',
  questions: [
    {
      id: '1.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are all security policies and operational procedures identified in Requirement 1 documented, kept up to date, in use, and known to all affected parties?',
      requirement:
        'All security policies and operational procedures that are identified in Requirement 1 are: documented, kept up to date, in use, and known to all affected parties.',
      testing: [
        'Examine the documented policies and procedures for Requirement 1.',
        'Interview personnel to verify the policies and procedures are in use and known to all affected parties.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.1.2',
      title: 'Roles and responsibilities',
      question:
        'Are roles and responsibilities for performing activities in Requirement 1 documented, assigned, and understood?',
      requirement:
        'Roles and responsibilities for performing activities in Requirement 1 are documented, assigned, and understood.',
      testing: [
        'Examine documentation to verify that descriptions of roles and responsibilities are documented and assigned.',
        'Interview responsible personnel to verify that roles and responsibilities are understood.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.1',
      title: 'NSC configuration standards',
      question:
        'Are configuration standards for NSC rulesets defined, implemented, and maintained?',
      requirement:
        'Configuration standards for NSC rulesets are: defined, implemented, and maintained.',
      testing: [
        'Examine the configuration standards for NSC rulesets.',
        'Examine configuration settings for NSC rulesets to verify that rulesets are implemented according to the configuration standards.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.2',
      title: 'Change control for network connections',
      question:
        'Are all changes to network connections and to configurations of NSCs approved and managed in accordance with the change control process defined at Requirement 6.5.1?',
      requirement:
        'All changes to network connections and to configurations of NSCs are approved and managed in accordance with the change control process defined at Requirement 6.5.1.',
      testing: [
        'Examine documented procedures and network configuration settings.',
        'Examine network configuration change records and interview responsible personnel.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.3',
      title: 'Network diagram',
      question:
        'Is an accurate network diagram(s) maintained that shows all connections between the CDE and other networks, including any wireless networks, and is it kept current upon changes to the environment?',
      requirement:
        'An accurate network diagram(s) is maintained that shows all connections between the CDE and other networks, including any wireless networks, and is updated as needed upon changes to the environment.',
      testing: [
        'Examine the diagram(s) and network configurations to verify that an accurate network diagram(s) exists.',
        'Interview responsible personnel to verify the diagram is kept current.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.4',
      title: 'Data-flow diagram',
      question:
        'Is an accurate data-flow diagram(s) maintained that shows all account data flows across systems and networks, and updated as needed upon changes to the environment?',
      requirement:
        'An accurate data-flow diagram(s) is maintained that meets the following: shows all account data flows across systems and networks; updated as needed upon changes to the environment.',
      testing: [
        'Examine data-flow diagram(s) and interview personnel to verify the diagram shows all account data flows.',
        'Examine documentation and interview responsible personnel to verify the diagram is current.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.5',
      title: 'Services, protocols and ports inventory',
      question:
        'Are all services, protocols, and ports allowed identified, approved, and do they have a defined business need?',
      requirement:
        'All services, protocols, and ports allowed are identified, approved, and have a defined business need.',
      testing: [
        'Examine documentation to verify a list exists of all allowed services, protocols, and ports, including business justification and approval for each.',
        'Examine NSC configuration settings to verify only approved services, protocols, and ports are in use.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.6',
      title: 'Security features for insecure services',
      question:
        'Are security features defined and implemented for all services, protocols, and ports that are in use and considered to be insecure, such that the risk is mitigated?',
      requirement:
        'Security features are defined and implemented for all services, protocols, and ports that are in use and considered to be insecure, such that the risk is mitigated.',
      testing: [
        'Examine documentation that identifies all insecure services, protocols, and ports in use, and the security features implemented for each.',
        'Examine configuration settings to verify that security features are implemented for each identified insecure service, protocol, and port.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no insecure services, protocols, or ports are in use anywhere in scope.',
    },
    {
      id: '1.2.7',
      title: 'Six-monthly NSC configuration review',
      question:
        'Are configurations of NSCs reviewed at least once every six months to confirm they are relevant and effective?',
      requirement:
        'Configurations of NSCs are reviewed at least once every six months to confirm they are relevant and effective.',
      testing: [
        'Examine documentation to verify procedures are defined for reviewing NSC configurations at least once every six months.',
        'Examine documentation of reviews and interview responsible personnel to verify reviews occur at the required frequency.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.8',
      title: 'Securing NSC configuration files',
      question:
        'Are configuration files for NSCs secured from unauthorized access and kept consistent with active network configurations?',
      requirement:
        'Configuration files for NSCs are: secured from unauthorized access; kept consistent with active network configurations.',
      testing: [
        'Examine NSC configuration files and interview personnel to verify the files are secured from unauthorized access.',
        'Compare configuration files with active network configurations to verify they are consistent.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.3.1',
      title: 'Inbound traffic to the CDE',
      question:
        'Is inbound traffic to the CDE restricted to only traffic that is necessary, with all other traffic specifically denied?',
      requirement:
        'Inbound traffic to the CDE is restricted to: only traffic that is necessary; all other traffic is specifically denied.',
      testing: [
        'Examine configuration standards for NSCs to verify they define restricting inbound traffic to the CDE.',
        'Examine NSC configurations to verify inbound traffic is restricted as specified and all other traffic is denied.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.3.2',
      title: 'Outbound traffic from the CDE',
      question:
        'Is outbound traffic from the CDE restricted to only traffic that is necessary, with all other traffic specifically denied?',
      requirement:
        'Outbound traffic from the CDE is restricted to: only traffic that is necessary; all other traffic is specifically denied.',
      testing: [
        'Examine configuration standards for NSCs to verify they define restricting outbound traffic from the CDE.',
        'Examine NSC configurations to verify outbound traffic is restricted as specified and all other traffic is denied.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.3.3',
      title: 'Wireless networks and the CDE',
      question:
        'Are NSCs installed between all wireless networks and the CDE, regardless of whether the wireless network is a CDE, such that all wireless traffic into the CDE is denied by default and only wireless traffic with an authorized business purpose is allowed?',
      requirement:
        'NSCs are installed between all wireless networks and the CDE, regardless of whether the wireless network is a CDE, such that: all wireless traffic from wireless networks into the CDE is denied by default; only wireless traffic with an authorized business purpose is allowed into the CDE.',
      testing: [
        'Examine configuration settings and network diagrams to verify that NSCs are implemented between all wireless networks and the CDE.',
        'Examine NSC configurations to verify that wireless traffic into the CDE is denied by default and only authorized traffic is allowed.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if there are no wireless networks anywhere in the environment, including out-of-scope corporate wireless.',
    },
    {
      id: '1.4.1',
      title: 'NSCs between trusted and untrusted networks',
      question:
        'Are NSCs implemented between trusted and untrusted networks?',
      requirement: 'NSCs are implemented between trusted and untrusted networks.',
      testing: [
        'Examine configuration standards and network diagrams to verify that NSCs are defined between trusted and untrusted networks.',
        'Examine network configurations to verify that NSCs are in place between trusted and untrusted networks.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.4.2',
      title: 'Inbound traffic from untrusted networks',
      question:
        'Is inbound traffic from untrusted networks to trusted networks restricted to communications with system components authorized to provide publicly accessible services, protocols, and ports, and stateful responses to communications initiated by system components in a trusted network, with all other traffic denied?',
      requirement:
        'Inbound traffic from untrusted networks to trusted networks is restricted to: communications with system components that are authorized to provide publicly accessible services, protocols, and ports; stateful responses to communications initiated by system components in a trusted network; all other traffic is denied.',
      testing: [
        'Examine vendor documentation and configurations of NSCs to verify that inbound traffic is restricted as specified.',
        'Examine NSC configurations to verify all other traffic is denied.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.4.3',
      title: 'Anti-spoofing measures',
      question:
        'Are anti-spoofing measures implemented to detect and block forged source IP addresses from entering the trusted network?',
      requirement:
        'Anti-spoofing measures are implemented to detect and block forged source IP addresses from entering the trusted network.',
      testing: [
        'Examine NSC vendor documentation to verify anti-spoofing measures are available and can be configured.',
        'Examine configurations of NSCs to verify anti-spoofing measures are implemented.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.4.4',
      title: 'Stored cardholder data not directly reachable',
      question:
        'Are system components that store cardholder data prevented from being directly accessible from untrusted networks?',
      requirement:
        'System components that store cardholder data are not directly accessible from untrusted networks.',
      testing: [
        'Examine the data-flow diagram and network diagram to verify that system components storing cardholder data are not directly accessible from untrusted networks.',
        'Examine configurations of NSCs to verify that controls are implemented to prevent direct access.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no cardholder data is stored electronically by your organization.',
    },
    {
      id: '1.4.5',
      title: 'Disclosure of internal IP addresses',
      question:
        'Is the disclosure of internal IP addresses and routing information limited to only authorized parties?',
      requirement:
        'The disclosure of internal IP addresses and routing information is limited to only authorized parties.',
      testing: [
        'Examine configurations of NSCs to verify that the disclosure of internal IP addresses and routing information is controlled.',
        'Interview personnel and examine documentation to verify that controls exist such that any disclosure is limited to authorized parties.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.5.1',
      title: 'Computing devices connecting to untrusted networks and the CDE',
      question:
        'Are security controls implemented on any computing devices, including company- and employee-owned devices, that connect to both untrusted networks and the CDE, to prevent threats from being introduced into the CDE?',
      requirement:
        'Security controls are implemented on any computing devices, including company- and employee-owned devices, that connect to both untrusted networks (including the Internet) and the CDE as follows: specific configuration settings are defined to prevent threats being introduced into the entity’s network; security controls are actively running; security controls are not alterable by users of the computing devices unless specifically documented and authorized by management on a case-by-case basis for a limited period.',
      testing: [
        'Examine policies and configuration standards to verify that controls are defined for computing devices that connect to both untrusted networks and the CDE.',
        'Examine configuration settings on such devices to verify controls are active and not alterable by users.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no computing device is permitted to connect to both an untrusted network and the CDE.',
    },
  ],
};
