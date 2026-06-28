import { ShieldCheck } from 'lucide-react';

export default function GroupedHealthOverview({ toolResults, toolCategories }) {
  const allTools = toolCategories.flatMap(c => c.tools);
  const checkedCount = Object.keys(toolResults).length;
  if (checkedCount === 0) return null;

  return (
    <div>
      <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
        <ShieldCheck size={12} /> Component Health Matrix
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'AI/Wellness', tools: allTools.filter(t => ['ai-chat','therapy','mood-tracker','journal','gratitude','reflection','wellness-tools','mirror','prompts','states'].includes(t.id)), color: 'text-purple-600' },
          { label: 'Healing', tools: allTools.filter(t => t.id.includes('healing') || t.id.includes('trauma') || t.id.includes('emotional') || t.id === 'mind-body' || t.id === 'post-trauma' || t.id === 'psychological-safety'), color: 'text-pink-600' },
          { label: 'Intelligence', tools: allTools.filter(t => t.id.includes('wisdom') || t.id.includes('cognitive') || t.id.includes('consciousness') || t.id.includes('philosophy') || t.id === 'metacognition' || t.id === 'creativity' || t.id === 'foresight' || t.id === 'knowledge' || t.id === 'deep-learning' || t.id === 'dialectics'), color: 'text-indigo-600' },
          { label: 'Content', tools: allTools.filter(t => t.id.includes('content') || t.id.includes('blog') || t.id.includes('newsletter') || t.id.includes('social') || t.id.includes('narrative') || t.id === 'rss-alt' || t.id === 'rss-feed' || t.id === 'perplexity'), color: 'text-cyan-600' },
          { label: 'Auth/Security', tools: allTools.filter(t => t.id.includes('auth') || t.id.includes('login') || t.id.includes('mfa') || t.id.includes('security') || t.id === 'admin-audit'), color: 'text-red-600' },
          { label: 'Billing', tools: allTools.filter(t => t.id.includes('billing') || t.id === 'webhook' || t.id === 'products' || t.id === 'pro-features' || t.id === 'leads'), color: 'text-green-600' },
          { label: 'Platform', tools: allTools.filter(t => t.id.includes('health') || t.id.includes('api-core') || t.id.includes('deployment') || t.id.includes('integration') || t.id.includes('object') || t.id === 'analytics' || t.id === 'metrics' || t.id === 'soft-launch'), color: 'text-emerald-600' },
          { label: 'User/Engage', tools: allTools.filter(t => t.id.includes('account') || t.id.includes('gamification') || t.id.includes('progress') || t.id.includes('badges') || t.id.includes('favorites') || t.id.includes('onboarding') || t.id.includes('feedback') || t.id.includes('dashboard') || t.id.includes('user')), color: 'text-amber-600' },
        ].map((group, gi) => {
          const groupHealthy = group.tools.filter(t => toolResults[t.id]?.status === 'healthy').length;
          const groupErrors = group.tools.filter(t => toolResults[t.id]?.status === 'error').length;
          const groupChecked = group.tools.filter(t => toolResults[t.id]).length;
          const pct = groupChecked > 0 ? Math.round((groupHealthy / groupChecked) * 100) : 0;
          return (
            <div key={gi} className="p-2.5 rounded-lg bg-background border border-gray-100 dark:border-gray-800" data-testid={`matrix-${gi}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${group.color}`}>{group.label}</span>
                <span className={`text-xs font-bold ${pct >= 90 ? 'text-green-600' : pct >= 60 ? 'text-amber-500' : groupChecked === 0 ? 'text-gray-400' : 'text-red-500'}`}>{groupChecked > 0 ? `${pct}%` : '—'}</span>
              </div>
              <div className="text-xs text-muted-foreground">{groupHealthy}/{group.tools.length} healthy{groupErrors > 0 ? ` · ${groupErrors} err` : ''}</div>
              <div className="w-full h-1 rounded-full bg-gray-200 dark:bg-gray-700 mt-1 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${groupChecked > 0 ? (groupHealthy / group.tools.length) * 100 : 0}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
