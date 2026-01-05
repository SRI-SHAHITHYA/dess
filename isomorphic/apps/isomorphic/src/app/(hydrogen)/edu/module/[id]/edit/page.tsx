import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CreateEduModule from '@/app/shared/edu/module/create-module';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * for dynamic metadata
 * @link: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = (await params).id;

  return metaObject(`Edit ${id}`);
}

const pageHeader = {
  title: 'Edit Module',
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
      name: 'Edit',
    },
  ],
};

const moduleData = {
  name: 'Mathematics',
  description: 'Advanced Mathematics and Calculus',
  images: undefined,
};

export default async function EditModulePage({ params }: any) {
  const id = (await params).id;
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
      <CreateEduModule id={id} module={moduleData} />
    </>
  );
}
