# Navigation Map - The Genuine Love Project

## Primary Navigation (Header)

### Unauthenticated
| Link | Path | Description |
|------|------|-------------|
| Home | `/` or `/home` | Landing/marketing |
| Pricing | `/pricing` | Subscription plans |
| Crisis | `/crisis` | Emergency resources |
| Login | `/login` | Sign in |
| Register | `/register` | Create account |

### Authenticated
| Link | Path | Description |
|------|------|-------------|
| Dashboard | `/dashboard` | Personal hub |
| Wellness | `/wellness` | Tools & exercises |
| Journal | `/journal` | Personal entries |
| Chat | `/chat` | AI companion |
| Settings | `/settings` | Preferences |

## Footer Navigation
| Section | Links |
|---------|-------|
| Product | Home, Pricing, Features |
| Resources | Blog, Crisis, Help |
| Legal | Terms, Privacy, Disclaimer |
| Company | About, Ethics |

## Route Categories

### Public Routes
- `/` - Landing
- `/home` - Home
- `/pricing` - Pricing
- `/login` - Login
- `/register` - Registration
- `/forgot-password` - Password reset
- `/reset-password` - Reset token page
- `/crisis` - Crisis resources
- `/blog` - Blog index
- `/blog/:slug` - Blog post
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/disclaimer` - Disclaimer
- `/ethics` - Ethics statement
- `/health` - Health check page

### Protected Routes (Auth Required)
- `/dashboard` - Main dashboard
- `/wellness` - Wellness tools
- `/journal` - Journal entries
- `/mood` - Mood tracking
- `/chat` - AI chat
- `/analytics` - Personal analytics
- `/settings` - Account settings
- `/profile` - User profile
- `/billing` - Subscription management
- `/upgrade` - Plan upgrade

### Admin Routes
- `/admin` - Admin dashboard
- `/control` - Control panel
- `/write` - Blog editor

## 404 Handling
Branded 404 page with:
- Quick links to common pages
- Search suggestion
- Crisis resources link

## Mode Toggle (Header)
Visual mode switcher:
- Default
- Low-Stim
- Reading
