import { z } from "zod";

export const memorialSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters"),
  dob: z.string().optional(),
  dod: z.string().optional(),
  bio: z.string().optional(),
  visibility: z.enum(["public", "private"]),
});

export type MemorialInput = z.infer<typeof memorialSchema>;

export const memorySchema = z
  .object({
    type: z.enum(["text", "image", "video"]),
    content: z.string().optional(),
    video_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.type === "text") return !!data.content?.trim();
      return true;
    },
    { message: "Text content is required", path: ["content"] }
  )
  .refine(
    (data) => {
      if (data.type === "video") return !!data.video_url?.trim();
      return true;
    },
    { message: "Video URL is required", path: ["video_url"] }
  );

export type MemoryInput = z.infer<typeof memorySchema>;
