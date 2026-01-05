import CreateEduModule from '@/app/shared/edu/module/create-module';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Create a Module'),
};

const pageHeader = {
  title: 'Create A Module',
  breadcrumb: [
    {
      href: routes.edu.dashboard,
      name: 'Education',
    },
    {
      href: routes.edu.modules,
      name: 'Modules',
    },
    {
      name: 'Create',
    },
  ],
};

export default function CreateModulePage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.edu.modules}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>
      <CreateEduModule />
    </>
  );
}
