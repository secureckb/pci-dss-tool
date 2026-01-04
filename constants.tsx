
import { Requirement } from './types';

export const PCI_REQUIREMENTS: Requirement[] = [
  {
    id: 1,
    title: "Network Security Controls",
    description: "Install and Maintain Network Security Controls (NSCs) to protect the CDE.",
    subRequirements: [
      { id: "1.1", title: "Policy Management", description: "Processes for maintaining NSCs are defined.", testingProcedures: ["Examine policy docs."] },
      { id: "1.2", title: "NSC Configurations", description: "NSC rulesets are configured and managed.", testingProcedures: ["Review rule sets."] },
      { id: "1.3", title: "CDE Access", description: "Access to CDE is strictly restricted.", testingProcedures: ["Test inbound/outbound rules."] }
    ]
  },
  {
    id: 2,
    title: "Secure Configurations",
    description: "Apply secure configurations to all system components.",
    subRequirements: [
      { id: "2.1", title: "Hardening Policies", description: "Hardening processes are defined.", testingProcedures: ["Verify documentation."] },
      { id: "2.2", title: "System Management", description: "Default settings are changed.", testingProcedures: ["Audit random sample of servers."] }
    ]
  },
  {
    id: 3,
    title: "Stored Account Data",
    description: "Protect stored account data using strong cryptography.",
    subRequirements: [
      { id: "3.2", title: "Data Retention", description: "Storage of data is minimized.", testingProcedures: ["Check disposal records."] },
      { id: "3.4", title: "Masking", description: "PAN is masked when displayed.", testingProcedures: ["Observe application UI."] },
      { id: "3.5", title: "Unreadable PAN", description: "PAN is unreadable in storage.", testingProcedures: ["Inspect databases."] }
    ]
  },
  {
    id: 4,
    title: "Transmission Security",
    description: "Protect account data with strong cryptography during transmission.",
    subRequirements: [
      { id: "4.2", title: "Public Networks", description: "Strong crypto used over untrusted networks.", testingProcedures: ["Verify TLS versions."] }
    ]
  },
  {
    id: 5,
    title: "Malware Protection",
    description: "Protect systems from malicious software.",
    subRequirements: [
      { id: "5.2", title: "AV Deployment", description: "Anti-malware is installed on all systems.", testingProcedures: ["Verify AV logs."] }
    ]
  },
  {
    id: 6,
    title: "Secure Software",
    description: "Develop and maintain secure systems and software.",
    subRequirements: [
      { id: "6.2", title: "Critical Patches", description: "Security patches are installed promptly.", testingProcedures: ["Check patch management history."] }
    ]
  },
  {
    id: 7,
    title: "Access Restriction",
    description: "Restrict access to system components by business need to know.",
    subRequirements: [
      { id: "7.2", title: "Least Privilege", description: "Access is defined based on job function.", testingProcedures: ["Inspect ACLs."] }
    ]
  },
  {
    id: 8,
    title: "Identification & Auth",
    description: "Identify users and authenticate access to system components.",
    subRequirements: [
      { id: "8.3", title: "MFA", description: "MFA is used for all CDE access.", testingProcedures: ["Test login flows."] }
    ]
  },
  {
    id: 9,
    title: "Physical Security",
    description: "Restrict physical access to cardholder data.",
    subRequirements: [
      { id: "9.2", title: "Facility Access", description: "Physical access controls are in place.", testingProcedures: ["Visit data center."] }
    ]
  },
  {
    id: 10,
    title: "Logging & Monitoring",
    description: "Log and monitor all access to system components.",
    subRequirements: [
      { id: "10.2", title: "Audit Trails", description: "Automated audit trails are enabled.", testingProcedures: ["Verify log generation."] }
    ]
  },
  {
    id: 11,
    title: "Security Testing",
    description: "Test security of systems and networks regularly.",
    subRequirements: [
      { id: "11.3", title: "Penetration Testing", description: "Pen-tests are performed annually.", testingProcedures: ["Review reports."] }
    ]
  },
  {
    id: 12,
    title: "Security Policies",
    description: "Support info security with policies and programs.",
    subRequirements: [
      { id: "12.1", title: "Risk Assessment", description: "Perform annual risk assessments.", testingProcedures: ["Examine results."] }
    ]
  }
];
