import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

// form zod validation schema for education topics
export const eduTopicsFormSchema = z.object({
  name: z.string().min(1, { message: 'Topics name is required' }),
  description: z.string().optional(),
  images: z.array(fileSchema).optional(),

  // SEO - Core SEO
  pageUrl: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),

  // SEO - Open Graph
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.array(fileSchema).optional(),
  ogType: z.string().optional(),

  // SEO - Twitter Card
  twitterCardType: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.array(fileSchema).optional(),

  // SEO - Technical SEO
  canonicalUrl: z.string().optional(),
  robotsDirective: z.string().optional(),

  // AEO - Featured Snippet
  snippetTargetContent: z.string().optional(),
  snippetFormat: z.string().optional(),

  // AEO - People Also Ask
  paaQuestions: z.string().optional(),

  // AEO - Voice Search
  voiceQuery: z.string().optional(),
  voiceAnswer: z.string().optional(),

  // AEO - AI Engine
  aiSummary: z.string().optional(),

  // AEO - Structured Data
  keyFacts: z.string().optional(),
  primaryEntities: z.string().optional(),
  relatedTopics: z.string().optional(),
});

// generate form types from zod validation schema
export type EduTopicsFormInput = z.infer<typeof eduTopicsFormSchema>;
