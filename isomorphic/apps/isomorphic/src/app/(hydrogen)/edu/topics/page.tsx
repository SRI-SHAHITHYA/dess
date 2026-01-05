import { routes } from '@/config/routes';
import EduTopicsTable from '@/app/shared/edu/topics/topics-list/table';
import TopicsPageHeader from './topics-page-header';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Topics'),
};

const pageHeader = {
  title: 'Topics',
  breadcrumb: [
    {
      href: routes.edu.dashboard,
      name: 'Education',
    },
    {
      href: routes.edu.topics,
      name: 'Topics',
    },
    {
      name: 'List',
    },
  ],
};

export default function TopicsPage() {
  return (
    <>
      <TopicsPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <EduTopicsTable />
    </>
  );
}
