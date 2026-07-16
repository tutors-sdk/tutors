import { z } from "zod";

export const IconTypeSchema = z.object({
  type: z.string(),
  color: z.string()
});

export const CourseSentimentIdSchema = z.enum(["neutral", "fine", "delighted", "confident", "overwhelmed", "confused", "drained"]);

export const TutorsIdSchema = z.object({
  name: z.string(),
  login: z.string(),
  email: z.string(),
  image: z.string(),
  share: z.string(),
  sentiment: z.string()
});

export const CourseVisitSchema = z.object({
  id: z.string(),
  title: z.string(),
  img: z.string().optional(),
  icon: IconTypeSchema.optional(),
  lastVisit: z.coerce.date(),
  credits: z.string(),
  visits: z.number().int().positive().optional(),
  private: z.boolean().optional(),
  favourite: z.boolean().optional()
});

export const LoUserSchema = z.object({
  fullName: z.string(),
  avatar: z.string(),
  id: z.string(),
  sentiment: z.string()
});

export const LoRecordSchema = z.object({
  courseId: z.string(),
  courseUrl: z.string(),
  courseTitle: z.string(),
  loRoute: z.string(),
  title: z.string(),
  img: z.string().optional(),
  icon: IconTypeSchema.optional(),
  isPrivate: z.boolean(),
  user: LoUserSchema.optional(),
  type: z.string()
});

export const TutorsConnectLatestRowSchema = z.object({
  course_id: z.string(),
  student_id: z.string(),
  payload: z.record(z.unknown()),
  received_at: z.string()
});

export const CatalogueEntrySchema = z.object({
  course_id: z.string(),
  visited_at: z.coerce.date(),
  visit_count: z.number().int().nonnegative(),
  course_record: z.any()
});

export const LayoutTypeSchema = z.enum(["expanded", "compacted"]);
export const CardStyleTypeSchema = z.enum(["portrait", "landscape", "circular"]);

export const ThemeSchema = z.object({
  name: z.string(),
  icons: z.record(IconTypeSchema)
});

export const CardDetailsSchema = z.object({
  route: z.string(),
  title: z.string().optional(),
  type: z.string(),
  summary: z.string().optional(),
  summaryEx: z.string().optional(),
  icon: IconTypeSchema.optional(),
  img: z.string().optional(),
  student: LoUserSchema.optional(),
  video: z.string().optional(),
  metric: z.string().optional()
});

export const LoSchema: z.ZodType = z.object({
  route: z.string(),
  type: z.string(),
  title: z.string(),
  shortTitle: z.string().optional(),
  summary: z.string().optional(),
  contentMd: z.string().optional(),
  contentHtml: z.string().optional(),
  img: z.string().optional(),
  video: z.string().optional(),
  icon: IconTypeSchema.optional(),
  breadCrumbs: z.array(z.any()).optional(),
  parentLo: z.any().optional(),
  parentCourse: z.any().optional(),
  los: z.array(z.any()).optional()
});

export const LabStepSchema = z.object({
  shortTitle: z.string(),
  title: z.string(),
  contentMd: z.string().optional(),
  contentHtml: z.string().optional(),
  type: z.string()
});

export const LabSchema = LoSchema.extend({
  type: z.literal("lab"),
  los: z.array(LabStepSchema),
  pdf: z.string().optional()
});

export const CourseSchema = z.object({
  courseId: z.string(),
  courseUrl: z.string(),
  title: z.string(),
  img: z.string().optional(),
  route: z.string(),
  type: z.literal("course"),
  los: z.array(LoSchema),
  properties: z
    .object({
      credits: z.string().optional(),
      icon: z.any().optional(),
      private: z.any().optional()
    })
    .passthrough()
    .optional(),
  isPrivate: z.boolean().optional(),
  areLabStepsAutoNumbered: z.boolean().optional(),
  authLevel: z.number().optional(),
  enrollment: z
    .object({
      whitelist: z.array(z.string()).optional()
    })
    .optional()
});

export const CourseUrlResultSchema = z.object({
  courseId: z.string(),
  courseUrl: z.string()
});
