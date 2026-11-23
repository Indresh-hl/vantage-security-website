export interface MetricItem {
  value: number;
  prefix?: string;
  suffix: string;
  decimals?: number;
  label: string;
  sublabel: string;
}

export interface ServiceItem {
  id: string;
  code: string;
  title: string;
  summary: string;
  deliverables: string[];
  icon: 'shield' | 'scan' | 'cctv' | 'userCheck' | 'clipboard' | 'radio';
}

export interface StandardPillar {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  code: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  scope: string;
  image: string;
  quote: string;
}

export interface SectorItem {
  name: string;
  regionTag: string;
  detail: string;
}

export interface ComplianceItem {
  code: string;
  name: string;
  subtitle: string;
}

export interface BriefingItem {
  id: string;
  date: string;
  title: string;
  category: string;
  summary: string;
  image: string;
  alt: string;
}

export interface FaqItem {
  index: string;
  question: string;
  answer: string;
}

export const AGENCY_INFO = {
  brand: 'VANTAGE SECURITY',
  shortBrand: 'VANTAGE',
  tagline: 'PSARA Licensed Command. Every Layer of Protection.',
  licenseNo: 'PSARA/KA/MYS/2026/04819',
  hqCity: 'Mysuru, Karnataka',
  hqAddressLine1: 'Vantage Command House, #42 Contour Road',
  hqAddressLine2: 'Gokulam 3rd Stage, Mysuru, Karnataka 570002',
  email: 'command@vantagesecurity.in',
  dispatchPhone: '+91 821 400 2470',
  dispatchPhoneHref: 'tel:+918214002470',
  officeHours: '24/7 SOC Dispatch · Admin Mon–Sat / 09:00–18:30 IST',
  coverageCities: ['Mysuru', 'Bengaluru', 'Nanjangud', 'Mangaluru', 'Hubballi-Dharwad'],
};

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Standards', href: '#standards' },
  { label: 'Sectors', href: '#sectors' },
  { label: 'Briefings', href: '#briefings' },
  { label: 'Contact', href: '#assessment' },
];

export const HERO_METRICS: MetricItem[] = [
  {
    value: 90,
    prefix: '< ',
    suffix: 's',
    label: 'Average SOC alarm verification',
    sublabel: 'Dual-redundant Mysuru & Bengaluru command desks',
  },
  {
    value: 99.8,
    suffix: '%',
    decimals: 1,
    label: 'Verified post-coverage reliability',
    sublabel: 'Biometric shift check-ins across Karnataka sites',
  },
  {
    value: 14,
    suffix: '+',
    label: 'Years of PSARA-compliant operations',
    sublabel: 'Police-verified officers, full EPF & ESIC governance',
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'corporate-guarding',
    code: '01 / GUARDING',
    title: 'Corporate & Campus Guarding',
    summary:
      'PSARA-licensed, police-verified officers for executive lobbies, campuses, and 24/7 perimeters.',
    deliverables: ['Uniformed Officers', 'Biometric Shifts', 'Field Supervision'],
    icon: 'shield',
  },
  {
    id: 'access-control',
    code: '02 / ACCESS',
    title: 'Access Control & Perimeter',
    summary:
      'Biometric turnstiles, ANPR boom barriers, and digital visitor credentialing at every gate.',
    deliverables: ['RFID Turnstiles', 'ANPR Barriers', 'Visitor Logs'],
    icon: 'scan',
  },
  {
    id: 'cctv-soc',
    code: '03 / SOC CCTV',
    title: '24/7 CCTV & SOC Monitoring',
    summary:
      'Live remote video verification and AI perimeter alerts from our Mysuru Command Center.',
    deliverables: ['Live Verification', 'Health Diagnostics', 'Incident Clips'],
    icon: 'cctv',
  },
  {
    id: 'executive-protection',
    code: '04 / VIP',
    title: 'Executive & VIP Protection',
    summary:
      'Discreet close protection, advance route planning, and secure transfers for visiting leadership.',
    deliverables: ['Route Advances', 'Plainclothes PSOs', 'Airport Transfers'],
    icon: 'userCheck',
  },
  {
    id: 'risk-assessments',
    code: '05 / ADVISORY',
    title: 'Site Risk & PSARA Audits',
    summary:
      'Physical vulnerability mapping, statutory PSARA readiness, and custom facility SOPs.',
    deliverables: ['Vulnerability Map', 'Post Orders', 'Risk Dossier'],
    icon: 'clipboard',
  },
  {
    id: 'mobile-response',
    code: '06 / QRT',
    title: 'Rapid Mobile Patrol & QRT',
    summary:
      'GPS-tracked Quick Response Teams for randomized night sweeps and rapid alarm dispatch.',
    deliverables: ['Night Sweeps', 'Alarm Dispatch', 'Police Liaison'],
    icon: 'radio',
  },
];

export const STANDARD_PILLARS: StandardPillar[] = [
  {
    position: 'top-left',
    code: 'PSARA/KA/MYS/2026',
    title: 'PSARA Licensed',
    description: 'Home Dept., Govt. of Karnataka licensed with full statutory compliance.',
  },
  {
    position: 'top-right',
    code: '< 90 SEC SLA',
    title: '24/7 Mysuru SOC',
    description: 'Timestamped alarm escalation routed directly to senior operations officers.',
  },
  {
    position: 'bottom-left',
    code: '100% CLEARED',
    title: 'Police Verified',
    description: 'Antecedent clearance, 160-hour academy training, and biometric shift logs.',
  },
  {
    position: 'bottom-right',
    code: 'ZERO SUBCONTRACTING',
    title: 'ISO & EPF / ESIC',
    description: 'Direct payroll, ISO 9001 SOPs, and monthly audit-ready client dossiers.',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'hebbal-industrial',
    name: 'Rajeshwar Kulkarni',
    role: 'Director of Plant Operations',
    organization: 'Deccan Precision Manufacturing',
    location: 'Hebbal, Mysuru',
    scope: '42 Officers · ANPR Gate · 24/7 SOC',
    image: '/images/client-1.jpg',
    quote:
      'Vantage audited our 28-acre plant in six days, deployed PSARA-verified officers with biometric shifts, and eliminated vendor gate hold-ups in month one. Their monthly compliance dossier makes ISO audits effortless.',
  },
  {
    id: 'bengaluru-campus',
    name: 'Ananya Deshpande',
    role: 'VP, Corporate Real Estate',
    organization: 'Kaveri Tech Park Holdings',
    location: 'Mysuru & Bengaluru',
    scope: 'Multi-Campus · Biometrics · Executive Escorts',
    image: '/images/client-2.jpg',
    quote:
      'We needed security that felt calm and architectural. Vantage rebuilt our reception access control, linked our CCTV into their 24/7 Mysuru SOC, and handles every visiting board delegation like clockwork.',
  },
];

export const SECTORS: SectorItem[] = [
  {
    name: 'IT & Technology Parks',
    regionTag: 'Mysuru · Bengaluru',
    detail: 'Biometric lobby governance, visitor badging, and 24/7 multi-tower SOC monitoring.',
  },
  {
    name: 'Industrial & Manufacturing',
    regionTag: 'Hebbal · Nanjangud',
    detail: 'Material gate control, weighbridge verification, and high-perimeter night QRT patrols.',
  },
  {
    name: 'Corporate Headquarters',
    regionTag: 'Pan-Karnataka',
    detail: 'Concierge-grade uniformed officers, boardroom access control, and threat screening.',
  },
  {
    name: 'Universities & Campuses',
    regionTag: 'Mysuru · Mangaluru',
    detail: 'Calm, high-trust campus patrolling, hostel entry governance, and emergency marshals.',
  },
  {
    name: 'Healthcare & Hospitals',
    regionTag: '24/7 Critical Care',
    detail: 'De-escalation-trained teams for ER zones, pharmacy access, and ambulance lane flow.',
  },
  {
    name: 'Data Centers & BFSI',
    regionTag: 'High-Assurance Tier',
    detail: 'Dual-authentication mantrap control, strict visitor escorts, and zero-gap audit trails.',
  },
  {
    name: 'Hospitality & Heritage',
    regionTag: 'Mysuru · Coorg',
    detail: 'Discreet guest-first perimeter security, baggage screening, and VIP delegation handling.',
  },
  {
    name: 'Private Estates & Villas',
    regionTag: 'Gated Communities',
    detail: '24/7 entry verification, perimeter sensor integration, and rapid alarm verification.',
  },
];

export const COMPLIANCE_STANDARDS: ComplianceItem[] = [
  {
    code: 'PSARA 2005',
    name: 'Karnataka Home Dept. Licensed',
    subtitle: 'Active Statutory Agency License',
  },
  {
    code: 'ISO 9001:2015',
    name: 'Quality Management Aligned',
    subtitle: 'Audited SOP & SLA Governance',
  },
  {
    code: 'POLICE VETTED',
    name: 'Karnataka Police Verification',
    subtitle: '100% Antecedent Clearance',
  },
  {
    code: 'EPF & ESIC',
    name: 'Zero-Default Payroll Compliance',
    subtitle: 'Monthly Client Audit Dossiers',
  },
  {
    code: 'VMS & ACCESS',
    name: 'Enterprise Systems Ready',
    subtitle: 'Hikvision · Genetec · Milestone · Honeywell',
  },
];

export const BRIEFINGS: BriefingItem[] = [
  {
    id: 'psara-audit-2026',
    date: 'NOVEMBER 2026',
    title: 'PSARA Karnataka Compliance Checklist for Corporate Facility Heads',
    category: 'REGULATORY ADVISORY',
    summary:
      'What enterprise procurement teams must verify before signing a manned guarding contract in Karnataka—from Controlling Authority licenses to statutory wage registers.',
    image: '/images/briefing-campus.jpg',
    alt: 'Aerial dusk view of a modern secured Karnataka technology and industrial park campus',
  },
  {
    id: 'hybrid-soc-perimeter',
    date: 'OCTOBER 2026',
    title: 'Combining Physical Gatehouse Officers with Remote SOC Video Verification',
    category: 'PERIMETER DESIGN',
    summary:
      'How mid-to-large industrial campuses in Hebbal and Nanjangud reduce night-shift blind spots while optimizing total guarding spend by 18–24%.',
    image: '/images/briefing-access.jpg',
    alt: 'Close-up of a matte-black biometric RFID access control reader mounted on a corporate glass doorframe',
  },
  {
    id: 'executive-protocol',
    date: 'SEPTEMBER 2026',
    title: 'Advance Route & Venue Protocols for Visiting Industrial Delegations',
    category: 'EXECUTIVE PROTECTION',
    summary:
      'Structured low-profile security planning between Kempegowda International Airport, Bengaluru corporate offices, and Mysuru manufacturing campuses.',
    image: '/images/briefing-patrol.jpg',
    alt: 'Corporate security operations supervisor reviewing live patrol telemetry on a tablet inside a sunlit glass atrium',
  },
  {
    id: 'fire-evacuation-drills',
    date: 'AUGUST 2026',
    title: 'Designing Zero-Friction Biometric Access Without Compromising Fire Egress',
    category: 'RISK ASSESSMENT',
    summary:
      'Architectural guidelines for integrating fail-safe turnstiles, emergency muster tracking, and quarterly campus evacuation drills.',
    image: '/images/hq-mysuru.jpg',
    alt: 'Contemporary architectural corporate command building in Mysuru with cantilevered concrete and landscaped courtyard',
  },
];

export const FAQS: FaqItem[] = [
  {
    index: '01',
    question: 'Is Vantage Security licensed under the Karnataka PSARA Act?',
    answer:
      'Yes. Vantage Security operates under an active Private Security Agencies Regulation Act (PSARA) license issued by the Controlling Authority, Home Department, Government of Karnataka. Copies of our license, insurance coverage, and statutory registrations (EPF, ESIC, GST, Professional Tax) are furnished with every proposal and monthly invoice.',
  },
  {
    index: '02',
    question: 'How are security officers vetted and trained before site deployment?',
    answer:
      'Every candidate undergoes mandatory Karnataka Police antecedent verification, Aadhaar/address cross-verification, and medical fitness screening. Before taking a post, officers complete 160 hours of PSARA-mandated classroom and field instruction covering access control, fire safety, basic first aid, visitor etiquette, and incident reporting.',
  },
  {
    index: '03',
    question: 'Can you integrate with our existing CCTV and biometric access hardware?',
    answer:
      'Yes. Our Mysuru Security Operations Center (SOC) integrates with standard ONVIF-compliant IP cameras and enterprise VMS/access platforms (including Hikvision, Honeywell, Milestone, and Genetec) without forcing a full hardware rip-and-replace. During our site risk assessment, we audit existing camera angles and recommend targeted upgrades only where blind spots exist.',
  },
  {
    index: '04',
    question: 'How quickly can Vantage mobilize guarding for a new facility?',
    answer:
      'For single corporate offices or industrial sites in Mysuru and Bengaluru, we typically complete the site risk assessment within 48 hours and mobilize trained teams within 7 to 14 days—including customized Post Orders, shift rosters, and biometric attendance onboarding. Emergency interim coverage can be mobilized within 24 hours.',
  },
  {
    index: '05',
    question: 'What regions across Karnataka do you currently cover?',
    answer:
      'Our Command Headquarters is in Mysuru, with dedicated field supervision and Quick Response Teams covering Mysuru (Hebbal, Hootagalli, Metagalli, Nanjangud), Bengaluru (Electronic City, Whitefield, Peenya, Devanahalli), Mandya, Coorg, Mangaluru, and Hubballi-Dharwad.',
  },
  {
    index: '06',
    question: 'How is pricing structured for corporate guarding and site assessments?',
    answer:
      'Initial on-site security risk assessments for qualified corporate, campus, and industrial facilities are conducted at zero obligation. Ongoing guarding proposals are itemized transparently against Karnataka Minimum Wages, statutory EPF/ESIC contributions, uniform/equipment allowances, field supervision, and optional 24/7 SOC monitoring—with zero hidden markups.',
  },
];

export const ASSESSMENT_SERVICES = [
  'Corporate & Campus Guarding',
  'Access Control & Perimeter',
  '24/7 CCTV / SOC Monitoring',
  'Executive Protection',
  'Site Risk & PSARA Audit',
  'Mobile Patrol / QRT',
];
