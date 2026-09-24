export default {
  id: 1,
  title: 'Install and Maintain Network Security Controls',
  goal: 'Build and Maintain a Secure Network and Systems',
  intro:
    'Network security controls are the enforcement points that decide what traffic may cross from one part of a network to another — firewalls, and the newer technologies that do the same job. Requirement 1 is about having them where the boundaries are, configuring them deliberately, and keeping those configurations honest over time.',
  questions: [
    {
      id: '1.1.1',
      title: 'Documented policies and procedures',
      question:
        'Are the security policies and operating procedures covering Requirement 1 written down, kept current, actually followed, and communicated to everyone whose work they govern?',
      requirement:
        'Written policies and operating procedures exist for the subject matter of Requirement 1. They are kept up to date, are in active use rather than shelved, and are known to every party they affect.',
      testing: [
        'Read the policies and operating procedures the entity holds for Requirement 1.',
        'Ask the personnel governed by them whether they are followed in practice, and whether those affected know they exist.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.1.2',
      title: 'Roles and responsibilities',
      question:
        'Is it written down who is accountable for each Requirement 1 activity, has that accountability been allocated to specific people or roles, and do they understand it?',
      requirement:
        'Accountability for performing each Requirement 1 activity is recorded in writing, allocated to identified roles, and understood by the people holding those roles.',
      testing: [
        'Read the documentation that allocates these responsibilities, and check that each one has an owner.',
        'Ask the people named whether they understand what falls to them.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.1',
      title: 'NSC configuration standards',
      question:
        'Has the organisation written down the standards its network security control rulesets must meet, put them into effect, and kept them current?',
      requirement:
        'Standards governing how network security control rulesets are to be built exist in writing, are applied in practice, and are maintained.',
      testing: [
        'Read the configuration standards that apply to network security control rulesets.',
        'Compare the rulesets actually configured against those standards, and confirm they were built to match.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.2',
      title: 'Change control for network connections',
      question:
        'Does every change to a network connection, and to any network security control configuration, go through the approval and change control process required by Requirement 6.5.1?',
      requirement:
        'Changes to network connections, and changes to network security control configurations, are approved and handled under the change control process that Requirement 6.5.1 calls for. No change is exempt.',
      testing: [
        'Read the documented procedure, and inspect the network configuration as it now stands.',
        'Trace recorded network changes back through the change process, and ask the staff who make them how changes are handled.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.3',
      title: 'Network diagram',
      question:
        'Is there an accurate network diagram showing every connection between the cardholder data environment and any other network, wireless networks included, and is it revised whenever the environment changes?',
      requirement:
        'The entity keeps one or more accurate network diagrams depicting every connection between the cardholder data environment and other networks, including any wireless network. The diagrams are revised as the environment changes.',
      testing: [
        'Compare the diagrams against the network as configured, and confirm they are accurate.',
        'Ask the staff responsible how the diagrams are kept current when the environment changes.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.4',
      title: 'Data-flow diagram',
      question:
        'Is there an accurate data-flow diagram tracing every movement of account data across your systems and networks, and is it revised whenever the environment changes?',
      requirement:
        'The entity keeps one or more accurate data-flow diagrams that trace every flow of account data across its systems and networks, and revises them as the environment changes.',
      testing: [
        'Read the data-flow diagrams and ask staff whether every account data flow is represented.',
        'Check the supporting documentation and ask the responsible staff how currency is maintained.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.5',
      title: 'Services, protocols and ports inventory',
      question:
        'Is every permitted service, protocol and port listed, individually approved, and tied to a stated business reason for allowing it?',
      requirement:
        'Every service, protocol and port the entity permits is enumerated, has been approved, and has a business need recorded against it.',
      testing: [
        'Read the inventory and confirm it lists every permitted service, protocol and port, each with its business justification and its approval.',
        'Inspect the network security control configuration and confirm nothing is permitted that the inventory has not approved.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.6',
      title: 'Security features for insecure services',
      question:
        'Where a service, protocol or port in use is regarded as insecure, have compensating security features been specified and put in place so the risk it carries is reduced?',
      requirement:
        'For each service, protocol or port in use that is considered insecure, security features are specified and implemented such that the resulting risk is mitigated.',
      testing: [
        'Read the documentation naming each insecure service, protocol and port in use, together with the security features applied to each.',
        'Inspect the configuration and confirm those features are in place for every one of them.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no insecure services, protocols, or ports are in use anywhere in scope.',
    },
    {
      id: '1.2.7',
      title: 'Six-monthly NSC configuration review',
      question:
        'Does a review of network security control configurations take place at intervals no longer than six months, testing whether each remains appropriate and remains effective?',
      requirement:
        'Network security control configurations are reviewed no less often than every six months, to establish that they remain relevant and remain effective.',
      testing: [
        'Read the documentation and confirm a review procedure exists with a frequency of at least once every six months.',
        'Read the records of reviews actually performed, and ask the responsible staff, to confirm the interval has been met.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.2.8',
      title: 'Securing NSC configuration files',
      question:
        'Are the configuration files for network security controls protected against unauthorised access, and do they match what the devices are actually running?',
      requirement:
        'Network security control configuration files are protected from unauthorised access, and their contents agree with the configurations running on the live network.',
      testing: [
        'Inspect the configuration files and ask staff how access to them is restricted.',
        'Compare the stored files against the running network configuration and confirm the two agree.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.3.1',
      title: 'Inbound traffic to the CDE',
      question:
        'Is traffic entering the cardholder data environment cut back to only what is necessary, with everything else explicitly refused?',
      requirement:
        'Traffic inbound to the cardholder data environment is limited to what is necessary. Everything not necessary is denied explicitly, rather than left to an implicit default.',
      testing: [
        'Read the network security control configuration standards and confirm they require inbound traffic to the cardholder data environment to be restricted.',
        'Inspect the live configuration and confirm the restriction is in force and that remaining traffic is denied.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.3.2',
      title: 'Outbound traffic from the CDE',
      question:
        'Is traffic leaving the cardholder data environment cut back to only what is necessary, with everything else explicitly refused?',
      requirement:
        'Traffic outbound from the cardholder data environment is limited to what is necessary. Everything not necessary is denied explicitly.',
      testing: [
        'Read the network security control configuration standards and confirm they require outbound traffic from the cardholder data environment to be restricted.',
        'Inspect the live configuration and confirm the restriction is in force and that remaining traffic is denied.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.3.3',
      title: 'Wireless networks and the CDE',
      question:
        'Do network security controls sit between every wireless network and the cardholder data environment — whether or not the wireless network is itself in scope — refusing wireless traffic into that environment by default and admitting only what has an authorised business purpose?',
      requirement:
        'Network security controls are placed between the cardholder data environment and every wireless network, irrespective of whether that wireless network is itself part of the cardholder data environment. The default for wireless traffic entering the cardholder data environment is refusal; only traffic with an authorised business purpose is admitted.',
      testing: [
        'Inspect the configuration and the network diagrams to confirm controls sit between the cardholder data environment and each wireless network.',
        'Inspect the control configuration and confirm the default is refusal and that only authorised traffic is admitted.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if there are no wireless networks anywhere in the environment, including out-of-scope corporate wireless.',
    },
    {
      id: '1.4.1',
      title: 'NSCs between trusted and untrusted networks',
      question:
        'Are network security controls in place wherever a trusted network meets an untrusted one?',
      requirement:
        'Network security controls are deployed at the boundaries between trusted and untrusted networks.',
      testing: [
        'Read the configuration standards and the network diagrams to confirm controls are specified at these boundaries.',
        'Inspect the live network configuration and confirm they are actually deployed there.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.4.2',
      title: 'Inbound traffic from untrusted networks',
      question:
        'Is traffic arriving from untrusted networks into trusted ones held to just two things — reaching system components authorised to offer publicly available services, protocols and ports, and stateful replies to conversations a trusted system component started — with the rest refused?',
      requirement:
        'Traffic inbound from untrusted networks to trusted networks is confined to two categories: traffic to system components cleared to offer services, protocols and ports that are publicly reachable; and stateful responses to communications that a system component on a trusted network initiated. Anything outside those two is refused.',
      testing: [
        'Read the vendor documentation and the network security control configurations, and confirm inbound traffic is confined as described.',
        'Inspect the configurations and confirm all other traffic is refused.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.4.3',
      title: 'Anti-spoofing measures',
      question:
        'Are anti-spoofing measures deployed, so that packets carrying a forged source IP address are spotted and stopped before they reach the trusted network?',
      requirement:
        'Anti-spoofing measures are in place to detect packets bearing forged source IP addresses and to block them from entering the trusted network.',
      testing: [
        'Read the vendor documentation to confirm the network security controls in use offer an anti-spoofing capability that can be turned on.',
        'Inspect the configurations and confirm it has been turned on.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.4.4',
      title: 'Stored cardholder data not directly reachable',
      question:
        'Are the system components that hold stored cardholder data placed out of direct reach from untrusted networks?',
      requirement:
        'System components storing cardholder data cannot be reached directly from an untrusted network.',
      testing: [
        'Read the data-flow and network diagrams and confirm no component storing cardholder data is directly reachable from an untrusted network.',
        'Inspect the network security control configurations and confirm controls are in place that prevent such direct access.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no cardholder data is stored electronically by your organization.',
    },
    {
      id: '1.4.5',
      title: 'Disclosure of internal IP addresses',
      question:
        'Is knowledge of your internal IP addressing and routing held to authorised parties only?',
      requirement:
        'Internal IP addresses and routing information are disclosed to authorised parties only.',
      testing: [
        'Inspect the network security control configurations and confirm disclosure of internal addressing and routing information is controlled.',
        'Ask staff and read the documentation to confirm that where such information is disclosed, it goes only to authorised parties.',
      ],
      appliesTo: 'all',
      allowNA: false,
    },
    {
      id: '1.5.1',
      title: 'Computing devices connecting to untrusted networks and the CDE',
      question:
        'For any computing device that connects both to an untrusted network and to the cardholder data environment — whether the company owns it or an employee does — are security controls in place to stop it carrying threats into that environment?',
      requirement:
        'Any computing device that attaches both to an untrusted network (the internet included) and to the cardholder data environment is subject to security controls, whoever owns it: particular configuration settings are laid down to stop threats reaching the entity’s network; the controls are running, not merely installed; and the device’s user cannot change them, unless management has documented and authorised an exception for that case and for a bounded period.',
      testing: [
        'Read the policies and configuration standards and confirm controls are specified for devices that attach to both an untrusted network and the cardholder data environment.',
        'Inspect the settings on such devices and confirm the controls are running and are beyond the user’s ability to alter.',
      ],
      appliesTo: 'all',
      allowNA: true,
      condition: 'Mark N/A only if no computing device is permitted to connect to both an untrusted network and the CDE.',
    },
  ],
};
