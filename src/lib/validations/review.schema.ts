import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  cleanlinessRating: z.number().int().min(1).max(5).optional(),
  communicationRating: z.number().int().min(1).max(5).optional(),
  conditionRating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(5, "Please provide a review comment (at least 5 characters)").max(1000),
});
