import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema } from './common-rules';

// form zod validation schema for education categories
export const eduCategoryFormSchema = z.object({
  name: z.string().min(1, { message: messages.catNameIsRequired }),
  type: z.string().min(1, { message: 'Type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  description: z.string().optional(),
  images: z.array(fileSchema).optional(),
});

// generate form types from zod validation schema
export type EduCategoryFormInput = z.infer<typeof eduCategoryFormSchema>;
