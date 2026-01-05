import { routes } from '@/config/routes';
import EduCategoryTable from './table';
import CategoryPageHeader from './category-page-header';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Categories'),
};

const pageHeader = {
  title: 'Categories',
  breadcrumb: [
    {
      href: routes.edu.dashboard,
      name: 'Education',
    },
    {
      href: routes.edu.categories,
      name: 'Categories',
    },
    {
      name: 'List',
    },
  ],
};

export default function CategoriesPage() {
  return (
    <>
      <CategoryPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <EduCategoryTable />
    </>
  );
}
