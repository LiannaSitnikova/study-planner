import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().trim().min(3, 'Назва має містити щонайменше 3 символи'),
  description: z.string().trim().max(300, 'Максимум 300 символів'),
  category: z.string().trim().min(1, 'Вкажіть категорію'),
  priority: z.enum(['low', 'medium', 'high']),
});

export type TaskFormData = z.infer<typeof taskSchema>;