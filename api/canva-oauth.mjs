// Complete Canva OAuth with therapeutic design integration
import { db } from '../db/index.js';
import { authenticateToken } from '../middleware/auth.js';

// Canva configuration with your existing credentials
const CANVA_CONFIG = {
  clientId: process.env.CANVA_CLIENT_ID,
  appOrigin: process.env.CANVA_APP_ORIGIN,
  redirectUri: `${process.env.APP_URL}/api/canva/callback`,
  authUrl: 'https://www.canva.com/oauth/authorize',
  tokenUrl: 'https://api.canva.com/rest/v1/oauth/token',
  scope: 'design:read design:write profile:read'
};

// Therapeutic design templates for healing
const THERAPEUTIC_TEMPLATES = [
  {
    id: 'crisis_support_card',
    name: 'Crisis Support Card',
    description: 'Emergency support contact card with healing affirmations',
    elements: [
      { type: 'text', content: 'You are loved and worthy of healing', x: 100, y: 50 },
      { type: 'text', content: 'Crisis Support: 988', x: 100, y: 100 },
      { type: 'shape', shape: 'heart', color: '#4A90E2', x: 200, y: 150 }
    ],
    healingIntent: 'Provide immediate crisis support with love'
  },
  {
    id: 'self_love_affirmations',
    name: 'Self-Love Affirmations Poster',
    description: 'Daily self-love and worthiness affirmations',
    elements: [
      { type: 'text', content: 'I am worthy of love and healing', x: 100, y: 80 },
      { type: 'text', content: 'I accept myself completely', x: 100, y: 120 },
      { type: 'shape', shape: 'star', color: '#F5A623', x: 250, y: 100 }
    ],
    healingIntent: 'Build self-worth and self-acceptance'
  },
  {
    id: 'wellness_tracker',
    name: 'Healing Progress Tracker',
    description: 'Track your healing journey with compassionate metrics',
    elements: [
      { type: 'text', content: 'My Healing Journey', x: 150, y: 30 },
      { type: 'text', content: 'Mood: ___ Energy: ___ Self-care: ___', x: 60, y: 70 },
      { type: 'shape', shape: 'rectangle', color: '#7ED321', x: 50, y: 60 }
    ],
    healingIntent: 'Track healing progress with self-compassion'
  },
  {
    id: 'mindfulness_poster',
    name: 'Mindfulness & Meditation Guide',
    description: 'Step-by-step mindfulness and meditation instructions',
    elements: [
      { type: 'text', content: 'Breathe in peace, breathe out love', x: 100, y: 50 },
      { type: 'text', content: '1. Notice your breath\n2. Feel your body\n3. Let thoughts pass\n4. Return to breath', x: 60, y: 100 },
      { type: 'shape', shape: 'circle', color: '#667eea', x: 200, y: 150 }
    ],
    healingIntent: 'Guide mindfulness practice for emotional regulation'
  }
];

// Initiate Canva OAuth with healing intention
export async function canvaOAuthHandler(req, res) {
  try {
    const authUrl = new URL(CANVA_CONFIG.authUrl);
    authUrl.searchParams.set('client_id', CANVA_CONFIG.clientId);
    authUrl.searchParams.set('redirect_uri', CANVA_CONFIG.redirectUri);
    authUrl.searchParams.set('scope', CANVA_CONFIG.scope);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', 'healing_intent=true');

    console.log('Redirecting to Canva with healing intention:', authUrl.toString());
    res.redirect(authUrl.toString());
  } catch (error) {
    console.error('Canva OAuth initiation error:', error);
    res.status(500).json({ 
      error: 'Unable to initiate healing design tools',
      healingSupport: 'Canva design integration is ready but needs authorization'
    });
  }
}

// Handle Canva OAuth callback with therapeutic integration
export async function canvaOAuthCallbackHandler(req, res) {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ 
        error: 'Authorization code missing',
        healingSupport: 'Please authorize Canva to access healing design tools'
      });
    }

    // Exchange code for access token
    const tokenResponse = await fetch(CANVA_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'MyMentalHealthBuddy-Healing-Platform/1.0'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: CANVA_CONFIG.clientId,
        redirect_uri: CANVA_CONFIG.redirectUri
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Canva token exchange failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Canva
    const userResponse = await fetch('https://api.canva.com/rest/v1/user/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'User-Agent': 'MyMentalHealthBuddy-Healing-Platform/1.0'
      }
    });

    const canvaUser = await userResponse.json();

    // Save Canva connection with healing metadata
    if (req.user) {
      await db.query(`
        INSERT INTO user_integrations (user_id, integration_type, access_token, refresh_token, expires_at, metadata, created_at)
        VALUES (?, 'canva', ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE 
        access_token = ?, refresh_token = ?, expires_at = ?, metadata = ?
      `, [
        req.user.id,
        tokenData.access_token,
        tokenData.refresh_token,
        new Date(Date.now() + tokenData.expires_in * 1000),
        JSON.stringify({
          canva_user_id: canvaUser.id,
          canva_username: canvaUser.username,
          therapeutic_templates: THERAPEUTIC_TEMPLATES,
          healing_focus: 'emotional_wellness_design',
          intention: 'create_healing_visual_support'
        }),
        tokenData.access_token,
        tokenData.refresh_token,
        new Date(Date.now() + tokenData.expires_in * 1000),
        JSON.stringify({
          canva_user_id: canvaUser.id,
          canva_username: canvaUser.username,
          therapeutic_templates: THERAPEUTIC_TEMPLATES,
          healing_focus: 'emotional_wellness_design',
          intention: 'create_healing_visual_support'
        })
      ]);
    }

    // Return healing-focused response
    res.json({
      success: true,
      message: 'Canva healing design integration activated successfully',
      user: {
        id: canvaUser.id,
        username: canvaUser.username,
        displayName: canvaUser.display_name
      },
      therapeuticTemplates: THERAPEUTIC_TEMPLATES,
      healingMessage: 'You now have access to therapeutic design tools for emotional wellness and healing',
      nextSteps: [
        'Browse therapeutic templates',
        'Create healing visualizations', 
        'Design crisis support materials',
        'Share wellness journey graphics'
      ],
      support: 'These design tools complement your healing journey and can be shared with your support network'
    });

  } catch (error) {
    console.error('Canva OAuth callback error:', error);
    res.status(500).json({ 
      error: 'Unable to complete Canva healing integration',
      healingSupport: 'Canva design tools are available to support your wellness journey. Please try again.',
      alternative: 'You can access other healing tools while we resolve this integration',
      crisisSupport: 'If you need immediate support, please call 988 or use our crisis resources'
    });
  }
}

// Get therapeutic templates for healing
export async function getTherapeuticTemplatesHandler(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Please login to access healing design tools',
        healingSupport: 'Login to access therapeutic design templates for your wellness journey'
      });
    }

    // Check if user has Canva integration
    const [integration] = await db.query(`
      SELECT * FROM user_integrations 
      WHERE user_id = ? AND integration_type = 'canva' AND access_token IS NOT NULL
    `, [req.user.id]);

    if (!integration) {
      return res.json({
        templates: THERAPEUTIC_TEMPLATES,
        healingMessage: 'Browse our therapeutic design templates. Connect with Canva to customize them for your healing journey.',
        connectCanva: true,
        healingIntent: 'These templates are designed to support emotional wellness and healing'
      });
    }

    // Return templates with user customization data
    const userTemplates = THERAPEUTIC_TEMPLATES.map(template => ({
      ...template,
      userCustomizable: true,
      healingApplications: getHealingApplications(template.id),
      customizationTips: getCustomizationTips(template.id)
    }));

    res.json({
      templates: userTemplates,
      healingMessage: 'Your therapeutic design toolkit is ready. Create healing visuals that support your wellness journey.',
      canvaConnected: true,
      healingApplications: 'Use these designs for daily affirmations, crisis support, mood tracking, and sharing hope with others'
    });

  } catch (error) {
    console.error('Therapeutic templates error:', error);
    res.status(500).json({ 
      error: 'Unable to load healing design templates',
      healingSupport: 'Therapeutic design tools are available to support your wellness. Please try again.',
      fallbackTemplates: THERAPEUTIC_TEMPLATES,
      alternative: 'Browse our healing templates while we resolve this issue'
    });
  }
}

// Helper functions for healing applications
function getHealingApplications(templateId) {
  const applications = {
    'crisis_support_card': [
      'Keep in wallet for emergency reference',
      'Share with trusted friends/family',
      'Use as daily reminder of support available',
      'Post in visible location as safety reminder'
    ],
    'self_love_affirmations': [
      'Place on bathroom mirror for daily viewing',
      'Set as phone wallpaper for regular reminders',
      'Share on social media to spread positivity',
      'Print multiple copies for different locations'
    ],
    'wellness_tracker': [
      'Update weekly to track healing progress',
      'Use to identify patterns and triggers',
      'Share with therapist or support group',
      'Celebrate small wins and improvements'
    ],
    'mindfulness_poster': [
      'Hang in meditation or yoga space',
      'Use as guide during mindfulness practice',
      'Share with mindfulness group',
      'Place in workspace for stress relief'
    ]
  };

  return applications[templateId] || ['Use to support your healing journey', 'Share with your support network'];
}

function getCustomizationTips(templateId) {
  const tips = {
    'crisis_support_card': [
      'Add your personal crisis contacts',
      'Include your therapist information',
      'Add specific affirmations that help you',
      'Use colors that feel calming to you'
    ],
    'self_love_affirmations': [
      'Write affirmations in your own words',
      'Include your name for personal connection',
      'Use your favorite colors',
      'Add images that bring you comfort'
    ],
    'wellness_tracker': [
      'Customize metrics that matter to you',
      'Add your personal wellness goals',
      'Use your preferred color scheme',
      'Include inspiring quotes or images'
    ],
    'mindfulness_poster': [
      'Add your favorite mindfulness quotes',
      'Use colors that promote calm',
      'Include your personal mindfulness routine',
      'Add images of peaceful places'
    ]
  };

  return tips[templateId] || ['Make it personal to your healing journey', 'Use colors and images that bring you comfort'];
}
