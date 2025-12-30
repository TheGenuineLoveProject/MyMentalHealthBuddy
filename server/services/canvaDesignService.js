// Healing design creation service
import { db } from '../db/client.mjs';

const THERAPEUTIC_TEMPLATES = [
  { id: 'healing-affirmation', name: 'Healing Affirmation', elements: [] },
  { id: 'gratitude-journal', name: 'Gratitude Journal', elements: [] },
  { id: 'mindfulness-poster', name: 'Mindfulness Poster', elements: [] },
  { id: 'self-love-card', name: 'Self-Love Card', elements: [] },
];

export async function createHealingDesign(templateId, customization, healingIntent, userId) {
  try {
    // Get template configuration
    const template = THERAPEUTIC_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Therapeutic template not found');
    }

    // Validate healing intention
    const intentionAnalysis = analyzeHealingIntention(healingIntent);
    if (!intentionAnalysis.isValid) {
      throw new Error('Healing intention must be meaningful and positive');
    }

    // Create design with customization
    const design = {
      id: `healing_${Date.now()}_${userId}`,
      templateId: templateId,
      name: template.name,
      healingIntent: healingIntent,
      intentionAnalysis: intentionAnalysis,
      elements: customizeTemplateElements(template.elements, customization),
      userCustomizations: customization,
      createdAt: new Date().toISOString(),
      healingScore: intentionAnalysis.healingScore,
      therapeuticValue: calculateTherapeuticValue(template, customization, healingIntent)
    };

    // Save to database
    await db.query(`
      INSERT INTO user_designs (id, user_id, template_id, name, healing_intent, elements, customizations, healing_score, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      design.id,
      userId,
      templateId,
      template.name,
      healingIntent,
      JSON.stringify(design.elements),
      JSON.stringify(customization),
      design.healingScore,
      design.createdAt
    ]);

    return design;

  } catch (error) {
    console.error('Healing design creation error:', error);
    throw new Error(`Unable to create healing design: ${error.message}`);
  }
}

function analyzeHealingIntention(healingIntent) {
  // Analyze healing intention for therapeutic value
  const positiveWords = ['love', 'healing', 'hope', 'peace', 'strength', 'growth', 'wellness', 'recovery', 'self-care', 'compassion'];
  const wordCount = healingIntent.split(' ').length;
  const positiveWordCount = positiveWords.filter(word => healingIntent.toLowerCase().includes(word)).length;

  const healingScore = Math.min(100, (positiveWordCount / positiveWords.length) * 100 + (wordCount > 5 ? 20 : 0));
  const isValid = wordCount >= 5 && healingScore > 30;

  return {
    isValid,
    healingScore,
    wordCount,
    positiveWordCount,
    analysis: isValid ? 'Meaningful healing intention' : 'Please provide a more detailed healing intention'
  };
}

function customizeTemplateElements(elements, customization) {
  // Apply user customizations to template elements
  return elements.map(element => ({
    ...element,
    ...customization[element.id] || {},
    healingEnhanced: true
  }));
}

function calculateTherapeuticValue(template, customization, healingIntent) {
  // Calculate therapeutic value of the design
  const baseValue = 50; // Base therapeutic value
  const customizationBonus = Object.keys(customization).length * 10;
  const intentionBonus = healingIntent.length > 20 ? 20 : 10;
  const templateMultiplier = template.healingIntent.includes('crisis') ? 1.5 : 1.2;

  return Math.min(100, (baseValue + customizationBonus + intentionBonus) * templateMultiplier);
}
