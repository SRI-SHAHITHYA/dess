'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import QuillLoader from '@core/components/loader/quill-loader';
import { Button, Input, Text, Title, Textarea, Select } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import {
  EduTopicFormInput,
  eduTopicFormSchema,
} from '@/validators/create-edu-topic.schema';
import UploadZone from '@core/ui/file-upload/upload-zone';
import toast from 'react-hot-toast';
import { routes } from '@/config/routes';
import { moduleService } from '@/services/module-service';
import { submoduleService } from '@/services/submodule-service';
import { topicService } from '@/services/topic-service';
import { uploadImage } from '@/utils/imageUpload';

const QuillEditor = dynamic(() => import('@core/ui/quill-editor'), {
  ssr: false,
  loading: () => <QuillLoader className="col-span-full h-[168px]" />,
});

// Options for dropdowns
const ogTypeOptions = [
  { value: 'website', label: 'Website' },
  { value: 'article', label: 'Article' },
  { value: 'video', label: 'Video' },
  { value: 'product', label: 'Product' },
];

const twitterCardTypeOptions = [
  { value: 'summary', label: 'Summary' },
  { value: 'summary_large_image', label: 'Summary Large Image' },
  { value: 'app', label: 'App' },
  { value: 'player', label: 'Player' },
];

const robotsDirectiveOptions = [
  { value: 'index, follow', label: 'Index, Follow' },
  { value: 'noindex, follow', label: 'No Index, Follow' },
  { value: 'index, nofollow', label: 'Index, No Follow' },
  { value: 'noindex, nofollow', label: 'No Index, No Follow' },
];

const snippetFormatOptions = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'list', label: 'List' },
  { value: 'table', label: 'Table' },
  { value: 'video', label: 'Video' },
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

// main topic form component for create and update topic
export default function CreateEduTopic({
  id,
  topic,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
  topic?: EduTopicFormInput;
}) {
  const router = useRouter();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [modules, setModules] = useState<Array<{value: number; label: string}>>([]);
  const [submodules, setSubmodules] = useState<Array<{value: number; label: string}>>([]);

  // Fetch modules and submodules on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all modules (from standalone categories)
        const modulesData = await moduleService.getAll();
        const moduleOptions = modulesData.map((mod) => ({
          value: Number(mod.id),
          label: mod.name
        }));
        setModules(moduleOptions);

        // Fetch all submodules
        const submodulesData = await submoduleService.getAll();
        const submoduleOptions = submodulesData.map((sub) => ({
          value: Number(sub.id),
          label: sub.name
        }));
        setSubmodules(submoduleOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load modules and submodules');
      }
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<EduTopicFormInput> = async (data) => {
    setLoading(true);
    try {
      let imageUrl: string | undefined;

      // Upload image if provided
      if (data.images) {
        try {
          imageUrl = await uploadImage(data.images);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast.error('Failed to upload image, continuing without image');
        }
      }

      // Validate that either moduleId or submoduleId is provided
      if (!data.module_id && !data.submodule_id) {
        toast.error('Please select either a module or submodule');
        setLoading(false);
        return;
      }

      // Create topic using service
      await topicService.create({
        moduleId: data.module_id ? Number(data.module_id) : undefined,
        submoduleId: data.submodule_id ? Number(data.submodule_id) : undefined,
        name: data.name,
        content: data.description || '',
        image_url: imageUrl,
      });

      toast.success('Topic created successfully!');
      router.push(routes.edu.topics);
    } catch (error: any) {
      console.error('Error creating topic:', error);
      toast.error(error.message || 'Failed to create topic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<EduTopicFormInput>
      validationSchema={eduTopicFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: topic,
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
                title={'Add new topic:'}
                description={'Edit your topic information from here'}
                isModalView={isModalView}
              >
                <Controller
                  name="module_id"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const selectedModule = modules.find((m) => m.value === value);
                    return (
                      <Select
                        dropdownClassName="!z-10"
                        options={modules}
                        value={selectedModule}
                        onChange={(selected: any) => onChange(selected?.value)}
                        label="Module (for standalone)"
                        placeholder="Select module"
                        error={errors?.module_id?.message as string}
                        getOptionValue={(option: any) => option.value}
                      />
                    );
                  }}
                />

                <Controller
                  name="submodule_id"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const selectedSubmodule = submodules.find((s) => s.value === value);
                    return (
                      <Select
                        dropdownClassName="!z-10"
                        options={submodules}
                        value={selectedSubmodule}
                        onChange={(selected: any) => onChange(selected?.value)}
                        label="Submodule (for module-based)"
                        placeholder="Select submodule"
                        error={errors?.submodule_id?.message as string}
                        getOptionValue={(option: any) => option.value}
                      />
                    );
                  }}
                />

                <Input
                  label="Topic Name"
                  placeholder="Enter topic name"
                  className="col-span-2"
                  {...register('name')}
                  error={errors.name?.message}
                />

                <div className="col-span-2">
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                      <QuillEditor
                        value={value}
                        onChange={onChange}
                        label="Content"
                        className="[&>.ql-container_.ql-editor]:min-h-[100px]"
                        labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                      />
                    )}
                  />
                </div>
              </HorizontalFormBlockWrapper>
              <HorizontalFormBlockWrapper
                title="Upload new thumbnail image"
                description="Upload your topic image here"
                isModalView={isModalView}
              >
                <UploadZone
                  name="images"
                  getValues={getValues}
                  setValue={setValue}
                  className="col-span-full"
                />
              </HorizontalFormBlockWrapper>

              {/* SEO Section */}
              <HorizontalFormBlockWrapper
                title="SEO Settings"
                description="Configure SEO and social media settings"
                isModalView={isModalView}
              >
                <div className="col-span-full space-y-6">
                    {/* Core SEO */}
                    <div>
                      <Title as="h6" className="mb-4 text-sm font-medium">
                        Core SEO
                      </Title>
                      <div className="grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5">
                        <Input
                          label="Page URL"
                          placeholder="Enter page URL"
                          {...register('pageUrl')}
                          error={errors.pageUrl?.message}
                        />
                        <Input
                          label="Meta Title"
                          placeholder="Enter meta title"
                          {...register('metaTitle')}
                          error={errors.metaTitle?.message}
                        />
                        <Textarea
                          label="Meta Description"
                          placeholder="Enter meta description"
                          className="col-span-2"
                          {...register('metaDescription')}
                          error={errors.metaDescription?.message}
                        />
                        <Input
                          label="Meta Keywords"
                          placeholder="Enter meta keywords (comma separated)"
                          className="col-span-2"
                          {...register('metaKeywords')}
                          error={errors.metaKeywords?.message}
                        />
                      </div>
                    </div>

                    {/* Open Graph */}
                    <div>
                      <Title as="h6" className="mb-4 text-sm font-medium">
                        Open Graph
                      </Title>
                      <div className="grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5">
                        <Input
                          label="OG Title"
                          placeholder="Enter OG title"
                          {...register('ogTitle')}
                          error={errors.ogTitle?.message}
                        />
                        <Controller
                          name="ogType"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              dropdownClassName="!z-0"
                              options={ogTypeOptions}
                              value={value}
                              onChange={onChange}
                              label="OG Type"
                              placeholder="Select type"
                              error={errors?.ogType?.message as string}
                              getOptionValue={(option: any) => option.value}
                            />
                          )}
                        />
                        <Textarea
                          label="OG Description"
                          placeholder="Enter OG description"
                          className="col-span-2"
                          {...register('ogDescription')}
                          error={errors.ogDescription?.message}
                        />
                        <div className="col-span-2">
                          <Text className="mb-1.5 font-medium text-gray-700 dark:text-gray-600">
                            OG Image
                          </Text>
                          <UploadZone
                            name="ogImage"
                            getValues={getValues}
                            setValue={setValue}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Twitter Card */}
                    <div>
                      <Title as="h6" className="mb-4 text-sm font-medium">
                        Twitter Card
                      </Title>
                      <div className="grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5">
                        <Controller
                          name="twitterCardType"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              dropdownClassName="!z-0"
                              options={twitterCardTypeOptions}
                              value={value}
                              onChange={onChange}
                              label="Card Type"
                              placeholder="Select card type"
                              error={errors?.twitterCardType?.message as string}
                              getOptionValue={(option: any) => option.value}
                            />
                          )}
                        />
                        <Input
                          label="Twitter Title"
                          placeholder="Enter Twitter title"
                          {...register('twitterTitle')}
                          error={errors.twitterTitle?.message}
                        />
                        <Textarea
                          label="Twitter Description"
                          placeholder="Enter Twitter description"
                          className="col-span-2"
                          {...register('twitterDescription')}
                          error={errors.twitterDescription?.message}
                        />
                        <div className="col-span-2">
                          <Text className="mb-1.5 font-medium text-gray-700 dark:text-gray-600">
                            Twitter Image
                          </Text>
                          <UploadZone
                            name="twitterImage"
                            getValues={getValues}
                            setValue={setValue}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Technical SEO */}
                    <div>
                      <Title as="h6" className="mb-4 text-sm font-medium">
                        Technical SEO
                      </Title>
                      <div className="grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5">
                        <Input
                          label="Canonical URL"
                          placeholder="Enter canonical URL"
                          {...register('canonicalUrl')}
                          error={errors.canonicalUrl?.message}
                        />
                        <Controller
                          name="robotsDirective"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              dropdownClassName="!z-0"
                              options={robotsDirectiveOptions}
                              value={value}
                              onChange={onChange}
                              label="Robots Directive"
                              placeholder="Select directive"
                              error={errors?.robotsDirective?.message as string}
                              getOptionValue={(option: any) => option.value}
                            />
                          )}
                        />
                      </div>
                    </div>
                </div>
              </HorizontalFormBlockWrapper>

              {/* AEO Section */}
              <HorizontalFormBlockWrapper
                title="AEO Settings (Answer Engine Optimization)"
                description="Optimize for AI and voice search engines"
                isModalView={isModalView}
              >
                <div className="col-span-full space-y-6">
                    {/* Featured Snippet */}
                    <div>
                      <Title as="h6" className="mb-4 text-sm font-medium">
                        Featured Snippet
                      </Title>
                      <div className="grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5">
                        <Textarea
                          label="Target Content"
                          placeholder="Enter target content for featured snippet"
                          className="col-span-2"
                          {...register('snippetTargetContent')}
                          error={errors.snippetTargetContent?.message}
                        />
                        <Controller
                          name="snippetFormat"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              dropdownClassName="!z-0"
                              options={snippetFormatOptions}
                              value={value}
                              onChange={onChange}
                              label="Snippet Format"
                              placeholder="Select format"
                              error={errors?.snippetFormat?.message as string}
                              getOptionValue={(option: any) => option.value}
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* People Also Ask */}
                    <div>
                      <Title as="h6" className="mb-4 text-sm font-medium">
                        People Also Ask
                      </Title>
                      <div className="grid grid-cols-1 gap-3 @lg:gap-4 @2xl:gap-5">
                        <Textarea
                          label="Questions & Answers"
                          placeholder="Enter questions and answers (one per line)"
                          rows={4}
                          {...register('paaQuestions')}
                          error={errors.paaQuestions?.message}
                        />
                      </div>
                    </div>

                    {/* Voice Search */}
                    <div>
                      <Title as="h6" className="mb-4 text-sm font-medium">
                        Voice Search
                      </Title>
                      <div className="grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5">
                        <Input
                          label="Conversational Query"
                          placeholder="Enter conversational query"
                          className="col-span-2"
                          {...register('voiceQuery')}
                          error={errors.voiceQuery?.message}
                        />
                        <Textarea
                          label="Voice Answer"
                          placeholder="Enter voice answer"
                          className="col-span-2"
                          {...register('voiceAnswer')}
                          error={errors.voiceAnswer?.message}
                        />
                      </div>
                    </div>

                    {/* AI Engine */}
                    <div>
                      <Title as="h6" className="mb-4 text-sm font-medium">
                        AI Engine
                      </Title>
                      <div className="grid grid-cols-1 gap-3 @lg:gap-4 @2xl:gap-5">
                        <Textarea
                          label="AI Summary"
                          placeholder="Enter AI-friendly summary"
                          rows={3}
                          {...register('aiSummary')}
                          error={errors.aiSummary?.message}
                        />
                      </div>
                    </div>

                    {/* Structured Data */}
                    <div>
                      <Title as="h6" className="mb-4 text-sm font-medium">
                        Structured Data
                      </Title>
                      <div className="grid grid-cols-1 gap-3 @lg:gap-4 @2xl:gap-5">
                        <Textarea
                          label="Key Facts"
                          placeholder="Enter key facts (comma separated)"
                          {...register('keyFacts')}
                          error={errors.keyFacts?.message}
                        />
                        <Textarea
                          label="Primary Entities"
                          placeholder="Enter primary entities (comma separated)"
                          {...register('primaryEntities')}
                          error={errors.primaryEntities?.message}
                        />
                        <Textarea
                          label="Related Topics"
                          placeholder="Enter related topics (comma separated)"
                          {...register('relatedTopics')}
                          error={errors.relatedTopics?.message}
                        />
                      </div>
                    </div>
                </div>
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
              {id ? 'Update' : 'Create'} Topic
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
