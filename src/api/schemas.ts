import { z } from "zod";
import { OPEN_CATEGORY_CEILING_AGL_M } from "../constants.js";

export const weightClassSchema = z.enum(["c0", "c1", "c2"]);

export const authCredentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(128),
});

export const authRegisterSchema = authCredentialsSchema.extend({
  name: z.string().trim().min(2).max(80),
  operatorNumber: z
    .string()
    .trim()
    .max(64)
    .optional()
    .nullable()
    .transform((v) => (v && v.length > 0 ? v : null)),
});

export const updateAccountSchema = z.object({
  name: z.string().trim().min(2).max(80),
  bio: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((v) => (v && v.length > 0 ? v : null)),
  operatorNumber: z
    .string()
    .trim()
    .max(64)
    .optional()
    .nullable()
    .transform((v) => (v && v.length > 0 ? v : null)),
  removeAvatar: z
    .union([z.boolean(), z.literal("true"), z.literal("false"), z.null()])
    .optional()
    .transform((v) => v === true || v === "true"),
});

export const obstacleTypeSchema = z.enum([
  "construction",
  "crane",
  "electric_line",
  "air_sports",
  "other",
]);

export const obstacleVoteSchema = z.object({
  value: z.enum(["up", "down"]).nullable(),
});

export const createObstacleSchema = z.object({
  type: obstacleTypeSchema,
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  heightM: z.number().min(0).max(2000),
  message: z.string().trim().max(500).optional().nullable(),
});

export const bboxObstaclesQuerySchema = z.object({
  west: z.coerce.number(),
  south: z.coerce.number(),
  east: z.coerce.number(),
  north: z.coerce.number(),
  limit: z.coerce.number().min(1).max(2000).default(500),
});

export const droneProfileQuerySchema = z.object({
  altitudeAgl: z.coerce
    .number()
    .min(0)
    .max(5000)
    .default(OPEN_CATEGORY_CEILING_AGL_M),
  weightClass: weightClassSchema.default("c0"),
  operationCategory: z.enum(["open", "specific"]).default("open"),
});

export const pointStatusQuerySchema = droneProfileQuerySchema.extend({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

export const bboxZonesQuerySchema = droneProfileQuerySchema.extend({
  west: z.coerce.number(),
  south: z.coerce.number(),
  east: z.coerce.number(),
  north: z.coerce.number(),
  limit: z.coerce.number().min(1).max(2000).default(500),
});

export function openCategoryCeiling(altitudeAgl: number): number {
  return Math.min(altitudeAgl, OPEN_CATEGORY_CEILING_AGL_M);
}
