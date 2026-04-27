import { z } from 'zod'

const baseSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional(),
  message: z.string().max(5000).optional(),
})

export const generalSubmissionSchema = baseSchema.extend({
  type: z.literal('general'),
  serviceInterest: z.string().max(100).optional(),
})

export const launchpadSubmissionSchema = baseSchema.extend({
  type: z.literal('launchpad'),
  businessName: z.string().min(1).max(200),
  businessType: z.string().max(100).optional(),
  budgetRange: z.enum(['< 50K', '50K-1L', '1L-3L', '3L+']).optional(),
  timeline: z.enum(['ASAP', '1-2 months', '3-6 months', 'flexible']).optional(),
  projectDescription: z.string().min(1).max(10000),
})

export const workshopSubmissionSchema = baseSchema.extend({
  type: z.literal('workshop'),
  preferredWorkshop: z.string().max(100).optional(),
})

export const submissionSchema = z.discriminatedUnion('type', [
  generalSubmissionSchema,
  launchpadSubmissionSchema,
  workshopSubmissionSchema,
])

export type SubmissionInput = z.infer<typeof submissionSchema>
