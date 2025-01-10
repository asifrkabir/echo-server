import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "png",
  "jpeg",
  "jpg",
] as const;

const ImageFileZodSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.enum(ACCEPTED_FILE_TYPES),
  path: z.string(),
  size: z
    .number()
    .refine(
      (size) => size <= MAX_UPLOAD_SIZE,
      "File size must be less than 3MB"
    ),
  filename: z.string(),
});

export const ImageFilesArrayZodSchema = z.object({
  files: z
    .record(z.string(), z.array(ImageFileZodSchema))
    .optional()
    .refine(
      (files) =>
        !files ||
        Object.keys(files).length === 0 ||
        Object.values(files).every((arr) => arr.length > 0),
      {
        message: "If images are uploaded, at least one image file is required",
      }
    ),
});
