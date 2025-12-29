import express from "express";

const router = express.Router();

const PLANETARY_ETHICS = [
  {
    framework: "Intergenerational Justice",
    description: "Obligations to future generations.",
    question: "What world are we leaving to those who come after?",
    principles: ["Sustainability", "Preservation of options", "Non-declining welfare", "Ecological inheritance"]
  },
  {
    framework: "Environmental Justice",
    description: "Fair distribution of environmental benefits and burdens.",
    question: "Who bears the cost of environmental harm?",
    principles: ["Equitable distribution", "Procedural justice", "Recognition of vulnerability", "Remediation of harm"]
  },
  {
    framework: "Deep Ecology",
    description: "Intrinsic value of all living beings.",
    question: "Do non-human beings have inherent worth?",
    principles: ["Biocentric equality", "Self-realization for all beings", "Ecological wisdom", "Simple means, rich ends"]
  },
  {
    framework: "Ecofeminism",
    description: "Connection between domination of nature and women.",
    question: "How do systems of domination interconnect?",
    principles: ["Critique of domination", "Care and relationship", "Embodied knowing", "Diversity and difference"]
  },
  {
    framework: "Ubuntu Ethics",
    description: "African philosophy of interconnectedness.",
    question: "How does my humanity depend on recognizing yours?",
    principles: ["I am because we are", "Community over individual", "Reconciliation and restoration", "Harmony with nature"]
  }
];

const SYSTEMS_OF_OPPRESSION = [
  {
    system: "Structural Racism",
    description: "Policies and practices that produce racial inequity.",
    intervention: "Examine and transform institutions, not just individual attitudes.",
    healing: "Truth-telling, reparative action, building equitable systems"
  },
  {
    system: "Economic Inequality",
    description: "Unequal distribution of resources and opportunities.",
    intervention: "Progressive policies, wealth redistribution, universal basic services.",
    healing: "Solidarity economics, mutual aid, cooperative models"
  },
  {
    system: "Colonial Legacy",
    description: "Ongoing effects of historical colonization.",
    intervention: "Decolonization of knowledge, land return, sovereignty recognition.",
    healing: "Indigenous leadership, traditional ecological knowledge, cultural revitalization"
  },
  {
    system: "Patriarchy",
    description: "Systemic male dominance and gender hierarchy.",
    intervention: "Gender equity policies, challenging toxic masculinity, centering women's leadership.",
    healing: "Feminist consciousness, healing masculine-feminine split, full spectrum gender expression"
  }
];

const REGENERATIVE_FUTURES = [
  {
    vision: "Circular Economy",
    description: "Design out waste, keep materials in use, regenerate natural systems.",
    practices: ["Cradle to cradle design", "Sharing economy", "Repair culture", "Biomimicry"]
  },
  {
    vision: "Solidarity Economy",
    description: "Economic activity serving people and planet over profit.",
    practices: ["Worker cooperatives", "Community land trusts", "Mutual aid networks", "Time banks"]
  },
  {
    vision: "Regenerative Agriculture",
    description: "Farming that restores ecosystems and sequesters carbon.",
    practices: ["Permaculture", "Agroforestry", "Holistic management", "Indigenous food systems"]
  },
  {
    vision: "Doughnut Economics",
    description: "Meet everyone's needs within planetary boundaries.",
    practices: ["Social foundation", "Ecological ceiling", "Thriving in balance", "Local implementation"]
  },
  {
    vision: "Buen Vivir",
    description: "Good living in harmony with nature (Andean philosophy).",
    practices: ["Community wellbeing", "Rights of nature", "Pluriversal knowing", "Decolonial development"]
  }
];

const COLLECTIVE_HEALING = [
  { practice: "Truth and Reconciliation", description: "Public acknowledgment of historical harms." },
  { practice: "Restorative Justice", description: "Repairing harm through dialogue and accountability." },
  { practice: "Community Healing Circles", description: "Collective processing of shared trauma." },
  { practice: "Reparations", description: "Material redress for historical injustice." },
  { practice: "Land Back", description: "Return of indigenous lands and sovereignty." }
];

router.get("/planetary-ethics", (_req, res) => {
  res.json({ ok: true, frameworks: PLANETARY_ETHICS });
});

router.get("/oppression-systems", (_req, res) => {
  res.json({ ok: true, systems: SYSTEMS_OF_OPPRESSION });
});

router.get("/regenerative", (_req, res) => {
  res.json({ ok: true, visions: REGENERATIVE_FUTURES });
});

router.get("/collective-healing", (_req, res) => {
  res.json({ ok: true, practices: COLLECTIVE_HEALING });
});

router.get("/daily", (_req, res) => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  const ethics = PLANETARY_ETHICS[dayOfYear % PLANETARY_ETHICS.length];
  const regenerative = REGENERATIVE_FUTURES[dayOfYear % REGENERATIVE_FUTURES.length];
  const healing = COLLECTIVE_HEALING[dayOfYear % COLLECTIVE_HEALING.length];
  
  res.json({
    ok: true,
    daily: {
      planetaryEthics: ethics,
      regenerativeVision: regenerative,
      collectiveHealing: healing,
      justicePrompt: `Today, consider "${ethics.framework}": ${ethics.question}`,
      actionStep: `Explore "${regenerative.vision}": ${regenerative.description}`
    }
  });
});

export default router;
