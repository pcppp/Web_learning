import { z } from 'zod';

export const applicationInfoSchema = z.object({
  applicationSchool: z.string().min(1, { message: '请填写报考院校' }),
  applicationMajor: z.string().min(1, { message: '请填写报考专业' }),
});
export type ApplicationInfo = z.infer<typeof applicationInfoSchema>;
