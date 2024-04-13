import z from "zod";

export const taskStatusEnumSchema = z.enum([
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "ARCHIVED",
]);

export type TaskStatusEnum = z.infer<typeof taskStatusEnumSchema>;

export const createTaskInputSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});

export type CreateTaskInputType = z.infer<typeof createTaskInputSchema>;

export const updateTaskInputSchema = z.object({
  id: z.coerce.number().int(),
});

export type UpdateTaskInputType = z.infer<typeof updateTaskInputSchema>;

export const updateTaskStatusInputSchema = updateTaskInputSchema.extend({
  status: taskStatusEnumSchema,
});

export type UpdateTaskStatusInputType = z.infer<
  typeof updateTaskStatusInputSchema
>;
