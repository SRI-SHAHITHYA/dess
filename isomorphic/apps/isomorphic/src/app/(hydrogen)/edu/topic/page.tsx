import { routes } from '@/config/routes';
import EduTopicTable from '@/app/shared/edu/topic/topic-list/table';
import TopicPageHeader from './topic-page-header';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Topic'),
};

const pageHeader = {
  title: 'Topic',
  breadcrumb: [
    {
      href: routes.edu.dashboard,
      name: 'Education',
    },
    {
      href: routes.edu.topic,
      name: 'Topic',
    },
    {
      name: 'List',
    },
  ],
};

export default function TopicPage() {
  return (
    <>
      <TopicPageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <EduTopicTable />
    </>
  );
}
