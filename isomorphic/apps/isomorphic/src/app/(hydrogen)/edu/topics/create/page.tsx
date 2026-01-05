import CreateEduTopics from '@/app/shared/edu/topics/create-topics';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Create a Topics'),
};

const pageHeader = {
  title: 'Create A Topics',
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
      name: 'Create',
    },
  ],
};

export default function CreateTopicsPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.edu.topics}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>
      <CreateEduTopics />
    </>
  );
}
