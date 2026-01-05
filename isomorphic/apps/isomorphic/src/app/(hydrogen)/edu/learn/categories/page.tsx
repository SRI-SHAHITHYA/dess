import { metaObject } from '@/config/site.config';
import CategoriesView from './categories-view';

export const metadata = {
  ...metaObject('Learning Categories'),
};

export default function LearnCategoriesPage() {
  return <CategoriesView />;
}
