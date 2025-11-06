import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Theme Toggle Component
 * Allows users to switch between light, dark, and system themes
 */

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg" data-testid="theme-toggle">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={theme === value ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setTheme(value)}
          className="gap-2"
          data-testid={`theme-${value}`}
          title={`Switch to ${label} theme`}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
