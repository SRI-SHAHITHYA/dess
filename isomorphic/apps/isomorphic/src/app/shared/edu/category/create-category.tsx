'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import QuillLoader from '@core/components/loader/quill-loader';
import { Button, Input, Select, Text, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import {
  EduCategoryFormInput,
  eduCategoryFormSchema,
} from '@/validators/create-edu-category.schema';
import UploadZone from '@core/ui/file-upload/upload-zone';
import toast from 'react-hot-toast';
import { categoryService } from '@/services/category-service';
import { routes } from '@/config/routes';

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

// Type options for education categories
const typeOptions = [
  {
    value: 'standalone',
    label: 'Standalone',
  },
  {
    value: 'module-based',
    label: 'Module Based',
  },
];

// Status options
const statusOptions = [
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'inactive',
    label: 'Inactive',
  },
  {
    value: 'draft',
    label: 'Draft',
  },
];

// a reusable form wrapper component
function HorizontalFormBlockWrapper({
  title,
  description,
  children,
  className,
  isModalView = true,
}: React.PropsWithChildren<{
  title: string;
  description?: string;
  className?: string;
  isModalView?: boolean;
}>) {
  return (
    <div
      className={cn(
        className,
        isModalView ? '@5xl:grid @5xl:grid-cols-6' : ' '
      )}
    >
      {isModalView && (
        <div className="col-span-2 mb-6 pe-4 @5xl:mb-0">
          <Title as="h6" className="font-semibold">
            {title}
          </Title>
          <Text className="mt-1 text-sm text-gray-500">{description}</Text>
        </div>
      )}

      <div
        className={cn(
          'grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5',
          isModalView ? 'col-span-4' : ' '
        )}
      >
        {children}
      </div>
    </div>
  );
}

// main category form component for create and update category
export default function CreateEduCategory({
  id,
  category,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
  category?: EduCategoryFormInput;
}) {
  const router = useRouter();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<EduCategoryFormInput> = async (data) => {
    setLoading(true);
    try {
      if (id) {
        // Update existing category
        await categoryService.update(Number(id), {
          name: data.name,
          type: data.type,
          status: data.status,
          description: data.description,
          image_url: data.images,
        });
        toast.success(`Category "${data.name}" updated successfully!`);
        router.push(routes.edu.categories);
      } else {
        // Create new category
        await categoryService.create({
          name: data.name,
          type: data.type,
          status: data.status || 'draft',
          description: data.description,
          image_url: data.images,
        });
        toast.success(`Category "${data.name}" created successfully!`);

        // Reset form
        setReset({
          name: '',
          type: '',
          status: '',
          description: '',
          images: '',
        });

        // Redirect to categories list
        router.push(routes.edu.categories);
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error?.message || 'Failed to save category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<EduCategoryFormInput>
      validationSchema={eduCategoryFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: category,
      }}
      className="isomorphic-form flex flex-grow flex-col @container"
    >
      {({ register, control, getValues, setValue, formState: { errors } }) => (
        <>
          <div className="flex-grow pb-10">
            <div
              className={cn(
                'grid grid-cols-1',
                isModalView
                  ? 'grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12 [&>div]:pt-7 first:[&>div]:pt-0 @2xl:[&>div]:pt-9 @3xl:[&>div]:pt-11'
                  : 'gap-5'
              )}
            >
              <HorizontalFormBlockWrapper
                title={'Add new category:'}
                description={'Edit your category information from here'}
                isModalView={isModalView}
              >
                <Input
                  label="Category Name"
                  placeholder="Enter category name"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <Controller
                  name="type"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-0"
                      options={typeOptions}
                      value={value}
                      onChange={onChange}
                      label="Type"
                      error={errors?.type?.message as string}
                      getOptionValue={(option) => option.value}
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-0"
                      options={statusOptions}
                      value={value}
                      onChange={onChange}
                      label="Status"
                      error={errors?.status?.message as string}
                      getOptionValue={(option) => option.value}
                    />
                  )}
                />

                <div className="col-span-2">
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                      <QuillEditor
                        value={value}
                        onChange={onChange}
                        label="Description"
                        className="[&>.ql-container_.ql-editor]:min-h-[100px]"
                        labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                      />
                    )}
                  />
                </div>
              </HorizontalFormBlockWrapper>
              <HorizontalFormBlockWrapper
                title="Upload new thumbnail image"
                description="Upload your category image here"
                isModalView={isModalView}
              >
                <UploadZone
                  name="images"
                  getValues={getValues}
                  setValue={setValue}
                  className="col-span-full"
                />
              </HorizontalFormBlockWrapper>
            </div>
          </div>

          <div
            className={cn(
              'sticky bottom-0 z-40 flex items-center justify-end gap-3 bg-gray-0/10 backdrop-blur @lg:gap-4 @xl:grid @xl:auto-cols-max @xl:grid-flow-col',
              isModalView ? '-mx-10 -mb-7 px-10 py-5' : 'py-1'
            )}
          >
            <Button variant="outline" className="w-full @xl:w-auto">
              Save as Draft
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              {id ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
