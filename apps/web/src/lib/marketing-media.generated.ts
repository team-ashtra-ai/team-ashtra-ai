export const marketingMedia = {
  "hero-studio": {
    "id": "hero-studio",
    "src": "/media/marketing/premium-technology-editorial-workspace.jpg",
    "width": 4549,
    "height": 3013,
    "alt": "Curated flatlay with a laptop, tablet, pen display, and studio tools arranged on a bright editorial desk.",
    "caption": "Homepage image supporting the premium website transformation positioning.",
    "ownerNote": "Curated Pixabay image for the public homepage hero.",
    "photographer": "Veex",
    "photographerProfile": "https://pixabay.com/users/veex-6518820/",
    "sourcePageUrl": "https://pixabay.com/photos/laptop-technology-computer-business-3244483/",
    "pixabayId": 3244483,
    "tags": [
      "laptop technology computer business"
    ],
    "license": "Pixabay Content License"
  },
  "services-strategy": {
    "id": "services-strategy",
    "src": "/media/marketing/creative-strategy-workshop-technology-team.jpg",
    "width": 8098,
    "height": 5399,
    "alt": "Team strategy session with a presenter, whiteboard notes, and a laptop visible during a planning workshop.",
    "caption": "Used on the services page to reinforce strategic planning and delivery rigor.",
    "ownerNote": "Curated Pixabay image for offer and delivery storytelling.",
    "photographer": "DiggityMarketing",
    "photographerProfile": "https://pixabay.com/users/diggitymarketing-13210353/",
    "sourcePageUrl": "https://pixabay.com/photos/software-development-guest-post-4165307/",
    "pixabayId": 4165307,
    "tags": [
      "software development guest post"
    ],
    "license": "Pixabay Content License"
  },
  "process-interface": {
    "id": "process-interface",
    "src": "/media/marketing/interface-design-dashboard-analytics-workspace.jpg",
    "width": 5196,
    "height": 3464,
    "alt": "Developer reviewing a laptop screen filled with code in a focused product-work setting.",
    "caption": "Used on the process page to support the audit-to-launch narrative.",
    "ownerNote": "Curated Pixabay image for process and systems storytelling.",
    "photographer": "StockSnap",
    "photographerProfile": "https://pixabay.com/users/stocksnap-894430/",
    "sourcePageUrl": "https://pixabay.com/photos/code-coding-programming-html-2558220/",
    "pixabayId": 2558220,
    "tags": [
      "code coding programming"
    ],
    "license": "Pixabay Content License"
  },
  "showcase-proof": {
    "id": "showcase-proof",
    "src": "/media/marketing/premium-office-presentation-consulting-team.jpg",
    "width": 5986,
    "height": 3983,
    "alt": "Architectural conference room with a long table, presentation screens, and a premium boardroom atmosphere.",
    "caption": "Used on the showcase page to signal delivery quality and stakeholder confidence.",
    "ownerNote": "Curated Pixabay image for showcase and proof framing.",
    "photographer": "Tama66",
    "photographerProfile": "https://pixabay.com/users/tama66-12708058/",
    "sourcePageUrl": "https://pixabay.com/photos/meeting-conference-office-space-4565702/",
    "pixabayId": 4565702,
    "tags": [
      "meeting conference office"
    ],
    "license": "Pixabay Content License"
  },
  "dashboard-client": {
    "id": "dashboard-client",
    "src": "/media/marketing/client-dashboard-project-management-workspace.jpg",
    "width": 6000,
    "height": 4000,
    "alt": "Warm home-office desk with monitor, keyboard, mouse, and an orange flower styled beside the screen.",
    "caption": "Used on signed-out account pages to connect the brand to the client workspace experience.",
    "ownerNote": "Curated Pixabay image for login and register surfaces.",
    "photographer": "Van3ssa_",
    "photographerProfile": "https://pixabay.com/users/van3ssa_-13144205/",
    "sourcePageUrl": "https://pixabay.com/photos/workspace-home-office-office-desk-4962107/",
    "pixabayId": 4962107,
    "tags": [
      "workspace home office office desk"
    ],
    "license": "Pixabay Content License"
  }
} as const;

export type MarketingMediaId = keyof typeof marketingMedia;
