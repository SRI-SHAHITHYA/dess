'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SubmitHandler, Controller } from 'react-hook-form';
import QuillLoader from '@core/components/loader/quill-loader';
import { Button, Input, Text, Title, Textarea, Select } from 'rizzui';
import cn from '@core/utils/class-names';
import { Form } from '@core/ui/form';
import {
  EduTopicsFormInput,
  eduTopicsFormSchema,
} from '@/validators/create-edu-topics.schema';
import UploadZone from '@core/ui/file-upload/upload-zone';

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

// main topics form component for create and update topics
export default function CreateEduTopics({
  id,
  topics,
  isModalView = true,
}: {
  id?: string;
  isModalView?: boolean;
  topics?: EduTopicsFormInput;
}) {
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<EduTopicsFormInput> = (data) => {
    // set timeout only required to display loading state of the create topics button
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('createEduTopics data ->', data);
      setReset({
        name: '',
        description: '',
        images: '',
        pageUrl: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogType: '',
        twitterCardType: '',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
        canonicalUrl: '',
        robotsDirective: '',
        snippetTargetContent: '',
        snippetFormat: '',
        paaQuestions: '',
        voiceQuery: '',
        voiceAnswer: '',
        aiSummary: '',
        keyFacts: '',
        primaryEntities: '',
        relatedTopics: '',
      });
    }, 600);
  };

  return (
    <Form<EduTopicsFormInput>
      validationSchema={eduTopicsFormSchema}
      resetValues={reset}
      onSubmit={onSubmit}
      useFormProps={{
        mode: 'onChange',
        defaultValues: topics,
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
                title={'Add new topics:'}
                description={'Edit your topics information from here'}
                isModalView={isModalView}
              >
                <Input
                  label="Topics Name"
                  placeholder="Enter topics name"
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
                description="Upload your topics image here"
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
                              getOptionValue={(option) => option.value}
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
                              getOptionValue={(option) => option.value}
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
                              getOptionValue={(option) => option.value}
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
                              getOptionValue={(option) => option.value}
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
              {id ? 'Update' : 'Create'} Topics
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
