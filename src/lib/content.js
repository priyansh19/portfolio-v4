/**
 * Single source of truth for everything the portfolio renders.
 * Sourced from https://tsenta.com/u/priyansh-gupta
 */

export const profile = {
  name: 'Priyansh Gupta',
  firstName: 'Priyansh',
  lastName: 'Gupta',
  role: 'Forward Deployed Engineer',
  headline:
    'Forward Deployed Engineer with 5+ years across DevOps, Cloud Infrastructure and Gen AI applications.',
  location: 'JVC, Dubai, United Arab Emirates',
  timezone: 'GST (UTC+4)',
  intro:
    'I ship production Gen AI systems — agentic platforms, RAG at enterprise scale, and the Kubernetes plumbing that keeps them alive. From Terraform module to LLM gateway to the dashboard your team actually uses.',
  titles: ['AI Platform Engineer', 'Agentic AI Architect', 'Cloud & DevOps', 'GenAI Consultant'],

  /**
   * The first question every visitor has. Derived from the dates on the public
   * profile — AIS ended Mar 2026, the M.Sc. finished Jul 2026, freelance is
   * listed as ongoing. CONFIRM these read the way you want them to.
   */
  status: {
    headline: 'Consulting independently, open to forward-deployed roles',
    detail:
      'Wrapped an M.Sc. in Artificial Intelligence in July 2026. Taking selected consulting work now, and open to full-time forward-deployed or AI platform roles.',
    openTo: ['Consulting engagements', 'Full-time roles', 'Remote or Dubai-based'],
  },
};

export const links = {
  email: 'priyansh.9071@gmail.com',
  portfolio: 'https://priyansh19.github.io',
  linkedin: 'https://linkedin.com/in/priyansh19',
  github: 'https://github.com/priyansh19',
  tsenta: 'https://tsenta.com/u/priyansh-gupta',
  /**
   * Drop a PDF at public/priyansh-gupta-cv.pdf and set this to
   * '/priyansh-gupta-cv.pdf'. Every CV button stays hidden while it is empty,
   * so the site never links to a 404.
   */
  resume: '',
};

/** How to reach me, and what to expect back. */
export const contactMeta = {
  timezone: profile.timezone,
  // Set this once you know what you can actually honour, then it renders.
  responseTime: '',
  helpful: [
    'What you are building and what stage it is at',
    'The constraint that matters most — deadline, budget, compliance, latency',
    'Whether you want advice, a build, or someone embedded with the team',
  ],
};

export const stats = [
  { value: '5+', label: 'Years shipping' },
  { value: '20+', label: 'RAG apps in prod' },
  { value: '5K', label: 'Users served' },
  { value: '10', label: 'Engineers led' },
];

/**
 * The through-line the role list does not tell on its own: five years at one
 * company, moving up the stack from infrastructure to leading GenAI delivery.
 * Written from the dates and titles on the public profile.
 */
export const careerNarrative = {
  title: 'Five years, four roles, one company',
  paragraphs: [
    'I joined Applied Information Services in May 2021 writing infrastructure as code — Terraform and Bicep modules for VNets, AKS clusters and Key Vaults, turning multi-day environment provisioning into something that took hours.',
    'Once the environments were reproducible, the problem moved up a layer. From late 2022 I was running the production platform: self-service AKS onboarding on reusable Helm charts, clusters hardened with Kyverno policy and Istio mTLS, and GitOps-driven canary and blue-green releases.',
    'When Gen AI arrived as a delivery problem rather than a research one, that platform work turned out to be the hard part. From January 2025 I led a team of ten shipping enterprise GenAI — 20+ production RAG applications, an LLM gateway in front of them, and the security and cost controls that let a bank-grade organisation actually run them.',
    'The pattern I keep returning to: the model is rarely the bottleneck. Identity, tenancy, evaluation, cost and rollback are.',
  ],
};

/**
 * The freelance line overlaps two full-time roles, which reads oddly without
 * explanation. FILL THIS IN — or clear it and the note stops rendering.
 */
export const experienceNote = '';

export const experience = [
  {
    id: 'ais-genai',
    role: 'Senior AI Platform Engineer',
    scope: 'Enterprise GenAI Delivery',
    company: 'Applied Information Services (AIS)',
    period: 'Jan 2025 — Mar 2026',
    current: false,
    points: [
      'Led a team of 10 engineers and deployed 20+ production RAG applications serving 500–5,000 users, cutting cross-team ticket volume ~80% and lifting grounded-response accuracy ~35%.',
      'Enforced document-level security via Entra ID identity mapping and Azure AI Search filters.',
      'Designed an Enterprise LLM Gateway that collapsed deployment time from weeks to hours.',
      'Optimised inference cost through PTU right-sizing and semantic caching.',
      'Standardised CI/CD governance, accelerating model onboarding from 2 weeks to 3 days.',
      'Migrated 50+ workloads (FMGlobal) at 99.9%+ uptime.',
    ],
    tags: ['Azure AI Foundry', 'RAG', 'Entra ID', 'AKS', 'CI/CD'],
  },
  {
    id: 'freelance',
    role: 'GenAI / Agentic AI Consultant',
    scope: 'Independent',
    company: 'Freelance — Upwork',
    period: 'Aug 2022 — Present',
    current: true,
    points: [
      'Completed 20+ end-to-end engagements, from scoping through production adoption.',
      'Built an enterprise Agentic AI framework on LangGraph/LangChain with first-class observability.',
      'Deployed a multi-tenant inference layer on AKS with aggressive cost optimisation.',
    ],
    tags: ['LangGraph', 'LangChain', 'AKS', 'Observability'],
  },
  {
    id: 'ais-devops',
    role: 'DevOps Engineer',
    scope: 'Production Platform & Delivery',
    company: 'Applied Information Services (AIS)',
    period: 'Oct 2022 — Dec 2024',
    current: false,
    points: [
      'Provided self-service AKS onboarding backed by reusable Helm charts.',
      'Hardened clusters with Kyverno policy, Azure Key Vault and Istio mTLS.',
      'Enabled GitOps-driven canary and blue-green deployments.',
    ],
    tags: ['Kubernetes', 'Helm', 'Kyverno', 'Istio', 'GitOps'],
  },
  {
    id: 'ais-iac',
    role: 'Cloud & Software Engineer',
    scope: 'Infrastructure as Code',
    company: 'Applied Information Services (AIS)',
    period: 'May 2021 — Oct 2022',
    current: false,
    points: [
      'Cut environment provisioning from days to hours with Terraform and Bicep.',
      'Built versioned, auditable infrastructure modules for VNets, AKS and Key Vaults.',
    ],
    tags: ['Terraform', 'Bicep', 'Azure'],
  },
];

/**
 * Each project carries enough detail to render its own page at
 * /projects/<slug>. `shape` picks the 3D form used in that page's hero.
 */
export const projects = [
  {
    id: 'llm-gateway',
    slug: 'enterprise-llm-gateway',
    index: '01',
    name: 'Enterprise LLM Gateway',
    subtitle: 'Inference Control Plane',
    description:
      'Provider-agnostic routing across Azure AI Foundry and vLLM with authentication, rate limiting, tenant isolation, guardrails and prompt-injection defence.',
    stack: ['AKS', 'Azure APIM', 'vLLM', 'FastAPI', 'Prometheus', 'Grafana', 'Langfuse'],
    accent: 'cyan',
    shape: 'torusKnot',
    year: '2025 — 2026',
    context: 'Applied Information Services',
    evidence: {
      kind: 'proprietary',
      note: 'Built inside a client engagement, so there is no public repository or demo. Happy to walk through the architecture and the trade-offs in a call.',
    },
    role: 'Design lead & primary implementer',
    tagline: 'One door in front of every model the enterprise is allowed to call.',
    photos: [
      { alt: 'Enterprise LLM Gateway routing dashboard', caption: 'the gateway, routing' },
      { alt: 'Grafana panel showing per-tenant token spend', caption: 'watching the spend' },
    ],
    problem: [
      'Every team that wanted a model wired their own client straight to a provider SDK. Keys spread across repos, nobody could answer who was spending what, and a provider outage meant a dozen separate incidents.',
      'Onboarding a new model took roughly two weeks of review, plumbing and environment work before a single token was served.',
    ],
    approach: [
      {
        title: 'Provider-agnostic routing',
        body: 'A single OpenAI-shaped contract in front of Azure AI Foundry and self-hosted vLLM. Callers name a capability, not a vendor, so models can be swapped or failed over without touching application code.',
      },
      {
        title: 'Identity and tenancy at the edge',
        body: 'Authentication and tenant resolution happen at the gateway. Every request carries a resolved tenant, and quota, rate limits and routing policy are all derived from it rather than trusted from the client.',
      },
      {
        title: 'Guardrails in the request path',
        body: 'Input and output pass through guardrail checks including prompt-injection defence, so protection is a property of the platform instead of something each team reimplements.',
      },
      {
        title: 'Cost control as a first-class feature',
        body: 'PTU right-sizing and semantic caching cut spend on repeated work, with per-tenant attribution so cost is visible before the invoice arrives.',
      },
      {
        title: 'Observability wired in from day one',
        body: 'Prometheus and Grafana for platform health, Langfuse for trace-level view of prompts, latency and token spend across every tenant.',
      },
    ],
    architecture: {
      caption: 'Request path through the gateway',
      layers: [
        { id: 'clients', label: 'Tenant apps', nodes: ['Chat UIs', 'Internal services', 'Batch jobs'] },
        { id: 'edge', label: 'Edge', nodes: ['Azure APIM', 'AuthN / AuthZ', 'Rate limit'] },
        { id: 'gateway', label: 'Gateway', nodes: ['Router', 'Guardrails', 'Semantic cache'] },
        { id: 'models', label: 'Inference', nodes: ['Azure AI Foundry', 'vLLM on AKS'] },
        { id: 'observe', label: 'Telemetry', nodes: ['Langfuse', 'Prometheus', 'Grafana'] },
      ],
    },
    outcomes: [
      { value: 'Weeks → hours', label: 'Time to deploy a new application', basis: '' },
      {
        value: '2 wks → 3 days',
        label: 'Model onboarding, after CI/CD governance',
        basis: '',
      },
      { value: '~80%', label: 'Drop in cross-team ticket volume', basis: '' },
    ],
    highlights: [
      'Document-level security enforced via Entra ID identity mapping and Azure AI Search filters.',
      'Standardised CI/CD governance across every model deployment.',
      'Backed 20+ production RAG applications serving 500–5,000 users.',
    ],
  },
  {
    id: 'mach2',
    slug: 'mach2',
    index: '02',
    name: 'Mach2',
    subtitle: 'Multi-Agent Operations Platform',
    description:
      'Hierarchical orchestrator with scouting and critic agents that cut hallucinated outputs ~35%. Episodic and factual memory with crash-safe checkpoints.',
    stack: ['LangGraph', 'CrewAI', 'Langfuse', 'vLLM', 'Kubernetes'],
    accent: 'violet',
    shape: 'icosahedron',
    year: '2025 — 2026',
    context: 'Personal R&D — open harness on GitHub',
    evidence: {
      kind: 'open-source',
      note: 'Source is public — the orchestrator, the critic pass and the checkpointing are all readable.',
    },
    role: 'Author',
    repo: 'https://github.com/priyansh19/Mach-2-Agent-Harness',
    tagline: 'Agents that argue with each other before they answer you.',
    photos: [
      { alt: 'Mach2 orchestrator run in progress', caption: 'a run, mid-flight' },
      { alt: 'Langfuse trace of scout and critic agent hops', caption: 'the critic, disagreeing' },
    ],
    problem: [
      'A single agent looping over tools is confidently wrong at a rate nobody wants in production. It has no second opinion and no memory of the last time it made the same mistake.',
      'Long-running agent jobs also die badly — a crash three hours in usually means starting over.',
    ],
    approach: [
      {
        title: 'Hierarchical orchestration',
        body: 'A top-level orchestrator decomposes the goal and delegates, rather than one agent trying to hold the entire task in a single context.',
      },
      {
        title: 'Scouting agents',
        body: 'Cheap, parallel agents explore the problem space first and report back, so the expensive reasoning step starts from gathered evidence instead of guesses.',
      },
      {
        title: 'Critic agents',
        body: 'Before an answer leaves the system a critic pass challenges it. This adversarial step is what drives the ~35% reduction in hallucinated or incorrect output.',
      },
      {
        title: 'Two kinds of memory',
        body: 'Episodic memory for what happened in this run, factual memory for what stays true across runs — kept separate so recency never overwrites truth.',
      },
      {
        title: 'Crash-safe checkpoints',
        body: 'State is checkpointed as the graph advances, so a long job resumes from the last good node instead of the beginning.',
      },
    ],
    architecture: {
      caption: 'Task decomposition and verification loop',
      layers: [
        { id: 'goal', label: 'Input', nodes: ['Goal'] },
        { id: 'orch', label: 'Orchestrator', nodes: ['Decompose', 'Delegate', 'Checkpoint'] },
        { id: 'workers', label: 'Agents', nodes: ['Scout', 'Worker', 'Critic'] },
        { id: 'memory', label: 'Memory', nodes: ['Episodic', 'Factual'] },
        { id: 'out', label: 'Output', nodes: ['Verified result'] },
      ],
    },
    outcomes: [
      {
        value: '~35%',
        label: 'Fewer hallucinated or incorrect outputs',
        // FILL: eval set, judge, sample size, before/after. Renders as small
        // print under the number; stays hidden while empty.
        basis: '',
      },
      { value: 'Resumable', label: 'Long jobs survive a crash mid-run' },
      { value: 'Traced', label: 'Every agent hop visible in Langfuse' },
    ],
    highlights: [
      'Runs against self-hosted vLLM, so the whole loop can stay inside your own network.',
      'Deployed on Kubernetes for horizontal scale across concurrent runs.',
      'Specialised agents collaborate, debate and share tools within one harness.',
    ],
  },
  {
    id: 'blastr',
    slug: 'blastr',
    index: '03',
    name: 'BlastR',
    subtitle: 'GraphRAG Security Analysis',
    description:
      'Parses Terraform into a Neo4j knowledge graph and ranks security findings by blast radius. Fine-tuned Qwen2.5-Coder-1.5B (LoRA/QLoRA) on Checkov and Trivy data.',
    stack: ['Neo4j', 'GraphRAG', 'LoRA/QLoRA', 'Qwen2.5-Coder', 'FastAPI', 'React'],
    accent: 'lime',
    shape: 'graph',
    year: '2025 — 2026',
    context: 'M.Sc. Artificial Intelligence dissertation — Heriot-Watt University',
    evidence: {
      kind: 'academic',
      note: 'Submitted as a dissertation. Add the paper PDF to public/ and set `paper` below so it links from here.',
      // e.g. '/blastr-dissertation.pdf' — hidden until set
      paper: '',
    },
    role: 'Author',
    tagline: 'Not "you have 400 findings" — "fix these three first, and here is what they reach."',
    photos: [
      { alt: 'BlastR React dashboard ranking findings by blast radius', caption: 'findings, ranked' },
      { alt: 'Neo4j graph view of parsed Terraform resources', caption: 'the graph underneath' },
    ],
    problem: [
      'Infrastructure scanners are good at finding issues and bad at ranking them. A HIGH on an isolated sandbox bucket outranks a MEDIUM on the role that can assume its way into production, because severity is assigned per-resource with no idea what connects to what.',
      'The result is alert fatigue: hundreds of findings, no defensible order, and engineers triaging by gut feel.',
    ],
    approach: [
      {
        title: 'Terraform as a graph, not a pile of files',
        body: 'HCL is parsed into a Neo4j knowledge graph where resources, modules, roles and networks are nodes and the references between them are edges. Reachability becomes a query instead of a guess.',
      },
      {
        title: 'Blast radius as the ranking signal',
        body: 'Each finding is scored by what it can actually reach through the graph. A misconfiguration on a node with wide downstream reach outranks a severe-but-contained one.',
      },
      {
        title: 'GraphRAG over the infrastructure graph',
        body: 'Retrieval walks the graph rather than a flat vector index, so explanations cite the real path between a finding and the thing it endangers.',
      },
      {
        title: 'A small model, specialised',
        body: 'Qwen2.5-Coder-1.5B fine-tuned with LoRA/QLoRA on Checkov and Trivy output. Small enough to run locally, tuned closely enough to read infrastructure findings well.',
      },
      {
        title: 'Three ways in',
        body: 'Shipped as a CLI for pipelines, a FastAPI service for integration, and a React dashboard for exploring the graph visually.',
      },
    ],
    architecture: {
      caption: 'From HCL to ranked findings',
      layers: [
        { id: 'src', label: 'Source', nodes: ['Terraform HCL'] },
        { id: 'scan', label: 'Scanners', nodes: ['Checkov', 'Trivy'] },
        { id: 'graph', label: 'Knowledge graph', nodes: ['Neo4j', 'Resource edges', 'Reachability'] },
        { id: 'model', label: 'Reasoning', nodes: ['GraphRAG retrieval', 'Qwen2.5-Coder LoRA'] },
        { id: 'ui', label: 'Surfaces', nodes: ['CLI', 'FastAPI', 'React dashboard'] },
      ],
    },
    outcomes: [
      { value: 'Ranked', label: 'Findings ordered by real reach, not flat severity' },
      { value: '1.5B', label: 'Parameter model, fine-tuned and locally runnable' },
      { value: '3 surfaces', label: 'CLI, service and dashboard from one core' },
    ],
    highlights: [
      'Explanations trace the actual graph path from finding to blast radius.',
      'QLoRA training keeps fine-tuning tractable on a single GPU.',
      'Submitted as the M.Sc. Artificial Intelligence dissertation.',
    ],
  },
  {
    id: 'crewspace',
    slug: 'crewspace',
    index: '04',
    name: 'CrewSpace',
    subtitle: 'Open-Source Multi-Agent AI Workforce',
    description:
      'A CEO agent decomposes goals and delegates across specialised agents, each with its own memory, file permissions and terminal access, on live task boards.',
    stack: ['Multi-Agent', 'Electron', 'TypeScript', 'Realtime', 'Open Source'],
    accent: 'amber',
    shape: 'octahedron',
    year: '2025 — 2026',
    context: 'Open source — actively shipped',
    evidence: {
      kind: 'open-source',
      note: 'Public repository with 100+ merged pull requests, signed desktop builds and an npm CLI.',
    },
    role: 'Author & maintainer',
    repo: 'https://github.com/priyansh19/CrewSpace',
    tagline: 'An org chart you can run.',
    photos: [
      { alt: 'CrewSpace live task board with agents working', caption: 'the crew, working' },
      { alt: 'CrewSpace desktop app running on macOS', caption: 'shipped as a real app' },
    ],
    problem: [
      'Multi-agent frameworks tend to stop at the library. You get orchestration primitives and then you are on your own for permissions, distribution, and any way to watch what the agents are actually doing.',
      'Giving an agent terminal and filesystem access without per-agent scoping is how a demo becomes an incident.',
    ],
    approach: [
      {
        title: 'A CEO agent at the top',
        body: 'One agent owns the goal, breaks it down and delegates to specialised agents, mirroring how the work would be split across a real team.',
      },
      {
        title: 'Per-agent memory and permissions',
        body: 'Each agent gets its own memory and its own file permissions. Terminal access is scoped rather than shared, so an agent can only reach what its role requires.',
      },
      {
        title: 'Real-time task boards',
        body: 'Work in flight is visible on live boards. You watch delegation happen instead of reading a log afterwards.',
      },
      {
        title: 'Shipped as a real application',
        body: 'Packaged for desktop with code signing, notarisation and a seamless auto-update path, plus an npm CLI for local distribution.',
      },
    ],
    architecture: {
      caption: 'Delegation and permission model',
      layers: [
        { id: 'goal', label: 'Input', nodes: ['Objective'] },
        { id: 'ceo', label: 'CEO agent', nodes: ['Decompose', 'Assign', 'Review'] },
        { id: 'crew', label: 'Specialists', nodes: ['Research', 'Build', 'Verify'] },
        { id: 'caps', label: 'Scoped capability', nodes: ['Memory', 'Files', 'Terminal'] },
        { id: 'ui', label: 'Surface', nodes: ['Live task board'] },
      ],
    },
    outcomes: [
      { value: '100+', label: 'Merged pull requests on the repo' },
      { value: 'Signed', label: 'Notarised desktop builds with auto-update' },
      { value: 'Open', label: 'Source available and actively maintained' },
    ],
    highlights: [
      'Ships as desktop app, npm CLI and web-first UI package from one codebase.',
      'macOS code signing and notarisation solved end to end, including Gatekeeper edge cases.',
      'Seamless auto-update system with in-place installer updates.',
    ],
  },
  {
    id: 'openclaw',
    slug: 'openclaw',
    index: '05',
    name: 'OpenClaw',
    subtitle: 'Autonomous AI Agent Platform',
    description:
      'Contributor to the agent runtime — hardened image-tool path handling and improved tool validation errors, both merged upstream.',
    stack: ['Open Source', 'Agent Runtime', 'Security', 'TypeScript'],
    accent: 'magenta',
    shape: 'dodecahedron',
    year: '2026',
    context: 'Upstream open-source contribution',
    evidence: {
      kind: 'open-source',
      note: 'Both merged patches are public and linked below — read the diffs.',
    },
    role: 'Contributor',
    repo: 'https://github.com/openclaw/openclaw',
    tagline: 'Small patches, sharp edges — the kind that only show up under real use.',
    photos: [
      { alt: 'Merged OpenClaw pull request #57222 on GitHub', caption: 'merged, #57222' },
      { alt: 'Diff of the image-tool path resolution fix', caption: 'the actual diff' },
    ],
    problem: [
      'Agent runtimes fail in ways that are hard to reproduce: a tool resolves a path relative to the wrong root, or rejects a call with an error that tells you nothing about what it actually received.',
      'These are not headline features. They are the difference between an agent you can debug and one you cannot.',
    ],
    approach: [
      {
        title: 'Path resolution against the workspace root',
        body: 'The image tool resolved relative paths against the wrong base, letting file references escape the intended workspace directory. Fixed to resolve against workspaceDir. Merged as #57222.',
      },
      {
        title: 'Validation errors that name the problem',
        body: 'The write tool reported a missing parameter without saying which keys it did receive, making every failure a guessing game. The received keys are now included in the error. Merged as #55317.',
      },
      {
        title: 'Further upstream work',
        body: 'Additional patches proposed across the gateway allowlist compatibility, Ollama baseURL aliasing, MiniMax portal URLs and Slack channel mention handling.',
      },
    ],
    architecture: null,
    outcomes: [
      { value: '2 merged', label: 'Patches accepted into the OpenClaw runtime' },
      { value: '#57222', label: 'image-tool path resolution hardened' },
      { value: '#55317', label: 'write-tool validation errors made actionable' },
    ],
    highlights: [
      'Both merged fixes landed in April 2026.',
      'Part of a broader pattern of upstream work across dify, docsy and Spark.',
      'See the open-source page for the full contribution history.',
    ],
  },
];

export const projectBySlug = slug => projects.find(project => project.slug === slug);

export const skillGroups = [
  {
    id: 'ai',
    title: 'AI & LLMs',
    items: [
      'Agentic AI',
      'Multi-Agent Systems',
      'RAG',
      'GraphRAG',
      'Hybrid Search',
      'Prompt Engineering',
      'LLM Evaluation',
      'LoRA / QLoRA',
      'PEFT / Unsloth',
      'Model Distillation',
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks',
    items: ['LangChain', 'LangGraph', 'CrewAI', 'AutoGen', 'Hugging Face'],
  },
  {
    id: 'cloud',
    title: 'Cloud',
    items: ['Azure AI Foundry', 'Azure OpenAI', 'Azure AI Search', 'API Management', 'AWS', 'GCP'],
  },
  {
    id: 'devops',
    title: 'Kubernetes & DevOps',
    items: [
      'AKS',
      'Docker',
      'Helm',
      'Kyverno',
      'Istio',
      'FluxCD',
      'ArgoCD',
      'Terraform',
      'Bicep',
    ],
  },
  {
    id: 'data',
    title: 'Databases',
    items: ['PostgreSQL', 'Redis', 'ChromaDB', 'Qdrant', 'Neo4j', 'MongoDB', 'Pinecone'],
  },
  {
    id: 'languages',
    title: 'Languages',
    items: ['Python', 'TypeScript', 'SQL', 'YAML', 'JavaScript', 'Java', 'Go', 'Rust'],
  },
];

/** Short labels used for the 3D skill constellation — long names read badly in 3D. */
export const orbitSkills = [
  'Python',
  'LangGraph',
  'Kubernetes',
  'RAG',
  'Azure',
  'Terraform',
  'Neo4j',
  'vLLM',
  'Docker',
  'TypeScript',
  'GraphRAG',
  'Helm',
  'FastAPI',
  'Istio',
  'CrewAI',
  'Qdrant',
  'Go',
  'ArgoCD',
  'LoRA',
  'Redis',
  'AWS',
  'Rust',
  'Bicep',
  'Langfuse',
];

export const education = [
  {
    id: 'msc',
    degree: 'M.Sc., Artificial Intelligence',
    school: 'Heriot-Watt University',
    period: 'Sep 2025 — Jul 2026',
  },
  {
    id: 'btech',
    degree: 'B.Tech., Computer Science',
    school: 'University of Petroleum and Energy Studies',
    period: 'Jan 2017 — Jan 2021',
  },
];

export const certifications = [
  { id: 'az400', code: 'AZ-400', name: 'DevOps Engineer Expert' },
  { id: 'ai102', code: 'AI-102', name: 'Azure AI Engineer Associate' },
  { id: 'cka', code: 'CKA', name: 'Certified Kubernetes Administrator' },
  { id: 'ckad', code: 'CKAD', name: 'Kubernetes Application Developer' },
  { id: 'az104', code: 'AZ-104', name: 'Azure Administrator' },
  { id: 'ai900', code: 'AI-900', name: 'Azure AI Fundamentals' },
  { id: 'az900', code: 'AZ-900', name: 'Azure Fundamentals' },
];

/**
 * One destination per label. Every top-level topic has a real page — the home
 * page only ever teases them, so no label points at two different places.
 */
export const navPages = [
  { href: '/work', label: 'Work' },
  { href: '/projects', label: 'Projects' },
  { href: '/freelance', label: 'Freelance' },
  { href: '/open-source', label: 'Open Source' },
  { href: '/about', label: 'About' },
];

/** Home-page anchors that have no page of their own. */
export const navSections = [{ id: 'contact', label: 'Contact' }];

export const freelance = {
  title: 'Freelance & Consulting',
  tagline: 'Brought in when a Gen AI idea has to become something that runs on Monday.',
  period: 'Aug 2022 — Present',
  channel: 'Upwork and direct',
  intro:
    'I take Gen AI and platform engagements end to end — scoping the problem, building the thing, and staying until it is genuinely in production and someone other than me can operate it.',
  stats: [
    { value: '20+', label: 'Engagements completed' },
    { value: '4 yrs', label: 'Consulting independently' },
    { value: 'E2E', label: 'Scoping through production adoption' },
  ],
  services: [
    {
      id: 'agentic',
      title: 'Agentic AI systems',
      body: 'Multi-agent architectures on LangGraph and LangChain — orchestration, tool design, memory, and the evaluation harness that tells you whether any of it is working.',
      tags: ['LangGraph', 'LangChain', 'CrewAI', 'AutoGen'],
    },
    {
      id: 'rag',
      title: 'RAG that survives contact with real documents',
      body: 'Retrieval design including hybrid search and GraphRAG, chunking that respects structure, and document-level access control so the wrong person never retrieves the wrong page.',
      tags: ['RAG', 'GraphRAG', 'Hybrid search', 'Entra ID'],
    },
    {
      id: 'platform',
      title: 'Inference platform & LLM gateways',
      body: 'Multi-tenant inference layers on AKS with routing, quotas, tenant isolation and guardrails — plus the cost work that keeps the bill defensible.',
      tags: ['AKS', 'vLLM', 'APIM', 'Cost optimisation'],
    },
    {
      id: 'infra',
      title: 'Cloud & Kubernetes foundations',
      body: 'The layer underneath: Terraform and Bicep modules, hardened clusters, GitOps delivery, and CI/CD that makes a rollback boring.',
      tags: ['Terraform', 'Bicep', 'Helm', 'ArgoCD', 'FluxCD'],
    },
    {
      id: 'observability',
      title: 'Evaluation & observability',
      body: 'Tracing every prompt, tool call and token so regressions are visible before a user reports them, and so "is the new model better" has an answer.',
      tags: ['Langfuse', 'Prometheus', 'Grafana', 'LLM eval'],
    },
    {
      id: 'finetune',
      title: 'Fine-tuning & model specialisation',
      body: 'LoRA, QLoRA and PEFT work where a smaller specialised model beats paying frontier prices for a narrow task, including distillation.',
      tags: ['LoRA', 'QLoRA', 'PEFT', 'Unsloth', 'Distillation'],
    },
  ],
  process: [
    {
      step: '01',
      title: 'Scope',
      body: 'Work out what is actually being asked for, what the data looks like, and what "done" means in numbers. Most engagements change shape here, which is the point.',
    },
    {
      step: '02',
      title: 'Prove',
      body: 'A narrow slice built against real data, with evaluation attached from the start. If the approach does not hold up, better to know in week two.',
    },
    {
      step: '03',
      title: 'Build',
      body: 'The full system, with security, tenancy, cost controls and observability treated as requirements rather than a later phase.',
    },
    {
      step: '04',
      title: 'Hand over',
      body: 'Deployment pipelines, runbooks and enough documentation that the team owns it without me. Production adoption is the deliverable, not a demo.',
    },
  ],
  /**
   * What a buyer needs before they email you. FILL THESE IN — each renders
   * only when non-empty, so the page stays honest while they are blank.
   */
  availability: {
    status: '',        // e.g. 'Taking new work from September 2026'
    capacity: '',      // e.g. 'Two days a week, or full-time for 6–12 week builds'
    engagementSize: '', // e.g. 'Typical engagement: 4–12 weeks'
    rates: '',         // e.g. 'Day rate on request; fixed-scope for discovery work'
  },

  /**
   * Anonymised case studies — the single highest-value thing missing from this
   * page. Sector, problem, what you did, what changed, over how long.
   * The section is hidden entirely while this array is empty.
   */
  caseStudies: [],

  /** Testimonials or Upwork rating. Hidden while empty. */
  testimonials: [],

  engagements: [
    {
      title: 'Enterprise Agentic AI framework',
      body: 'Built on LangGraph and LangChain with first-class observability, so agent behaviour is inspectable rather than mysterious.',
    },
    {
      title: 'Multi-tenant inference layer',
      body: 'Deployed on AKS with tenant isolation and aggressive cost optimisation across shared capacity.',
    },
    {
      title: 'End-to-end delivery',
      body: '20+ engagements carried from initial scoping all the way through to production adoption.',
    },
  ],
};

/**
 * Sourced from the public GitHub API for github.com/priyansh19 on 29 Jul 2026.
 * Counts are point-in-time; re-run the queries in the README to refresh.
 */
export const openSource = {
  title: 'Open Source',
  tagline: 'Upstream patches, maintained projects, and a long tail of small fixes.',
  handle: 'priyansh19',
  profile: 'https://github.com/priyansh19',
  since: '2017',
  stats: [
    { value: '153', label: 'Merged pull requests' },
    { value: '22', label: 'Merged into others’ repos' },
    { value: '142', label: 'Public repositories' },
    { value: '195', label: 'GitHub followers' },
  ],
  intro:
    'Two threads run through this: projects I maintain myself, and patches sent upstream to things I use. The upstream work is mostly unglamorous — path handling, error messages, CI config — the fixes you only find by running something in anger.',
  upstream: [
    {
      id: 'openclaw',
      org: 'openclaw/openclaw',
      description: 'Autonomous AI agent platform',
      url: 'https://github.com/openclaw/openclaw',
      tier: 'recent',
      period: '2026',
      merged: 2,
      opened: 8,
      highlights: [
        {
          number: '#57222',
          title: 'fix(image-tool): resolve relative paths against workspaceDir',
          note: 'Stopped the image tool resolving relative paths against the wrong root, keeping file references inside the intended workspace.',
          url: 'https://github.com/openclaw/openclaw/pull/57222',
          merged: true,
        },
        {
          number: '#55317',
          title: 'fix(agents): include received keys in missing-param error for write tool',
          note: 'Made a common tool-validation failure diagnosable by reporting which keys actually arrived.',
          url: 'https://github.com/openclaw/openclaw/pull/55317',
          merged: true,
        },
        {
          number: '#57214',
          title: 'fix(ollama): accept baseURL alias for remote Ollama hosts',
          url: 'https://github.com/openclaw/openclaw/pull/57214',
          merged: false,
        },
        {
          number: '#89846',
          title: 'feat(slack): ignoreOtherMentions config option for channels',
          url: 'https://github.com/openclaw/openclaw/pull/89846',
          merged: false,
        },
      ],
    },
    {
      id: 'dify',
      org: 'langgenius/dify',
      description: 'Open-source LLM app development platform',
      url: 'https://github.com/langgenius/dify',
      tier: 'recent',
      period: '2026',
      merged: 0,
      opened: 3,
      highlights: [
        {
          number: '#37531',
          title: 'feat(workflow): expose prompt and completion tokens in workflow run responses',
          url: 'https://github.com/langgenius/dify/pull/37531',
          merged: false,
        },
        {
          number: '#37397',
          title: 'fix: support CJK workflow log keyword search',
          url: 'https://github.com/langgenius/dify/pull/37397',
          merged: false,
        },
        {
          number: '#37346',
          title: 'fix: allow adding imported start variables',
          url: 'https://github.com/langgenius/dify/pull/37346',
          merged: false,
        },
      ],
    },
    {
      id: 'docsy',
      org: 'google/docsy',
      description: 'Hugo documentation theme by Google',
      url: 'https://github.com/google/docsy',
      tier: 'early',
      period: '2019',
      merged: 2,
      opened: 2,
      highlights: [
        {
          number: '#101',
          title: 'Updating the config.toml file format',
          url: 'https://github.com/google/docsy/pull/101',
          merged: true,
        },
        {
          number: '#105',
          title: 'Update netlify.toml',
          url: 'https://github.com/google/docsy/pull/105',
          merged: true,
        },
      ],
    },
    {
      id: 'whatsapp-play',
      org: 'whatsplay/whatsapp-play',
      description: 'WhatsApp automation toolkit',
      url: 'https://github.com/whatsplay/whatsapp-play',
      tier: 'early',
      period: '2020',
      merged: 6,
      opened: 9,
      highlights: [
        {
          number: '#213',
          title: 'Adding GitHub Actions',
          url: 'https://github.com/whatsplay/whatsapp-play/pull/213',
          merged: true,
        },
        {
          number: '#200',
          title: 'Added separate Contribution.md template',
          url: 'https://github.com/whatsplay/whatsapp-play/pull/200',
          merged: true,
        },
      ],
    },
    {
      id: 'opengenus',
      org: 'OpenGenus',
      description: 'Computer science knowledge guides',
      url: 'https://github.com/OpenGenus',
      tier: 'early',
      period: '2019',
      merged: 3,
      opened: 3,
      highlights: [
        {
          number: 'hive_guide #1',
          title: 'Hive guide — initial content and examples',
          url: 'https://github.com/OpenGenus/hive_guide/pull/1',
          merged: true,
        },
        {
          number: 'kafka_basics #1',
          title: 'Kafka basics — initial commit',
          url: 'https://github.com/OpenGenus/kafka_basics/pull/1',
          merged: true,
        },
      ],
    },
  ],
  maintained: [
    {
      name: 'CrewSpace',
      description:
        'Multi-agent AI workforce — a CEO agent decomposes goals and delegates across specialised agents with scoped memory, files and terminal access.',
      url: 'https://github.com/priyansh19/CrewSpace',
      language: 'TypeScript',
      note: '100+ merged PRs',
    },
    {
      name: 'Mach-2-Agent-Harness',
      description:
        'Multi-agent ReAct harness where specialised agents collaborate, debate and share tools within one run.',
      url: 'https://github.com/priyansh19/Mach-2-Agent-Harness',
      language: 'Python',
      note: 'Research harness',
    },
    {
      name: 'System-Design-Expert-LLM',
      description:
        'Fine-tuning an open 7–8B model into a staff-level system-design and architecture advisor.',
      url: 'https://github.com/priyansh19/System-Design-Expert-LLM',
      language: 'Python',
      note: 'Fine-tuning',
    },
    {
      name: 'Ornith-1.0-Code',
      description:
        'Local coding assistant — a Next.js and Electron desktop UI for the self-scaffolding ornith:9b model.',
      url: 'https://github.com/priyansh19/Ornith-1.0-Code',
      language: 'TypeScript',
      note: 'Local-first',
    },
    {
      name: 'KubeAI',
      description: 'Kubernetes AI assistant chatbot.',
      url: 'https://github.com/priyansh19/KubeAI',
      language: 'Python',
      note: 'Kubernetes',
    },
    {
      name: 'LangGraph-Agents',
      description: 'Reference implementations of different LangGraph agent patterns.',
      url: 'https://github.com/priyansh19/LangGraph-Agents',
      language: 'Python',
      note: 'Reference',
    },
    {
      name: 'Local-LLM-Bench',
      description: 'Benchmarking harness for locally hosted models.',
      url: 'https://github.com/priyansh19/Local-LLM-Bench',
      language: 'JavaScript',
      note: 'Benchmarking',
    },
    {
      name: '100-Days-of-ML',
      description: 'Hands-on machine learning notebooks built over a long study run.',
      url: 'https://github.com/priyansh19/100-Days-of-ML',
      language: 'Jupyter Notebook',
      note: 'Learning in public',
    },
  ],
};
