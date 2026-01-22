# Visual Doctor Report

**Generated:** 2026-01-22T05:09:55.217Z  
**Status:** ❌ FAIL

## Summary

| Metric | Count |
|--------|-------|
| Total Files Scanned | 319 |
| Clean Files | 307 |
| Files with Violations | 12 |
| Total Violations | 660 |
| Hex Color Violations | 405 |
| Font Violations | 10 |
| Inline Style Violations | 245 |

## Rules

### Hex Colors
- All colors must use CSS variables from `brand-tokens.css`
- Allowed exceptions: `#fff`, `#000`, `#ffffff`, `#000000`
- Token files (`brand-tokens.css`, `tokens.css`) are exempt

### Fonts
- Only Inter + Playfair Display + system fallbacks are allowed
- Font definitions must be in CSS files only

### Inline Styles
- Inline hex colors are disallowed in JSX/TSX files
- Allowlisted: CSS variables (`var(--glp-...)`) and layout numeric styles

## Violations

### `client/src/pages/CRMPage.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 27 | hex | `#eac33b` | { label: 'Current Streak', value: '7 days', icon: Activity, color: 'text-[#eac33 |
| 28 | hex | `#8fbf9f` | { label: 'Mood Trend', value: '+15%', icon: TrendingUp, color: 'text-[#8fbf9f]'  |
| 29 | hex | `#f4c7c3` | { label: 'Sessions', value: '23', icon: Heart, color: 'text-[#f4c7c3]' }, |
| 30 | hex | `#2f5d5d` | { label: 'XP Earned', value: '1,250', icon: Star, color: 'text-[#2f5d5d]' }, |
| 41 | hex | `#faf9f7` | <div className="min-h-screen bg-[#faf9f7]" data-testid="crm-page"> |
| 48 | hex | `#2f5d5d` | <span className="font-semibold text-[#2f5d5d]">Dashboard</span> |
| 51 | hex | `#3a3a3a` | <Link href="/dashboard" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]"> |
| 51 | hex | `#2f5d5d` | <Link href="/dashboard" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]"> |
| 52 | hex | `#3a3a3a` | <Link href="/journal" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Jo |
| 52 | hex | `#2f5d5d` | <Link href="/journal" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Jo |
| 53 | hex | `#3a3a3a` | <Link href="/mood" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Mood< |
| 53 | hex | `#2f5d5d` | <Link href="/mood" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Mood< |
| 54 | hex | `#3a3a3a` | <Link href="/tools" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Tool |
| 54 | hex | `#2f5d5d` | <Link href="/tools" className="text-sm text-[#3a3a3a] hover:text-[#2f5d5d]">Tool |
| 58 | hex | `#3a3a3a` | <button className="p-2 text-[#3a3a3a] hover:text-[#2f5d5d]" data-testid="button- |
| 58 | hex | `#2f5d5d` | <button className="p-2 text-[#3a3a3a] hover:text-[#2f5d5d]" data-testid="button- |
| 61 | hex | `#3a3a3a` | <button className="p-2 text-[#3a3a3a] hover:text-[#2f5d5d]" data-testid="button- |
| 61 | hex | `#2f5d5d` | <button className="p-2 text-[#3a3a3a] hover:text-[#2f5d5d]" data-testid="button- |
| 64 | hex | `#8fbf9f` | <div className="h-8 w-8 rounded-full bg-[#8fbf9f] flex items-center justify-cent |
| 74 | hex | `#2f5d5d` | <h1 className="text-2xl font-bold text-[#2f5d5d] mb-2">Welcome Back</h1> |
| 75 | hex | `#3a3a3a` | <p className="text-[#3a3a3a] opacity-70">Your personal wellness dashboard</p> |
| 87 | hex | `#3a3a3a` | <span className="text-sm text-[#3a3a3a] opacity-70">{stat.label}</span> |
| 89 | hex | `#2f5d5d` | <p className="text-2xl font-bold text-[#2f5d5d]">{stat.value}</p> |
| 98 | hex | `#2f5d5d` | <h2 className="text-lg font-semibold text-[#2f5d5d] flex items-center gap-2"> |
| 104 | hex | `#8fbf9f` | className="text-sm text-[#8fbf9f] hover:underline flex items-center gap-1" |
| 116 | hex | `#eac33b` | ? 'border-l-[#eac33b] bg-[#eac33b]/10' |
| 116 | hex | `#eac33b` | ? 'border-l-[#eac33b] bg-[#eac33b]/10' |
| 118 | hex | `#f4c7c3` | ? 'border-l-[#f4c7c3] bg-[#f4c7c3]/20' |
| 118 | hex | `#f4c7c3` | ? 'border-l-[#f4c7c3] bg-[#f4c7c3]/20' |
| 119 | hex | `#8fbf9f` | : 'border-l-[#8fbf9f] bg-[#8fbf9f]/10' |
| 119 | hex | `#8fbf9f` | : 'border-l-[#8fbf9f] bg-[#8fbf9f]/10' |
| 123 | hex | `#3a3a3a` | <Clock className="h-4 w-4 text-[#3a3a3a] opacity-50" /> |
| 124 | hex | `#3a3a3a` | <span className="text-sm text-[#3a3a3a] opacity-60 w-20">{event.time}</span> |
| 125 | hex | `#2f5d5d` | <span className="font-medium text-[#2f5d5d] flex-1">{event.title}</span> |
| 127 | hex | `#eac33b` | <span className="px-2 py-1 bg-[#eac33b] text-[#2f5d5d] text-xs font-semibold rou |
| 127 | hex | `#2f5d5d` | <span className="px-2 py-1 bg-[#eac33b] text-[#2f5d5d] text-xs font-semibold rou |
| 137 | hex | `#2f5d5d` | <h2 className="text-lg font-semibold text-[#2f5d5d] mb-4 flex items-center gap-2 |
| 146 | hex | `#faf9f7` | className="flex items-center gap-3 p-4 rounded-lg bg-[#faf9f7] hover:bg-[#8fbf9f |
| 146 | hex | `#8fbf9f` | className="flex items-center gap-3 p-4 rounded-lg bg-[#faf9f7] hover:bg-[#8fbf9f |
| 149 | hex | `#8fbf9f` | <action.icon className="h-5 w-5 text-[#8fbf9f]" /> |
| 150 | hex | `#2f5d5d` | <span className="font-medium text-[#2f5d5d]">{action.label}</span> |
| 160 | hex | `#2f5d5d` | <h2 className="text-lg font-semibold text-[#2f5d5d] flex items-center gap-2"> |
| 164 | hex | `#f4c7c3` | <span className="px-2 py-1 bg-[#f4c7c3] text-[#2f5d5d] text-xs font-semibold rou |
| 164 | hex | `#2f5d5d` | <span className="px-2 py-1 bg-[#f4c7c3] text-[#2f5d5d] text-xs font-semibold rou |
| 176 | hex | `#eac33b` | notification.read ? 'bg-gray-300' : 'bg-[#eac33b]' |
| 179 | hex | `#3a3a3a` | <p className="text-sm text-[#3a3a3a]">{notification.text}</p> |
| 180 | hex | `#3a3a3a` | <span className="text-xs text-[#3a3a3a] opacity-50">{notification.time}</span> |
| 187 | hex | `#2f5d5d` | <div className="bg-gradient-to-br from-[#2f5d5d] to-[#1a3a3a] rounded-xl p-6 tex |
| 187 | hex | `#1a3a3a` | <div className="bg-gradient-to-br from-[#2f5d5d] to-[#1a3a3a] rounded-xl p-6 tex |
| 189 | hex | `#eac33b` | <Star className="h-5 w-5 text-[#eac33b]" /> |
| 199 | hex | `#2f5d5d` | <h2 className="text-lg font-semibold text-[#2f5d5d] mb-4 flex items-center gap-2 |
| 208 | hex | `#8fbf9f` | className="w-8 h-8 rounded-full bg-[#8fbf9f] border-2 border-white flex items-ce |
| 214 | hex | `#3a3a3a` | <span className="text-sm text-[#3a3a3a]">+128 online</span> |
| 218 | hex | `#8fbf9f` | className="block w-full py-2 text-center bg-[#8fbf9f]/10 text-[#2f5d5d] rounded- |
| 218 | hex | `#2f5d5d` | className="block w-full py-2 text-center bg-[#8fbf9f]/10 text-[#2f5d5d] rounded- |
| 218 | hex | `#8fbf9f` | className="block w-full py-2 text-center bg-[#8fbf9f]/10 text-[#2f5d5d] rounded- |
| 230 | hex | `#3a3a3a` | <div className="flex flex-wrap justify-center gap-6 text-sm text-[#3a3a3a] opaci |

### `client/src/pages/Dashboard.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 141 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 141 | hex | `#eac33b` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 141 | hex | `#f4c7c3` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 147 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 147 | hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 162 | hex | `#2f5d5d` | background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)', |
| 162 | hex | `#8fbf9f` | background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)', |
| 178 | hex | `#eac33b` | <MessageCircle className="w-6 h-6" style={{ color: '#eac33b' }} aria-hidden="tru |
| 186 | hex | `#f4c7c3` | <Heart className="w-6 h-6" style={{ color: '#f4c7c3' }} aria-hidden="true" /> |
| 194 | hex | `#2f5d5d` | <Brain className="w-6 h-6" style={{ color: '#2f5d5d' }} aria-hidden="true" /> |
| 141 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 141 | inline-hex | `#eac33b` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 141 | inline-hex | `#f4c7c3` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 147 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 147 | inline-hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 178 | inline-hex | `#eac33b` | <MessageCircle className="w-6 h-6" style={{ color: '#eac33b' }} aria-hidden="tru |
| 186 | inline-hex | `#f4c7c3` | <Heart className="w-6 h-6" style={{ color: '#f4c7c3' }} aria-hidden="true" /> |
| 194 | inline-hex | `#2f5d5d` | <Brain className="w-6 h-6" style={{ color: '#2f5d5d' }} aria-hidden="true" /> |

### `client/src/pages/DesignSystem.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 17 | hex | `#8fbf9f` | { name: "Sage Green", hex: "#8fbf9f", usage: "Primary accents, success states, n |
| 18 | hex | `#f4c7c3` | { name: "Rose/Blush", hex: "#f4c7c3", usage: "Soft highlights, feminine touches, |
| 19 | hex | `#2f5d5d` | { name: "Deep Teal", hex: "#2f5d5d", usage: "Primary text, headers, buttons, tru |
| 20 | hex | `#faf9f7` | { name: "Cream/Ivory", hex: "#faf9f7", usage: "Backgrounds, cards, clean spaces" |
| 21 | hex | `#3a3a3a` | { name: "Charcoal", hex: "#3a3a3a", usage: "Body text, secondary content" }, |
| 22 | hex | `#eac33b` | { name: "Warm Gold", hex: "#eac33b", usage: "CTAs, highlights, premium features" |
| 211 | hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)' }}> |
| 211 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)' }}> |
| 215 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #f4c7c3)', color: 'var(-- |
| 215 | hex | `#f4c7c3` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #f4c7c3)', color: 'var(-- |
| 219 | hex | `#eac33b` | style={{ background: 'linear-gradient(135deg, #eac33b, #f4c7c3)', color: 'var(-- |
| 219 | hex | `#f4c7c3` | style={{ background: 'linear-gradient(135deg, #eac33b, #f4c7c3)', color: 'var(-- |
| 307 | hex | `#2f5d5d` | • Gradient: linear-gradient(135deg, #2f5d5d, #8fbf9f)<br/> |
| 307 | hex | `#8fbf9f` | • Gradient: linear-gradient(135deg, #2f5d5d, #8fbf9f)<br/> |
| 323 | hex | `#2f5d5d` | • Border: 2px solid #2f5d5d<br/> |
| 324 | hex | `#2f5d5d` | • Hover: fill with #2f5d5d, text white |
| 358 | hex | `#e57373` | borderColor: '#e57373', |
| 363 | hex | `#e57373` | <p className="text-sm mt-1" style={{ color: '#e57373' }}>Please enter a valid em |
| 373 | hex | `#8fbf9f` | • Border-color: #8fbf9f<br/> |
| 376 | hex | `#e57373` | • Border-color: #e57373<br/> |
| 772 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 772 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1034 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 1034 | hex | `#eac33b` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 1034 | hex | `#f4c7c3` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 1039 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 1039 | hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 1064 | hex | `#eac33b` | { label: "Q&A Community", color: "#eac33b", bg: "rgba(234, 195, 59, 0.15)" }, |
| 1065 | hex | `#f4c7c3` | { label: "Crisis Support", color: "#f4c7c3", bg: "rgba(244, 199, 195, 0.3)" }, |
| 1066 | hex | `#2f5d5d` | { label: "Tools Library", color: "#2f5d5d", bg: "rgba(47, 93, 93, 0.1)" } |
| 1085 | hex | `#b8941e` | <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm f |
| 1088 | hex | `#2f5d5d` | <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm f |
| 1091 | hex | `#8b5a5a` | <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm f |
| 1452 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 1452 | hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 211 | inline-hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)' }}> |
| 211 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)' }}> |
| 215 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #f4c7c3)', color: 'var(-- |
| 215 | inline-hex | `#f4c7c3` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #f4c7c3)', color: 'var(-- |
| 219 | inline-hex | `#eac33b` | style={{ background: 'linear-gradient(135deg, #eac33b, #f4c7c3)', color: 'var(-- |
| 219 | inline-hex | `#f4c7c3` | style={{ background: 'linear-gradient(135deg, #eac33b, #f4c7c3)', color: 'var(-- |
| 363 | inline-hex | `#e57373` | <p className="text-sm mt-1" style={{ color: '#e57373' }}>Please enter a valid em |
| 772 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 772 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1034 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 1034 | inline-hex | `#eac33b` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 1034 | inline-hex | `#f4c7c3` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 1039 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 1039 | inline-hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 1085 | inline-hex | `#b8941e` | <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm f |
| 1088 | inline-hex | `#2f5d5d` | <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm f |
| 1091 | inline-hex | `#8b5a5a` | <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm f |
| 1452 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 1452 | inline-hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |

### `client/src/pages/Onboarding.tsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 16 | hex | `#f4c7c3` | color: "#f4c7c3" |
| 22 | hex | `#8fbf9f` | color: "#8fbf9f" |
| 28 | hex | `#eac33b` | color: "#eac33b" |

### `client/src/pages/WireframeTemplates.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 71 | hex | `#8fbf9f` | <Heart className="w-6 h-6" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 72 | hex | `#2f5d5d` | <span className="font-serif font-bold text-xl" style={{ color: '#2f5d5d' }}> |
| 89 | hex | `#2f5d5d` | background: viewMode === mode.id ? '#2f5d5d' : 'white', |
| 90 | hex | `#3a3a3a` | color: viewMode === mode.id ? 'white' : '#3a3a3a' |
| 103 | hex | `#2f5d5d` | style={{ background: '#2f5d5d', color: 'white' }} |
| 126 | hex | `#3a3a3a` | <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-4" style={{ co |
| 138 | hex | `#2f5d5d` | color: activeTemplate === template.id ? '#2f5d5d' : '#3a3a3a', |
| 138 | hex | `#3a3a3a` | color: activeTemplate === template.id ? '#2f5d5d' : '#3a3a3a', |
| 153 | hex | `#3a3a3a` | <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-4" style={{ co |
| 169 | hex | `#2f5d5d` | background: deviceView === device.id ? '#2f5d5d' : 'rgba(47, 93, 93, 0.05)', |
| 170 | hex | `#3a3a3a` | color: deviceView === device.id ? 'white' : '#3a3a3a' |
| 216 | hex | `#2f5d5d` | <h1 className="text-3xl font-serif font-bold" style={{ color: '#2f5d5d' }}> |
| 225 | hex | `#3a3a3a` | <p className="mt-2" style={{ color: '#3a3a3a', opacity: 0.7 }}> |
| 232 | hex | `#2f5d5d` | style={{ background: 'rgba(47, 93, 93, 0.1)', color: '#2f5d5d' }} |
| 240 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 240 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 262 | hex | `#faf9f7` | background: '#faf9f7' |
| 299 | hex | `#8fbf9f` | <div className="w-8 h-8 rounded-full" style={{ background: '#8fbf9f' }} data-slo |
| 300 | hex | `#2f5d5d` | <span className="font-bold" style={{ color: '#2f5d5d' }} data-slot="brand-name"> |
| 303 | hex | `#3a3a3a` | <a href="#features" className="hover:opacity-70" style={{ color: '#3a3a3a' }} da |
| 304 | hex | `#3a3a3a` | <a href="#about" className="hover:opacity-70" style={{ color: '#3a3a3a' }} data- |
| 305 | hex | `#3a3a3a` | <a href="#testimonials" className="hover:opacity-70" style={{ color: '#3a3a3a' } |
| 308 | hex | `#2f5d5d` | <button className="text-sm" style={{ color: '#2f5d5d' }} data-testid="button-log |
| 311 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 311 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 331 | hex | `#8B7023` | style={{ background: 'rgba(234, 195, 59, 0.2)', color: '#8B7023' }} |
| 339 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 346 | hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.8 }} |
| 354 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 354 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 361 | hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 361 | hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 380 | hex | `#2f5d5d` | <span className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>10k+</span> |
| 381 | hex | `#3a3a3a` | <span className="text-sm ml-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>Member |
| 385 | hex | `#2f5d5d` | <span className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>4.9★</span> |
| 386 | hex | `#3a3a3a` | <span className="text-sm ml-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>Rating |
| 390 | hex | `#2f5d5d` | <span className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>50+</span> |
| 391 | hex | `#3a3a3a` | <span className="text-sm ml-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>Healin |
| 406 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 426 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 426 | hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 431 | hex | `#2f5d5d` | <h3 className="font-semibold mb-2" style={{ color: '#2f5d5d' }} data-slot="title |
| 432 | hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="des |
| 451 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 455 | hex | `#3a3a3a` | <p className="mb-6" style={{ color: '#3a3a3a', opacity: 0.7 }}> |
| 475 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 475 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 481 | hex | `#3a3a3a` | <p className="text-xs mt-4" style={{ color: '#3a3a3a', opacity: 0.5 }}> |
| 498 | hex | `#8fbf9f` | <Heart className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 499 | hex | `#2f5d5d` | <span style={{ color: '#2f5d5d' }}>© 2026 The Genuine Love Project</span> |
| 502 | hex | `#3a3a3a` | <a href="#privacy" style={{ color: '#3a3a3a' }} data-testid="link-privacy">Priva |
| 503 | hex | `#3a3a3a` | <a href="#terms" style={{ color: '#3a3a3a' }} data-testid="link-terms">Terms</a> |
| 504 | hex | `#3a3a3a` | <a href="#contact" style={{ color: '#3a3a3a' }} data-testid="link-contact">Conta |
| 541 | hex | `#8fbf9f` | background: step <= 2 ? '#8fbf9f' : 'rgba(143, 191, 159, 0.2)', |
| 542 | hex | `#3a3a3a` | color: step <= 2 ? 'white' : '#3a3a3a' |
| 551 | hex | `#8fbf9f` | style={{ background: step < 2 ? '#8fbf9f' : 'rgba(143, 191, 159, 0.2)' }} |
| 570 | hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |
| 577 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 582 | hex | `#3a3a3a` | <p className="mb-8" style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="helper |
| 606 | hex | `#8fbf9f` | border: option.selected ? '2px solid #8fbf9f' : '2px solid rgba(143, 191, 159, 0 |
| 613 | hex | `#2f5d5d` | style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }} |
| 613 | hex | `#3a3a3a` | style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }} |
| 618 | hex | `#2f5d5d` | style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }} |
| 618 | hex | `#3a3a3a` | style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }} |
| 630 | hex | `#3a3a3a` | style={{ background: 'transparent', color: '#3a3a3a', border: '1px solid rgba(47 |
| 637 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 637 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 650 | hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.6 }} |
| 682 | hex | `#8fbf9f` | <Heart className="w-6 h-6" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 683 | hex | `#2f5d5d` | <span className="font-bold" style={{ color: '#2f5d5d' }}>TGLP</span> |
| 700 | hex | `#2f5d5d` | color: item.active ? '#2f5d5d' : '#3a3a3a' |
| 700 | hex | `#3a3a3a` | color: item.active ? '#2f5d5d' : '#3a3a3a' |
| 727 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 727 | hex | `#eac33b` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 727 | hex | `#f4c7c3` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 733 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 733 | hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 739 | hex | `#2f5d5d` | <h2 id="daily-focus-heading" className="text-xl font-bold" style={{ color: '#2f5 |
| 742 | hex | `#3a3a3a` | <p style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="message"> |
| 758 | hex | `#eac33b` | { icon: MessageCircle, label: "Q&A Community", color: "#eac33b", bg: "rgba(234,  |
| 759 | hex | `#f4c7c3` | { icon: AlertCircle, label: "Crisis Support", color: "#f4c7c3", bg: "rgba(244, 1 |
| 760 | hex | `#2f5d5d` | { icon: Zap, label: "Tools Library", color: "#2f5d5d", bg: "rgba(47, 93, 93, 0.1 |
| 774 | hex | `#3a3a3a` | <span className="font-medium text-sm" style={{ color: '#3a3a3a' }}>{item.label}< |
| 786 | hex | `#2f5d5d` | <h3 id="activity-heading" className="font-semibold mb-4" style={{ color: '#2f5d5 |
| 805 | hex | `#8fbf9f` | <Clock className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 808 | hex | `#2f5d5d` | <p className="font-medium text-sm" style={{ color: '#2f5d5d' }}>{activity.desc}< |
| 809 | hex | `#3a3a3a` | <p className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{activity.type |
| 834 | hex | `#2f5d5d` | <h1 className="text-2xl font-serif font-bold" style={{ color: '#2f5d5d' }}>CRM D |
| 835 | hex | `#3a3a3a` | <p style={{ color: '#3a3a3a', opacity: 0.7 }}>User management and engagement ana |
| 839 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 839 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 865 | hex | `#3a3a3a` | <p className="text-sm mb-1" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.lab |
| 866 | hex | `#2f5d5d` | <p className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p> |
| 869 | hex | `#059669` | style={{ color: stat.up ? '#059669' : '#dc2626' }} |
| 869 | hex | `#dc2626` | style={{ color: stat.up ? '#059669' : '#dc2626' }} |
| 886 | hex | `#2f5d5d` | <h3 id="users-heading" className="font-semibold" style={{ color: '#2f5d5d' }}>Re |
| 894 | hex | `#3a3a3a` | <Filter className="w-4 h-4" style={{ color: '#3a3a3a' }} aria-hidden="true" /> |
| 902 | hex | `#3a3a3a` | <Search className="w-4 h-4" style={{ color: '#3a3a3a' }} aria-hidden="true" /> |
| 909 | hex | `#2f5d5d` | <th className="text-left p-4" style={{ color: '#2f5d5d' }}>User</th> |
| 910 | hex | `#2f5d5d` | <th className="text-left p-4" style={{ color: '#2f5d5d' }}>Status</th> |
| 911 | hex | `#2f5d5d` | <th className="text-left p-4" style={{ color: '#2f5d5d' }}>Last Active</th> |
| 912 | hex | `#2f5d5d` | <th className="text-left p-4" style={{ color: '#2f5d5d' }}>Actions</th> |
| 924 | hex | `#8fbf9f` | <div className="w-8 h-8 rounded-full" style={{ background: '#8fbf9f' }} /> |
| 926 | hex | `#2f5d5d` | <p className="font-medium" style={{ color: '#2f5d5d' }}>{user.name}</p> |
| 927 | hex | `#3a3a3a` | <p className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{user.email}</ |
| 936 | hex | `#8B7023` | color: user.status === 'Premium' ? '#8B7023' : '#2f5d5d' |
| 936 | hex | `#2f5d5d` | color: user.status === 'Premium' ? '#8B7023' : '#2f5d5d' |
| 942 | hex | `#3a3a3a` | <td className="p-4" style={{ color: '#3a3a3a' }}>{user.time}</td> |
| 949 | hex | `#3a3a3a` | <Eye className="w-4 h-4" style={{ color: '#3a3a3a' }} aria-hidden="true" /> |
| 974 | hex | `#2f5d5d` | <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2f5d5d' }}> |
| 975 | hex | `#3a3a3a` | <p className="mb-6" style={{ color: '#3a3a3a', opacity: 0.7 }}>Explore healing r |
| 983 | hex | `#3a3a3a` | <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ co |
| 1010 | hex | `#2f5d5d` | background: i === 0 ? '#2f5d5d' : 'rgba(47, 93, 93, 0.05)', |
| 1011 | hex | `#3a3a3a` | color: i === 0 ? 'white' : '#3a3a3a' |
| 1044 | hex | `#2f5d5d` | <FileText className="w-10 h-10" style={{ color: '#2f5d5d', opacity: 0.3 }} aria- |
| 1050 | hex | `#8B7023` | style={{ background: 'rgba(234, 195, 59, 0.2)', color: '#8B7023' }} |
| 1055 | hex | `#3a3a3a` | <span className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{content.ti |
| 1057 | hex | `#2f5d5d` | <h3 className="font-semibold mb-2" style={{ color: '#2f5d5d' }} data-slot="title |
| 1060 | hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |
| 1087 | hex | `#2f5d5d` | <h1 className="text-3xl font-serif font-bold" style={{ color: '#2f5d5d' }}>Q&A C |
| 1088 | hex | `#3a3a3a` | <p style={{ color: '#3a3a3a', opacity: 0.7 }}>Ask questions, share experiences,  |
| 1092 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1092 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1145 | hex | `#8fbf9f` | <TrendingUp className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true"  |
| 1147 | hex | `#2f5d5d` | <span className="font-bold text-sm" style={{ color: '#2f5d5d' }}>{post.votes}</s |
| 1153 | hex | `#f4c7c3` | <div className="w-6 h-6 rounded-full" style={{ background: '#f4c7c3' }} /> |
| 1154 | hex | `#3a3a3a` | <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{post.author} |
| 1158 | hex | `#2f5d5d` | style={{ background: 'rgba(143, 191, 159, 0.2)', color: '#2f5d5d' }} |
| 1163 | hex | `#3a3a3a` | <span className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{post.time} |
| 1165 | hex | `#2f5d5d` | <h3 className="font-semibold mb-1" style={{ color: '#2f5d5d' }} data-slot="post- |
| 1166 | hex | `#3a3a3a` | <p className="text-sm mb-3" style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot |
| 1168 | hex | `#3a3a3a` | <span style={{ color: '#3a3a3a', opacity: 0.6 }}> |
| 1206 | hex | `#8fbf9f` | <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-cen |
| 1206 | hex | `#2f5d5d` | <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-cen |
| 1209 | hex | `#2f5d5d` | <h1 className="text-2xl font-serif font-bold" style={{ color: '#2f5d5d' }}>Welco |
| 1210 | hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.7 }}>Sign in to con |
| 1221 | hex | `#2f5d5d` | <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color |
| 1236 | hex | `#2f5d5d` | <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ co |
| 1255 | hex | `#3a3a3a` | <Eye className="w-5 h-5" style={{ color: '#3a3a3a', opacity: 0.4 }} aria-hidden= |
| 1267 | hex | `#3a3a3a` | <span style={{ color: '#3a3a3a' }}>Remember me</span> |
| 1269 | hex | `#8fbf9f` | <a href="#forgot" className="text-sm" style={{ color: '#8fbf9f' }} data-testid=" |
| 1277 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1277 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1287 | hex | `#3a3a3a` | <span className="text-sm" style={{ color: '#3a3a3a', opacity: 0.5 }}>or continue |
| 1302 | hex | `#DB4437` | <span className="w-5 h-5 rounded-full" style={{ background: '#DB4437' }} aria-hi |
| 1303 | hex | `#3a3a3a` | <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>Google</span> |
| 1310 | hex | `#333` | <span className="w-5 h-5 rounded-full" style={{ background: '#333' }} aria-hidde |
| 1311 | hex | `#3a3a3a` | <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>GitHub</span> |
| 1316 | hex | `#3a3a3a` | <p className="text-center mt-6 text-sm" style={{ color: '#3a3a3a' }}> |
| 1318 | hex | `#2f5d5d` | <a href="#signup" className="font-medium" style={{ color: '#2f5d5d' }} data-test |
| 1601 | hex | `#2f5d5d` | <h2 className="text-2xl font-serif font-bold" style={{ color: '#2f5d5d' }}> |
| 1606 | hex | `#2f5d5d` | style={{ background: '#2f5d5d', color: 'white' }} |
| 1616 | hex | `#1a1a2e` | background: '#1a1a2e', |
| 1617 | hex | `#a0aec0` | color: '#a0aec0', |
| 71 | inline-hex | `#8fbf9f` | <Heart className="w-6 h-6" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 72 | inline-hex | `#2f5d5d` | <span className="font-serif font-bold text-xl" style={{ color: '#2f5d5d' }}> |
| 103 | inline-hex | `#2f5d5d` | style={{ background: '#2f5d5d', color: 'white' }} |
| 126 | inline-hex | `#3a3a3a` | <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-4" style={{ co |
| 153 | inline-hex | `#3a3a3a` | <h2 className="text-xs font-bold uppercase tracking-wider mb-4 px-4" style={{ co |
| 216 | inline-hex | `#2f5d5d` | <h1 className="text-3xl font-serif font-bold" style={{ color: '#2f5d5d' }}> |
| 225 | inline-hex | `#3a3a3a` | <p className="mt-2" style={{ color: '#3a3a3a', opacity: 0.7 }}> |
| 232 | inline-hex | `#2f5d5d` | style={{ background: 'rgba(47, 93, 93, 0.1)', color: '#2f5d5d' }} |
| 240 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 240 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 299 | inline-hex | `#8fbf9f` | <div className="w-8 h-8 rounded-full" style={{ background: '#8fbf9f' }} data-slo |
| 300 | inline-hex | `#2f5d5d` | <span className="font-bold" style={{ color: '#2f5d5d' }} data-slot="brand-name"> |
| 303 | inline-hex | `#3a3a3a` | <a href="#features" className="hover:opacity-70" style={{ color: '#3a3a3a' }} da |
| 304 | inline-hex | `#3a3a3a` | <a href="#about" className="hover:opacity-70" style={{ color: '#3a3a3a' }} data- |
| 305 | inline-hex | `#3a3a3a` | <a href="#testimonials" className="hover:opacity-70" style={{ color: '#3a3a3a' } |
| 308 | inline-hex | `#2f5d5d` | <button className="text-sm" style={{ color: '#2f5d5d' }} data-testid="button-log |
| 311 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 311 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 331 | inline-hex | `#8B7023` | style={{ background: 'rgba(234, 195, 59, 0.2)', color: '#8B7023' }} |
| 339 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 346 | inline-hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.8 }} |
| 354 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 354 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 361 | inline-hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 361 | inline-hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 380 | inline-hex | `#2f5d5d` | <span className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>10k+</span> |
| 381 | inline-hex | `#3a3a3a` | <span className="text-sm ml-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>Member |
| 385 | inline-hex | `#2f5d5d` | <span className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>4.9★</span> |
| 386 | inline-hex | `#3a3a3a` | <span className="text-sm ml-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>Rating |
| 390 | inline-hex | `#2f5d5d` | <span className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>50+</span> |
| 391 | inline-hex | `#3a3a3a` | <span className="text-sm ml-2" style={{ color: '#3a3a3a', opacity: 0.7 }}>Healin |
| 406 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 426 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 426 | inline-hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 431 | inline-hex | `#2f5d5d` | <h3 className="font-semibold mb-2" style={{ color: '#2f5d5d' }} data-slot="title |
| 432 | inline-hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="des |
| 451 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 455 | inline-hex | `#3a3a3a` | <p className="mb-6" style={{ color: '#3a3a3a', opacity: 0.7 }}> |
| 475 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 475 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 481 | inline-hex | `#3a3a3a` | <p className="text-xs mt-4" style={{ color: '#3a3a3a', opacity: 0.5 }}> |
| 498 | inline-hex | `#8fbf9f` | <Heart className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 499 | inline-hex | `#2f5d5d` | <span style={{ color: '#2f5d5d' }}>© 2026 The Genuine Love Project</span> |
| 502 | inline-hex | `#3a3a3a` | <a href="#privacy" style={{ color: '#3a3a3a' }} data-testid="link-privacy">Priva |
| 503 | inline-hex | `#3a3a3a` | <a href="#terms" style={{ color: '#3a3a3a' }} data-testid="link-terms">Terms</a> |
| 504 | inline-hex | `#3a3a3a` | <a href="#contact" style={{ color: '#3a3a3a' }} data-testid="link-contact">Conta |
| 551 | inline-hex | `#8fbf9f` | style={{ background: step < 2 ? '#8fbf9f' : 'rgba(143, 191, 159, 0.2)' }} |
| 570 | inline-hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |
| 577 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 582 | inline-hex | `#3a3a3a` | <p className="mb-8" style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="helper |
| 613 | inline-hex | `#2f5d5d` | style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }} |
| 613 | inline-hex | `#3a3a3a` | style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }} |
| 618 | inline-hex | `#2f5d5d` | style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }} |
| 618 | inline-hex | `#3a3a3a` | style={{ color: option.selected ? '#2f5d5d' : '#3a3a3a' }} |
| 630 | inline-hex | `#3a3a3a` | style={{ background: 'transparent', color: '#3a3a3a', border: '1px solid rgba(47 |
| 637 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 637 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 650 | inline-hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.6 }} |
| 682 | inline-hex | `#8fbf9f` | <Heart className="w-6 h-6" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 683 | inline-hex | `#2f5d5d` | <span className="font-bold" style={{ color: '#2f5d5d' }}>TGLP</span> |
| 727 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 727 | inline-hex | `#eac33b` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 727 | inline-hex | `#f4c7c3` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 733 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 733 | inline-hex | `#2f5d5d` | style={{ background: 'linear-gradient(135deg, #8fbf9f, #2f5d5d)' }} |
| 739 | inline-hex | `#2f5d5d` | <h2 id="daily-focus-heading" className="text-xl font-bold" style={{ color: '#2f5 |
| 742 | inline-hex | `#3a3a3a` | <p style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot="message"> |
| 774 | inline-hex | `#3a3a3a` | <span className="font-medium text-sm" style={{ color: '#3a3a3a' }}>{item.label}< |
| 786 | inline-hex | `#2f5d5d` | <h3 id="activity-heading" className="font-semibold mb-4" style={{ color: '#2f5d5 |
| 805 | inline-hex | `#8fbf9f` | <Clock className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 808 | inline-hex | `#2f5d5d` | <p className="font-medium text-sm" style={{ color: '#2f5d5d' }}>{activity.desc}< |
| 809 | inline-hex | `#3a3a3a` | <p className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{activity.type |
| 834 | inline-hex | `#2f5d5d` | <h1 className="text-2xl font-serif font-bold" style={{ color: '#2f5d5d' }}>CRM D |
| 835 | inline-hex | `#3a3a3a` | <p style={{ color: '#3a3a3a', opacity: 0.7 }}>User management and engagement ana |
| 839 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 839 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 865 | inline-hex | `#3a3a3a` | <p className="text-sm mb-1" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.lab |
| 866 | inline-hex | `#2f5d5d` | <p className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p> |
| 869 | inline-hex | `#059669` | style={{ color: stat.up ? '#059669' : '#dc2626' }} |
| 869 | inline-hex | `#dc2626` | style={{ color: stat.up ? '#059669' : '#dc2626' }} |
| 886 | inline-hex | `#2f5d5d` | <h3 id="users-heading" className="font-semibold" style={{ color: '#2f5d5d' }}>Re |
| 894 | inline-hex | `#3a3a3a` | <Filter className="w-4 h-4" style={{ color: '#3a3a3a' }} aria-hidden="true" /> |
| 902 | inline-hex | `#3a3a3a` | <Search className="w-4 h-4" style={{ color: '#3a3a3a' }} aria-hidden="true" /> |
| 909 | inline-hex | `#2f5d5d` | <th className="text-left p-4" style={{ color: '#2f5d5d' }}>User</th> |
| 910 | inline-hex | `#2f5d5d` | <th className="text-left p-4" style={{ color: '#2f5d5d' }}>Status</th> |
| 911 | inline-hex | `#2f5d5d` | <th className="text-left p-4" style={{ color: '#2f5d5d' }}>Last Active</th> |
| 912 | inline-hex | `#2f5d5d` | <th className="text-left p-4" style={{ color: '#2f5d5d' }}>Actions</th> |
| 924 | inline-hex | `#8fbf9f` | <div className="w-8 h-8 rounded-full" style={{ background: '#8fbf9f' }} /> |
| 926 | inline-hex | `#2f5d5d` | <p className="font-medium" style={{ color: '#2f5d5d' }}>{user.name}</p> |
| 927 | inline-hex | `#3a3a3a` | <p className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{user.email}</ |
| 942 | inline-hex | `#3a3a3a` | <td className="p-4" style={{ color: '#3a3a3a' }}>{user.time}</td> |
| 949 | inline-hex | `#3a3a3a` | <Eye className="w-4 h-4" style={{ color: '#3a3a3a' }} aria-hidden="true" /> |
| 974 | inline-hex | `#2f5d5d` | <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2f5d5d' }}> |
| 975 | inline-hex | `#3a3a3a` | <p className="mb-6" style={{ color: '#3a3a3a', opacity: 0.7 }}>Explore healing r |
| 983 | inline-hex | `#3a3a3a` | <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ co |
| 1044 | inline-hex | `#2f5d5d` | <FileText className="w-10 h-10" style={{ color: '#2f5d5d', opacity: 0.3 }} aria- |
| 1050 | inline-hex | `#8B7023` | style={{ background: 'rgba(234, 195, 59, 0.2)', color: '#8B7023' }} |
| 1055 | inline-hex | `#3a3a3a` | <span className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{content.ti |
| 1057 | inline-hex | `#2f5d5d` | <h3 className="font-semibold mb-2" style={{ color: '#2f5d5d' }} data-slot="title |
| 1060 | inline-hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |
| 1087 | inline-hex | `#2f5d5d` | <h1 className="text-3xl font-serif font-bold" style={{ color: '#2f5d5d' }}>Q&A C |
| 1088 | inline-hex | `#3a3a3a` | <p style={{ color: '#3a3a3a', opacity: 0.7 }}>Ask questions, share experiences,  |
| 1092 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1092 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1145 | inline-hex | `#8fbf9f` | <TrendingUp className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true"  |
| 1147 | inline-hex | `#2f5d5d` | <span className="font-bold text-sm" style={{ color: '#2f5d5d' }}>{post.votes}</s |
| 1153 | inline-hex | `#f4c7c3` | <div className="w-6 h-6 rounded-full" style={{ background: '#f4c7c3' }} /> |
| 1154 | inline-hex | `#3a3a3a` | <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{post.author} |
| 1158 | inline-hex | `#2f5d5d` | style={{ background: 'rgba(143, 191, 159, 0.2)', color: '#2f5d5d' }} |
| 1163 | inline-hex | `#3a3a3a` | <span className="text-xs" style={{ color: '#3a3a3a', opacity: 0.5 }}>{post.time} |
| 1165 | inline-hex | `#2f5d5d` | <h3 className="font-semibold mb-1" style={{ color: '#2f5d5d' }} data-slot="post- |
| 1166 | inline-hex | `#3a3a3a` | <p className="text-sm mb-3" style={{ color: '#3a3a3a', opacity: 0.7 }} data-slot |
| 1168 | inline-hex | `#3a3a3a` | <span style={{ color: '#3a3a3a', opacity: 0.6 }}> |
| 1206 | inline-hex | `#8fbf9f` | <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-cen |
| 1206 | inline-hex | `#2f5d5d` | <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-cen |
| 1209 | inline-hex | `#2f5d5d` | <h1 className="text-2xl font-serif font-bold" style={{ color: '#2f5d5d' }}>Welco |
| 1210 | inline-hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.7 }}>Sign in to con |
| 1221 | inline-hex | `#2f5d5d` | <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color |
| 1236 | inline-hex | `#2f5d5d` | <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ co |
| 1255 | inline-hex | `#3a3a3a` | <Eye className="w-5 h-5" style={{ color: '#3a3a3a', opacity: 0.4 }} aria-hidden= |
| 1267 | inline-hex | `#3a3a3a` | <span style={{ color: '#3a3a3a' }}>Remember me</span> |
| 1269 | inline-hex | `#8fbf9f` | <a href="#forgot" className="text-sm" style={{ color: '#8fbf9f' }} data-testid=" |
| 1277 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1277 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 1287 | inline-hex | `#3a3a3a` | <span className="text-sm" style={{ color: '#3a3a3a', opacity: 0.5 }}>or continue |
| 1302 | inline-hex | `#DB4437` | <span className="w-5 h-5 rounded-full" style={{ background: '#DB4437' }} aria-hi |
| 1303 | inline-hex | `#3a3a3a` | <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>Google</span> |
| 1310 | inline-hex | `#333` | <span className="w-5 h-5 rounded-full" style={{ background: '#333' }} aria-hidde |
| 1311 | inline-hex | `#3a3a3a` | <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>GitHub</span> |
| 1316 | inline-hex | `#3a3a3a` | <p className="text-center mt-6 text-sm" style={{ color: '#3a3a3a' }}> |
| 1318 | inline-hex | `#2f5d5d` | <a href="#signup" className="font-medium" style={{ color: '#2f5d5d' }} data-test |
| 1601 | inline-hex | `#2f5d5d` | <h2 className="text-2xl font-serif font-bold" style={{ color: '#2f5d5d' }}> |
| 1606 | inline-hex | `#2f5d5d` | style={{ background: '#2f5d5d', color: 'white' }} |

### `client/src/components/FlowDiagram.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 19 | hex | `#8fbf9f` | { id: "landing", name: "Landing", icon: Home, color: "#8fbf9f" }, |
| 20 | hex | `#eac33b` | { id: "onboarding", name: "Onboarding", icon: Sparkles, color: "#eac33b" }, |
| 21 | hex | `#2f5d5d` | { id: "homepage", name: "Homepage", icon: LayoutDashboard, color: "#2f5d5d" }, |
| 22 | hex | `#f4c7c3` | { id: "crm", name: "CRM", icon: Users, color: "#f4c7c3" }, |
| 23 | hex | `#8fbf9f` | { id: "content", name: "Content", icon: BookOpen, color: "#8fbf9f" }, |
| 24 | hex | `#eac33b` | { id: "qa", name: "Q&A", icon: MessageCircle, color: "#eac33b" }, |
| 25 | hex | `#2f5d5d` | { id: "login", name: "Auth", icon: LogIn, color: "#2f5d5d" } |
| 41 | hex | `#2f5d5d` | <span className="text-sm font-medium" style={{ color: '#2f5d5d' }}> |
| 50 | hex | `#eac33b` | stroke="#eac33b" |
| 76 | hex | `#8fbf9f` | <stop offset="0%" stopColor="#8fbf9f" stopOpacity="0.3" /> |
| 77 | hex | `#eac33b` | <stop offset="50%" stopColor="#eac33b" stopOpacity="0.3" /> |
| 78 | hex | `#2f5d5d` | <stop offset="100%" stopColor="#2f5d5d" stopOpacity="0.3" /> |
| 91 | hex | `#eac33b` | <polygon points="0 0, 10 3.5, 0 7" fill="#eac33b" /> |
| 112 | hex | `#eac33b` | stroke="#eac33b" |
| 142 | hex | `#3a3a3a` | fill="#3a3a3a" |
| 154 | hex | `#2f5d5d` | fill="#2f5d5d" |
| 167 | hex | `#3a3a3a` | <text textAnchor="middle" fill="#3a3a3a" fontSize="10" fontWeight="500"> |
| 177 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 223 | hex | `#8fbf9f` | <stop offset="0%" stop-color="#8fbf9f" stop-opacity="0.3" /> |
| 224 | hex | `#eac33b` | <stop offset="50%" stop-color="#eac33b" stop-opacity="0.3" /> |
| 225 | hex | `#2f5d5d` | <stop offset="100%" stop-color="#2f5d5d" stop-opacity="0.3" /> |
| 232 | hex | `#8fbf9f` | <circle cx="60" cy="90" r="35" fill="white" stroke="#8fbf9f" stroke-width="3"/> |
| 233 | hex | `#2f5d5d` | <text x="60" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-wei |
| 236 | hex | `#eac33b` | <circle cx="190" cy="90" r="35" fill="white" stroke="#eac33b" stroke-width="3"/> |
| 237 | hex | `#2f5d5d` | <text x="190" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-we |
| 240 | hex | `#2f5d5d` | <circle cx="320" cy="90" r="35" fill="white" stroke="#2f5d5d" stroke-width="3"/> |
| 241 | hex | `#2f5d5d` | <text x="320" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-we |
| 244 | hex | `#f4c7c3` | <circle cx="450" cy="90" r="35" fill="white" stroke="#f4c7c3" stroke-width="3"/> |
| 245 | hex | `#2f5d5d` | <text x="450" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-we |
| 248 | hex | `#8fbf9f` | <circle cx="580" cy="90" r="35" fill="white" stroke="#8fbf9f" stroke-width="3"/> |
| 249 | hex | `#2f5d5d` | <text x="580" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-we |
| 252 | hex | `#eac33b` | <circle cx="710" cy="90" r="35" fill="white" stroke="#eac33b" stroke-width="3"/> |
| 253 | hex | `#2f5d5d` | <text x="710" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-we |
| 256 | hex | `#2f5d5d` | <circle cx="840" cy="90" r="35" fill="white" stroke="#2f5d5d" stroke-width="3"/> |
| 257 | hex | `#2f5d5d` | <text x="840" y="140" text-anchor="middle" fill="#2f5d5d" font-size="13" font-we |
| 41 | inline-hex | `#2f5d5d` | <span className="text-sm font-medium" style={{ color: '#2f5d5d' }}> |
| 177 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |

### `client/src/components/ui/CRMWidgets.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 41 | hex | `#2f5d5d` | <h3 className="font-semibold mb-4" style={{ color: '#2f5d5d' }}>{title}</h3> |
| 53 | hex | `#8fbf9f` | <Icon className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 57 | hex | `#059669` | style={{ color: stat.up ? '#059669' : '#dc2626' }} |
| 57 | hex | `#dc2626` | style={{ color: stat.up ? '#059669' : '#dc2626' }} |
| 64 | hex | `#2f5d5d` | <p className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p> |
| 65 | hex | `#3a3a3a` | <p className="text-xs" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</ |
| 84 | hex | `#8fbf9f` | session: { bg: 'rgba(143, 191, 159, 0.15)', border: '#8fbf9f' }, |
| 85 | hex | `#eac33b` | practice: { bg: 'rgba(234, 195, 59, 0.15)', border: '#eac33b' }, |
| 86 | hex | `#f4c7c3` | community: { bg: 'rgba(244, 199, 195, 0.2)', border: '#f4c7c3' } |
| 97 | hex | `#2f5d5d` | <h3 className="font-semibold" style={{ color: '#2f5d5d' }}>Upcoming</h3> |
| 103 | hex | `#8fbf9f` | <Calendar className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 120 | hex | `#2f5d5d` | <p className="font-medium text-sm" style={{ color: '#2f5d5d' }}>{event.title}</p |
| 121 | hex | `#3a3a3a` | <p className="text-xs flex items-center gap-1" style={{ color: '#3a3a3a', opacit |
| 129 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 129 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 142 | hex | `#2f5d5d` | style={{ border: '1px dashed rgba(47, 93, 93, 0.3)', color: '#2f5d5d' }} |
| 170 | hex | `#2f5d5d` | <h3 className="font-semibold" style={{ color: '#2f5d5d' }}>Weekly Goals</h3> |
| 171 | hex | `#8fbf9f` | <Target className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 182 | hex | `#3a3a3a` | <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{goal.label}< |
| 183 | hex | `#059669` | <span className="text-xs" style={{ color: isComplete ? '#059669' : '#3a3a3a', op |
| 183 | hex | `#3a3a3a` | <span className="text-xs" style={{ color: isComplete ? '#059669' : '#3a3a3a', op |
| 207 | hex | `#8fbf9f` | ? 'linear-gradient(90deg, #8fbf9f, #059669)' |
| 207 | hex | `#059669` | ? 'linear-gradient(90deg, #8fbf9f, #059669)' |
| 208 | hex | `#8fbf9f` | : 'linear-gradient(90deg, #8fbf9f, #eac33b)' |
| 208 | hex | `#eac33b` | : 'linear-gradient(90deg, #8fbf9f, #eac33b)' |
| 237 | hex | `#2f5d5d` | <h3 className="font-semibold mb-4" style={{ color: '#2f5d5d' }}>Quick Actions</h |
| 248 | hex | `#eac33b` | background: action.primary ? 'linear-gradient(135deg, #eac33b, #d4a84b)' : 'rgba |
| 248 | hex | `#d4a84b` | background: action.primary ? 'linear-gradient(135deg, #eac33b, #d4a84b)' : 'rgba |
| 249 | hex | `#2f5d5d` | color: action.primary ? '#2f5d5d' : '#3a3a3a' |
| 249 | hex | `#3a3a3a` | color: action.primary ? '#2f5d5d' : '#3a3a3a' |
| 282 | hex | `#2f5d5d` | <h3 className="font-semibold" style={{ color: '#2f5d5d' }}>Notifications</h3> |
| 284 | hex | `#8fbf9f` | <Bell className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 288 | hex | `#eac33b` | style={{ background: '#eac33b' }} |
| 306 | hex | `#eac33b` | style={{ background: '#eac33b' }} |
| 311 | hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a' }}>{notification.text}</p> |
| 312 | hex | `#3a3a3a` | <p className="text-xs mt-1" style={{ color: '#3a3a3a', opacity: 0.5 }}>{notifica |
| 320 | hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |
| 41 | inline-hex | `#2f5d5d` | <h3 className="font-semibold mb-4" style={{ color: '#2f5d5d' }}>{title}</h3> |
| 53 | inline-hex | `#8fbf9f` | <Icon className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 57 | inline-hex | `#059669` | style={{ color: stat.up ? '#059669' : '#dc2626' }} |
| 57 | inline-hex | `#dc2626` | style={{ color: stat.up ? '#059669' : '#dc2626' }} |
| 64 | inline-hex | `#2f5d5d` | <p className="text-2xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p> |
| 65 | inline-hex | `#3a3a3a` | <p className="text-xs" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</ |
| 97 | inline-hex | `#2f5d5d` | <h3 className="font-semibold" style={{ color: '#2f5d5d' }}>Upcoming</h3> |
| 103 | inline-hex | `#8fbf9f` | <Calendar className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 120 | inline-hex | `#2f5d5d` | <p className="font-medium text-sm" style={{ color: '#2f5d5d' }}>{event.title}</p |
| 121 | inline-hex | `#3a3a3a` | <p className="text-xs flex items-center gap-1" style={{ color: '#3a3a3a', opacit |
| 129 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 129 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 142 | inline-hex | `#2f5d5d` | style={{ border: '1px dashed rgba(47, 93, 93, 0.3)', color: '#2f5d5d' }} |
| 170 | inline-hex | `#2f5d5d` | <h3 className="font-semibold" style={{ color: '#2f5d5d' }}>Weekly Goals</h3> |
| 171 | inline-hex | `#8fbf9f` | <Target className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 182 | inline-hex | `#3a3a3a` | <span className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{goal.label}< |
| 183 | inline-hex | `#059669` | <span className="text-xs" style={{ color: isComplete ? '#059669' : '#3a3a3a', op |
| 183 | inline-hex | `#3a3a3a` | <span className="text-xs" style={{ color: isComplete ? '#059669' : '#3a3a3a', op |
| 237 | inline-hex | `#2f5d5d` | <h3 className="font-semibold mb-4" style={{ color: '#2f5d5d' }}>Quick Actions</h |
| 282 | inline-hex | `#2f5d5d` | <h3 className="font-semibold" style={{ color: '#2f5d5d' }}>Notifications</h3> |
| 284 | inline-hex | `#8fbf9f` | <Bell className="w-5 h-5" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 288 | inline-hex | `#eac33b` | style={{ background: '#eac33b' }} |
| 306 | inline-hex | `#eac33b` | style={{ background: '#eac33b' }} |
| 311 | inline-hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a' }}>{notification.text}</p> |
| 312 | inline-hex | `#3a3a3a` | <p className="text-xs mt-1" style={{ color: '#3a3a3a', opacity: 0.5 }}>{notifica |
| 320 | inline-hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |

### `client/src/components/ui/HeroSection.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 46 | hex | `#8B7023` | style={{ background: 'rgba(234, 195, 59, 0.15)', color: '#8B7023' }} |
| 57 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 65 | hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.8 }} |
| 76 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 76 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 88 | hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 88 | hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 101 | hex | `#2f5d5d` | <p className="text-3xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p> |
| 102 | hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</ |
| 135 | hex | `#8fbf9f` | <Heart className="w-16 h-16" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 170 | hex | `#2f5d5d` | style={{ background: 'rgba(143, 191, 159, 0.15)', color: '#2f5d5d' }} |
| 180 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 189 | hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.7 }} |
| 214 | hex | `#8B7023` | style={{ background: 'rgba(234, 195, 59, 0.2)', color: '#8B7023' }} |
| 225 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 233 | hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.8 }} |
| 244 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 244 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 257 | hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 257 | hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 273 | hex | `#2f5d5d` | <p className="text-3xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p> |
| 274 | hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</ |
| 46 | inline-hex | `#8B7023` | style={{ background: 'rgba(234, 195, 59, 0.15)', color: '#8B7023' }} |
| 57 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 65 | inline-hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.8 }} |
| 76 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 76 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 88 | inline-hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 88 | inline-hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 101 | inline-hex | `#2f5d5d` | <p className="text-3xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p> |
| 102 | inline-hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</ |
| 135 | inline-hex | `#8fbf9f` | <Heart className="w-16 h-16" style={{ color: '#8fbf9f' }} aria-hidden="true" /> |
| 170 | inline-hex | `#2f5d5d` | style={{ background: 'rgba(143, 191, 159, 0.15)', color: '#2f5d5d' }} |
| 180 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 189 | inline-hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.7 }} |
| 214 | inline-hex | `#8B7023` | style={{ background: 'rgba(234, 195, 59, 0.2)', color: '#8B7023' }} |
| 225 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 233 | inline-hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.8 }} |
| 244 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 244 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 257 | inline-hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 257 | inline-hex | `#2f5d5d` | style={{ background: 'transparent', color: '#2f5d5d', border: '2px solid #2f5d5d |
| 273 | inline-hex | `#2f5d5d` | <p className="text-3xl font-bold" style={{ color: '#2f5d5d' }}>{stat.value}</p> |
| 274 | inline-hex | `#3a3a3a` | <p className="text-sm" style={{ color: '#3a3a3a', opacity: 0.6 }}>{stat.label}</ |

### `client/src/components/ui/QuoteBlock.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 83 | hex | `#8fbf9f` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 83 | hex | `#eac33b` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 83 | hex | `#f4c7c3` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 90 | hex | `#eac33b` | style={{ background: 'linear-gradient(135deg, #eac33b, #d4a84b)' }} |
| 90 | hex | `#d4a84b` | style={{ background: 'linear-gradient(135deg, #eac33b, #d4a84b)' }} |
| 92 | hex | `#2f5d5d` | <Quote className="w-6 h-6" style={{ color: '#2f5d5d' }} aria-hidden="true" /> |
| 101 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 107 | hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.7 }} |
| 109 | hex | `#f4c7c3` | <Heart className="w-4 h-4" style={{ color: '#f4c7c3' }} aria-hidden="true" /> |
| 121 | hex | `#eac33b` | background: i === currentIndex ? '#eac33b' : 'rgba(47, 93, 93, 0.2)', |
| 149 | hex | `#eac33b` | style={{ color: '#eac33b' }} |
| 159 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 165 | hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |
| 178 | hex | `#eac33b` | background: i === currentIndex ? '#eac33b' : 'rgba(143, 191, 159, 0.3)', |
| 207 | hex | `#eac33b` | <Quote className="w-5 h-5" style={{ color: '#eac33b' }} aria-hidden="true" /> |
| 216 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 222 | hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.6 }} |
| 83 | inline-hex | `#8fbf9f` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 83 | inline-hex | `#eac33b` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 83 | inline-hex | `#f4c7c3` | style={{ background: 'linear-gradient(90deg, #8fbf9f, #eac33b, #f4c7c3)' }} |
| 90 | inline-hex | `#eac33b` | style={{ background: 'linear-gradient(135deg, #eac33b, #d4a84b)' }} |
| 90 | inline-hex | `#d4a84b` | style={{ background: 'linear-gradient(135deg, #eac33b, #d4a84b)' }} |
| 92 | inline-hex | `#2f5d5d` | <Quote className="w-6 h-6" style={{ color: '#2f5d5d' }} aria-hidden="true" /> |
| 101 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 107 | inline-hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.7 }} |
| 109 | inline-hex | `#f4c7c3` | <Heart className="w-4 h-4" style={{ color: '#f4c7c3' }} aria-hidden="true" /> |
| 149 | inline-hex | `#eac33b` | style={{ color: '#eac33b' }} |
| 159 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 165 | inline-hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |
| 207 | inline-hex | `#eac33b` | <Quote className="w-5 h-5" style={{ color: '#eac33b' }} aria-hidden="true" /> |
| 216 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 222 | inline-hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.6 }} |

### `client/src/components/ui/ResourceTiles.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 30 | hex | `#8B7023` | article: { bg: 'rgba(234, 195, 59, 0.15)', text: '#8B7023' }, |
| 31 | hex | `#8b5a5a` | video: { bg: 'rgba(244, 199, 195, 0.3)', text: '#8b5a5a' }, |
| 32 | hex | `#2f5d5d` | audio: { bg: 'rgba(47, 93, 93, 0.1)', text: '#2f5d5d' }, |
| 33 | hex | `#2f5d5d` | practice: { bg: 'rgba(143, 191, 159, 0.2)', text: '#2f5d5d' }, |
| 34 | hex | `#2f5d5d` | guide: { bg: 'rgba(47, 93, 93, 0.15)', text: '#2f5d5d' } |
| 78 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 90 | hex | `#3a3a3a` | <span className="text-xs flex items-center gap-1" style={{ color: '#3a3a3a', opa |
| 100 | hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |
| 114 | hex | `#2f5d5d` | background: 'linear-gradient(135deg, #2f5d5d, #1f3f3f)', |
| 114 | hex | `#1f3f3f` | background: 'linear-gradient(135deg, #2f5d5d, #1f3f3f)', |
| 137 | hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 137 | hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 168 | hex | `#eac33b` | style={{ color: '#eac33b' }} |
| 204 | hex | `#2f5d5d` | style={{ color: '#2f5d5d', opacity: 0.3 }} |
| 211 | hex | `#eac33b` | <Star className="w-5 h-5" style={{ color: '#eac33b', fill: '#eac33b' }} aria-hid |
| 211 | hex | `#eac33b` | <Star className="w-5 h-5" style={{ color: '#eac33b', fill: '#eac33b' }} aria-hid |
| 222 | hex | `#2f5d5d` | <Bookmark className="w-4 h-4" style={{ color: '#2f5d5d' }} aria-hidden="true" /> |
| 232 | hex | `#2f5d5d` | <Play className="w-6 h-6 ml-1" style={{ color: '#2f5d5d' }} aria-hidden="true" / |
| 247 | hex | `#3a3a3a` | <span className="text-xs flex items-center gap-1" style={{ color: '#3a3a3a', opa |
| 256 | hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 264 | hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.7 }} |
| 271 | hex | `#8fbf9f` | <span className="text-xs font-medium" style={{ color: '#8fbf9f' }}> |
| 298 | hex | `#8fbf9f` | style={{ color: '#8fbf9f', opacity: 0.5 }} |
| 301 | hex | `#3a3a3a` | <p style={{ color: '#3a3a3a', opacity: 0.6 }}>{emptyMessage}</p> |
| 78 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 90 | inline-hex | `#3a3a3a` | <span className="text-xs flex items-center gap-1" style={{ color: '#3a3a3a', opa |
| 100 | inline-hex | `#8fbf9f` | style={{ color: '#8fbf9f' }} |
| 137 | inline-hex | `#eac33b` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 137 | inline-hex | `#2f5d5d` | style={{ background: '#eac33b', color: '#2f5d5d' }} |
| 168 | inline-hex | `#eac33b` | style={{ color: '#eac33b' }} |
| 204 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d', opacity: 0.3 }} |
| 211 | inline-hex | `#eac33b` | <Star className="w-5 h-5" style={{ color: '#eac33b', fill: '#eac33b' }} aria-hid |
| 211 | inline-hex | `#eac33b` | <Star className="w-5 h-5" style={{ color: '#eac33b', fill: '#eac33b' }} aria-hid |
| 222 | inline-hex | `#2f5d5d` | <Bookmark className="w-4 h-4" style={{ color: '#2f5d5d' }} aria-hidden="true" /> |
| 232 | inline-hex | `#2f5d5d` | <Play className="w-6 h-6 ml-1" style={{ color: '#2f5d5d' }} aria-hidden="true" / |
| 247 | inline-hex | `#3a3a3a` | <span className="text-xs flex items-center gap-1" style={{ color: '#3a3a3a', opa |
| 256 | inline-hex | `#2f5d5d` | style={{ color: '#2f5d5d' }} |
| 264 | inline-hex | `#3a3a3a` | style={{ color: '#3a3a3a', opacity: 0.7 }} |
| 271 | inline-hex | `#8fbf9f` | <span className="text-xs font-medium" style={{ color: '#8fbf9f' }}> |
| 298 | inline-hex | `#8fbf9f` | style={{ color: '#8fbf9f', opacity: 0.5 }} |
| 301 | inline-hex | `#3a3a3a` | <p style={{ color: '#3a3a3a', opacity: 0.6 }}>{emptyMessage}</p> |

### `client/src/features/community/SharedReflectionsPage.jsx`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 145 | hex | `#2f5d5d` | <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ |
| 145 | hex | `#8fbf9f` | <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ |
| 175 | hex | `#2f5d5d` | background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)', |
| 175 | hex | `#8fbf9f` | background: 'linear-gradient(135deg, #2f5d5d, #8fbf9f)', |
| 307 | hex | `#f4c7c3` | <Heart className="w-5 h-5" style={{ color: '#f4c7c3' }} aria-hidden="true" /> |
| 145 | inline-hex | `#2f5d5d` | <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ |
| 145 | inline-hex | `#8fbf9f` | <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ |
| 307 | inline-hex | `#f4c7c3` | <Heart className="w-5 h-5" style={{ color: '#f4c7c3' }} aria-hidden="true" /> |

### `client/src/styles/canva-landing.css`

| Line | Type | Value | Context |
|------|------|-------|---------|
| 4 | hex | `#8fbf9f` | --sage-green: #8fbf9f; |
| 5 | hex | `#f4c7c3` | --blush-pink: #f4c7c3; |
| 6 | hex | `#2f5d5d` | --deep-teal: #2f5d5d; |
| 7 | hex | `#faf9f7` | --soft-ivory: #faf9f7; |
| 8 | hex | `#3a3a3a` | --charcoal: #3a3a3a; |
| 9 | hex | `#eac33b` | --warm-gold: #eac33b; |
| 13 | font | `lato` | font-family: 'Lato', system-ui, sans-serif; |
| 19 | font | `cormorant garamond` | font-family: 'Cormorant Garamond', Georgia, serif; |
| 117 | font | `lato` | font-family: 'Lato', sans-serif; |
| 135 | font | `lato` | font-family: 'Lato', sans-serif; |
| 195 | font | `cormorant garamond` | font-family: 'Cormorant Garamond', serif; |
| 222 | font | `cormorant garamond` | font-family: 'Cormorant Garamond', serif; |
| 403 | font | `cormorant garamond` | font-family: 'Cormorant Garamond', serif; |
| 410 | font | `cormorant garamond` | font-family: 'Cormorant Garamond', serif; |
| 503 | font | `cormorant garamond` | font-family: 'Cormorant Garamond', serif; |
| 510 | font | `cormorant garamond` | font-family: 'Cormorant Garamond', serif; |

## How to Fix

### Hex Colors
1. Replace raw hex colors with CSS variables:
   - `#2F5D5D` → `var(--glp-sage-deep)` or `var(--primary)`
   - `#EAC33B` → `var(--glp-gold)` or `var(--accent)`
   - `#8FBF9F` → `var(--glp-sage)`
   - `#F4C7C3` → `var(--glp-blush)`
   - `#FAF9F7` → `var(--glp-paper)` or `var(--bg)`
   - `#3A3A3A` → `var(--glp-ink)` or `var(--text-1)`

2. For Tailwind classes, use semantic color names:
   - `text-[#2F5D5D]` → `text-teal` or `text-primary`
   - `bg-[#EAC33B]` → `bg-gold` or `bg-accent`

### Fonts
- Use only Inter for body text and Playfair Display for headings
- System fallback fonts are allowed

### Inline Styles
- Replace `style={{ color: "#xxx" }}` with `style={{ color: "var(--glp-...)" }}`

3. Re-run `npm run visual:doctor` to verify fixes.
