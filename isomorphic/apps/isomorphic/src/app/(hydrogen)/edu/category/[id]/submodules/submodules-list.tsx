'use client';

import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import EduSubmoduleTable from '@/app/shared/edu/submodule/submodule-list/table';

const pageHeader = {
  title: 'Submodules',
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
      name: 'Submodules',
    },
  ],
};

export default function SubmodulesListPage({ categoryId }: { categoryId: number }) {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <EduSubmoduleTable categoryId={categoryId} />
    </>
  );
}
