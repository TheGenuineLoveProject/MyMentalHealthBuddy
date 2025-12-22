import { lazy } from 'react';

import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';
import NotFound from '../pages/NotFound.jsx';

const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const MoodPage = lazy(() => import('../pages/MoodPage.jsx'));
const JournalPage = lazy(() => import('../pages/JournalPage.jsx'));
const AIChatPage = lazy(() => import('../pages/AIChatPage.jsx'));
const Analytics = lazy(() => import('../pages/Analytics.jsx'));
const HealthPage = lazy(() => import('../pages/HealthPage.jsx'));
const CrisisResources = lazy(() => import('../pages/CrisisResources.jsx'));
const Settings = lazy(() => import('../pages/Settings.jsx'));
const Wellness = lazy(() => import('../pages/Wellness.jsx'));
const Premium = lazy(() => import('../pages/Premium.jsx'));

export const PUBLIC_ROUTES = [
  { path: '/', component: Home, exact: true },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
  { path: '/health', component: HealthPage },
];

export const PROTECTED_ROUTES = [
  { path: '/dashboard', component: Dashboard },
  { path: '/mood', component: MoodPage },
  { path: '/journal', component: JournalPage },
  { path: '/chat', component: AIChatPage },
  { path: '/analytics', component: Analytics },
  { path: '/crisis', component: CrisisResources },
  { path: '/wellness', component: Wellness },
  { path: '/premium', component: Premium },
  { path: '/settings', component: Settings },
];

export const NOT_FOUND_ROUTE = { component: NotFound };

export const ALL_ROUTES = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES];
