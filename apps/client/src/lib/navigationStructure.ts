/**
 * Unified Navigation Structure
 * Central source of truth for all navigation across desktop and mobile
 */

import { 
  Home, MessageCircle, Heart, BookOpen, Info, Phone, CreditCard, 
  Palette, Zap, Briefcase, BarChart3, Calendar, Activity, Settings,
  type LucideIcon
} from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  category: 'core' | 'professional' | 'tools' | 'system';
  mobileVisible: boolean;
  description?: string;
}

export interface NavCategory {
  id: string;
  label: string;
  items: NavItem[];
}

/**
 * All navigation items in the application
 * Single source of truth for both desktop and mobile navigation
 */
export const allNavItems: NavItem[] = [
  // CORE FEATURES (Primary mental health tools)
  {
    path: '/',
    label: 'Dashboard',
    icon: Home,
    category: 'core',
    mobileVisible: true,
    description: 'Your mental health overview'
  },
  {
    path: '/chat',
    label: 'AI Chat',
    icon: MessageCircle,
    category: 'core',
    mobileVisible: true,
    description: 'Talk to your AI therapist'
  },
  {
    path: '/mood',
    label: 'Mood Tracker',
    icon: Heart,
    category: 'core',
    mobileVisible: true,
    description: 'Track your daily mood'
  },
  {
    path: '/journal',
    label: 'Journal',
    icon: BookOpen,
    category: 'core',
    mobileVisible: true,
    description: 'Private journaling space'
  },

  // PROFESSIONAL TOOLS (Content creation & analytics)
  {
    path: '/studio',
    label: 'Content Studio',
    icon: Briefcase,
    category: 'professional',
    mobileVisible: false,
    description: 'Create and manage content'
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    category: 'professional',
    mobileVisible: false,
    description: 'Content performance insights'
  },
  {
    path: '/social',
    label: 'Social Calendar',
    icon: Calendar,
    category: 'professional',
    mobileVisible: false,
    description: 'Schedule social media posts'
  },
  {
    path: '/productivity',
    label: 'Productivity',
    icon: Zap,
    category: 'professional',
    mobileVisible: false,
    description: 'Productivity tools & automation'
  },

  // TOOLS (Design, resources, monitoring)
  {
    path: '/designs',
    label: 'Canva Designs',
    icon: Palette,
    category: 'tools',
    mobileVisible: false,
    description: 'Create stunning visuals'
  },
  {
    path: '/performance',
    label: 'Performance',
    icon: Activity,
    category: 'tools',
    mobileVisible: false,
    description: 'Monitor app performance'
  },
  {
    path: '/resources',
    label: 'Resources',
    icon: Info,
    category: 'tools',
    mobileVisible: false,
    description: 'Helpful mental health resources'
  },
  {
    path: '/crisis',
    label: 'Crisis Support',
    icon: Phone,
    category: 'tools',
    mobileVisible: false,
    description: '24/7 crisis hotlines'
  },

  // SYSTEM (Settings, billing, account)
  {
    path: '/billing',
    label: 'Billing',
    icon: CreditCard,
    category: 'system',
    mobileVisible: false,
    description: 'Manage your subscription'
  },
  {
    path: '/account',
    label: 'Account',
    icon: Settings,
    category: 'system',
    mobileVisible: false,
    description: 'Account settings'
  },
];

/**
 * Get navigation items by category
 */
export function getItemsByCategory(category: NavItem['category']): NavItem[] {
  return allNavItems.filter(item => item.category === category);
}

/**
 * Get all categories with their items
 */
export function getCategorizedNav(): NavCategory[] {
  return [
    {
      id: 'core',
      label: 'Mental Health',
      items: getItemsByCategory('core')
    },
    {
      id: 'professional',
      label: 'Professional Tools',
      items: getItemsByCategory('professional')
    },
    {
      id: 'tools',
      label: 'Tools & Resources',
      items: getItemsByCategory('tools')
    },
    {
      id: 'system',
      label: 'Settings',
      items: getItemsByCategory('system')
    }
  ];
}

/**
 * Get mobile visible items (for bottom bar)
 */
export function getMobileVisibleItems(): NavItem[] {
  return allNavItems.filter(item => item.mobileVisible);
}

/**
 * Get mobile "More" items (grouped by category)
 */
export function getMobileMoreItems(): NavCategory[] {
  const moreItems = allNavItems.filter(item => !item.mobileVisible);
  
  return [
    {
      id: 'professional',
      label: 'Professional',
      items: moreItems.filter(item => item.category === 'professional')
    },
    {
      id: 'tools',
      label: 'Tools',
      items: moreItems.filter(item => item.category === 'tools')
    },
    {
      id: 'system',
      label: 'Settings',
      items: moreItems.filter(item => item.category === 'system')
    }
  ];
}

/**
 * Get desktop navigation items (all except system settings)
 */
export function getDesktopNavItems(): NavItem[] {
  return allNavItems.filter(item => item.category !== 'system');
}

/**
 * Quick action shortcuts for common workflows
 */
export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  description: string;
  color: string;
}

export const quickActions: QuickAction[] = [
  {
    id: 'new-chat',
    label: 'Start Chat',
    icon: MessageCircle,
    path: '/chat',
    description: 'Talk to your AI therapist',
    color: 'bg-blue-500'
  },
  {
    id: 'log-mood',
    label: 'Log Mood',
    icon: Heart,
    path: '/mood',
    description: 'Record how you feel',
    color: 'bg-pink-500'
  },
  {
    id: 'write-journal',
    label: 'Write Journal',
    icon: BookOpen,
    path: '/journal',
    description: 'Capture your thoughts',
    color: 'bg-purple-500'
  },
  {
    id: 'create-content',
    label: 'Create Content',
    icon: Briefcase,
    path: '/studio',
    description: 'Start a new content piece',
    color: 'bg-green-500'
  },
];
