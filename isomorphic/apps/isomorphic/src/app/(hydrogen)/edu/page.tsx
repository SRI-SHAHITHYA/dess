import { metaObject } from '@/config/site.config';
import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';

export const metadata = {
  ...metaObject('Education Dashboard'),
};

export default function EduDashboard() {
  // Redirect to categories page
  redirect(routes.edu.categories);
}
