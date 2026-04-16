// /server/contracts/content.schema.ts

import { z } from "zod";

export const ContentSchema = z.object({
	id: z.string().uuid().optional(),

	title: z.string().min(5),
	slug: z.string().min(3),

	canonicalUrl: z
		.string()
		.url("canonicalUrl must be a valid absolute URL"),

	content: z.string().min(10),

	status: z.enum(["draft", "published"]),

	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

// Derived type
export type Content = z.infer<typeof ContentSchema>;