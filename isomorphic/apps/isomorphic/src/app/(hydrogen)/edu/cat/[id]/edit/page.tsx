import { Button } from 'rizzui/button';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CreateEduCategory from '@/app/shared/edu/category/create-category';
import Link from 'next/link';
import { metaObject } from '@/config/site.config';
import { Metadata } from 'next';
import { categoryService } from '@/services/category-service';
import { notFound } from 'next/navigation';

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
  title: 'Edit Category',
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
      name: 'Edit',
    },
  ],
};

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;

  // Fetch category data from backend
  let categoryData;
  try {
    const category = await categoryService.getById(Number(id));
    // Transform to match form schema
    categoryData = {
      name: category.name,
      type: category.type,
      status: category.status,
      description: category.description,
      images: category.image,
    };
  } catch (error) {
    console.error('Failed to fetch category:', error);
    notFound();
  }

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <Link
          href={routes.edu.categories}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto" variant="outline">
            Cancel
          </Button>
        </Link>
      </PageHeader>
      <CreateEduCategory id={id} category={categoryData} />
    </>
  );
}
