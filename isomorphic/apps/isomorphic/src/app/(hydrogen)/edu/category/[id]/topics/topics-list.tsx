'use client';

import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import EduTopicsTable from '@/app/shared/edu/topics/topics-list/table';

const pageHeader = {
  title: 'Topics',
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
      name: 'Topics',
    },
  ],
};

export default function TopicsListPage({ categoryId }: { categoryId: number }) {
  // For standalone categories, topics are directly under the category
  // We'll pass the categoryId to fetch topics
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <EduTopicsTable moduleId={categoryId} />
    </>
  );
}
