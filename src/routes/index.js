// Layouts
import { HeaderOnly } from '~/components/Layout';

// Pages
import Home from '~/pages/Home';
import Courses from '~/pages/Courses';
import Profile from '~/pages/Profile';
import RecentlyCourses from '~/pages/RecentlyCourses';

// Public Routes - Routers for Unloggin user
const publicRoutes = [
  { path: '/', component: Home },
  { path: '/courses', component: Courses },
  { path: '/profile', component: Profile, layout: HeaderOnly },
  { path: '/recentlycourses', component: RecentlyCourses, layout: null },
];

// Private Routes - Routers for Loggin user
const privateRoutes = [];

export { publicRoutes, privateRoutes };
