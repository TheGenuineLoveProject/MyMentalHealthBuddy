import { useState } from "react";
import { Link } from "wouter";
import { MessageSquare, Search, Palette, Brain, Heart, Leaf, Target, FileText, HeartHandshake, Sparkles, Users, Shield, Server, RefreshCw, ArrowRight } from 'lucide-react';
import styles from "../../pages/admin/CommandCenter.module.css";

export default function AIKnowledgeHub() {
  const [aiStatuses, setAiStatuses] = useState({});
  const [checking, setChecking] = useState(false);

  const aiSystems = [
    { id: 'openai', label: 'OpenAI Chat Engine', desc: 'AI-powered wellness conversations with trauma-informed responses', endpoint: '/api/ai/history', icon: MessageSquare, color: '#10a37f', capability: 'Conversation AI, emotional guidance, crisis detection' },
    { id: 'perplexity', label: 'Perplexity AI (Factual)', desc: 'Evidence-based factual research for content validation', endpoint: '/api/perplexity', icon: Search, color: '#1da1f2', capability: 'Fact-checking, research synthesis, content validation' },
    { id: 'canva', label: 'Canva AI Design', desc: 'Visual content creation and brand-aligned design tools', endpoint: '/api/canva-oauth', icon: Palette, color: '#7d2ae8', capability: 'Brand templates, social graphics, visual identity' },
    { id: 'codex', label: 'Codex Knowledge Base', desc: 'Platform intelligence, self-repair diagnostics, and optimization engine', endpoint: '/api/integrations', icon: Brain, color: '#f59e0b', capability: 'Health diagnostics, route validation, remediation' },
  ];

  const knowledgeAreas = [
    { label: 'Wellness Tools', count: 10, href: '/admin/tools', icon: Heart, desc: 'Mood, journal, gratitude, reflection' },
    { label: 'Intelligence APIs', count: 14, href: '/admin/tools', icon: Brain, desc: 'Wisdom, cognitive, deep learning' },
    { label: 'Healing Protocols', count: 11, href: '/admin/tools', icon: Leaf, desc: 'Trauma, emotional, holistic' },
    { label: 'Mastery & Purpose', count: 13, href: '/admin/tools', icon: Target, desc: 'Self-mastery, performance, values' },
    { label: 'Content Pipeline', count: 12, href: '/admin/tools', icon: FileText, desc: 'Studio, blog, newsletter, social, feeds' },
    { label: 'Relational & Social', count: 8, href: '/admin/tools', icon: HeartHandshake, desc: 'Relationships, community, empathy' },
    { label: 'Advanced Intelligence', count: 11, href: '/admin/tools', icon: Sparkles, desc: 'Consciousness, spiritual, ethical' },
    { label: 'User & Engagement', count: 13, href: '/admin/tools', icon: Users, desc: 'Accounts, gamification, feedback' },
    { label: 'Admin Systems', count: 15, href: '/admin/tools', icon: Shield, desc: 'Security, audit, analytics, storage' },
    { label: 'Infrastructure', count: 20, href: '/admin/tools', icon: Server, desc: 'Auth, billing, email, webhooks' },
  ];

  const totalToolCount = knowledgeAreas.reduce((sum, a) => sum + a.count, 0);

  const checkAISystems = async () => {
    setChecking(true);
    const results = {};
    for (const sys of aiSystems) {
      try {
        const start = performance.now();
        const res = await fetch(sys.endpoint, { credentials: 'include' });
        const ms = Math.round(performance.now() - start);
        const ok = res.ok || res.status === 401 || res.status === 403 || res.status === 405;
        results[sys.id] = { status: ok ? 'active' : 'issue', ms, code: res.status };
      } catch {
        results[sys.id] = { status: 'offline', ms: 0, code: 0 };
      }
    }
    setAiStatuses(results);
    setChecking(false);
  };

  const activeCount = Object.values(aiStatuses).filter(s => s.status === 'active').length;
  const hasResults = Object.keys(aiStatuses).length > 0;

  return (
    <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleContainer}>
          <Brain className={styles.cardHeaderIcon} />
          <h2 className={styles.cardTitle}>AI Knowledge Hub</h2>
          {hasResults && (
            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 600, background: activeCount === aiSystems.length ? '#dcfce7' : '#fef3c7', color: activeCount === aiSystems.length ? '#16a34a' : '#d97706' }}>
              {activeCount}/{aiSystems.length} AI systems active
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={checkAISystems} disabled={checking} style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} data-testid="button-check-ai-systems">
            <RefreshCw size={10} className={checking ? 'animate-spin' : ''} />
            {checking ? 'Checking...' : 'Check AI'}
          </button>
          <Link href="/admin/tools" style={{ fontSize: '0.75rem', color: 'hsl(var(--primary))', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }} data-testid="link-ai-hub-tools">
            All {totalToolCount} Tools <ArrowRight size={12} />
          </Link>
        </div>
      </div>
      <div style={{ padding: '0 1rem 0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {aiSystems.map(sys => {
            const st = aiStatuses[sys.id];
            const statusColor = st?.status === 'active' ? '#22c55e' : st?.status === 'issue' ? '#eab308' : st?.status === 'offline' ? '#ef4444' : '#94a3b8';
            return (
              <div key={sys.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                padding: '0.75rem', borderRadius: '10px',
                border: `1px solid ${st?.status === 'issue' ? '#fbbf2433' : st?.status === 'offline' ? '#ef444433' : 'rgba(0,0,0,0.08)'}`,
                background: 'rgba(0,0,0,0.015)'
              }} data-testid={`ai-system-${sys.id}`}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${sys.color}15`, flexShrink: 0
                }}>
                  <sys.icon size={18} style={{ color: sys.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {sys.label}
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                    {st && <span style={{ fontSize: '0.6rem', color: '#888' }}>{st.ms}ms</span>}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#888', lineHeight: 1.3, marginBottom: '2px' }}>{sys.desc}</div>
                  <div style={{ fontSize: '0.62rem', color: '#aaa', lineHeight: 1.2 }}>{sys.capability}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
          {knowledgeAreas.map(area => (
            <Link key={area.label} href={area.href} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.65rem', borderRadius: '8px',
              border: '1px solid rgba(0,0,0,0.06)', background: 'hsl(var(--muted))',
              textDecoration: 'none', color: 'inherit', fontSize: '0.78rem'
            }} data-testid={`knowledge-area-${area.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <area.icon size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500 }}>{area.label}</div>
                <div style={{ fontSize: '0.62rem', color: '#999', lineHeight: 1.2 }}>{area.desc}</div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'hsl(var(--primary))' }}>{area.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
