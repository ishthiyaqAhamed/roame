import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { createReviewSchema } from "@/lib/validations/review.schema";
import { BookingStatus } from "@/lib/generated/prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return jsonError("Unauthorized", 401);
    }

    const { id } = await params;
    const booking = await db.booking.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!booking) {
      return jsonError("Booking not found", 404);
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      return jsonError("Reviews can only be left after a booking is successfully completed", 400);
    }

    const isCustomer = booking.customerId === user.id;
    const isOwner = booking.ownerId === user.id;

    if (!isCustomer && !isOwner) {
      return jsonError("You are not authorized to review this booking", 403);
    }

    const reviewerId = user.id;
    const revieweeId = isCustomer ? booking.ownerId : booking.customerId;

    // Check if review already submitted by this user for this booking
    const existingReview = await db.review.findFirst({
      where: {
        bookingId: booking.id,
        reviewerId,
      },
    });

    if (existingReview) {
      return jsonError("You have already submitted a review for this booking", 409);
    }

    const body = await req.json();
    const parseResult = createReviewSchema.safeParse(body);

    if (!parseResult.success) {
      return jsonError("Validation error", 422, parseResult.error.flatten().fieldErrors);
    }

    const data = parseResult.data;

    const review = await db.review.create({
      data: {
        bookingId: booking.id,
        vehicleId: booking.vehicleId,
        reviewerId,
        revieweeId,
        rating: data.rating,
        cleanlinessRating: data.cleanlinessRating,
        communicationRating: data.communicationRating,
        conditionRating: data.conditionRating,
        comment: data.comment,
      },
    });

    // If customer reviewed the vehicle, update vehicle's average rating
    if (isCustomer && booking.vehicleId) {
      const allVehicleReviews = await db.review.findMany({
        where: { vehicleId: booking.vehicleId },
        select: { rating: true },
      });

      const avg =
        allVehicleReviews.reduce((acc, curr) => acc + curr.rating, 0) /
        allVehicleReviews.length;

      await db.vehicle.update({
        where: { id: booking.vehicleId },
        data: {
          averageRating: Math.round(avg * 10) / 10,
          reviewCount: allVehicleReviews.length,
        },
      });
    }

    return jsonSuccess({ review }, "Thank you! Your verified review has been published.", 201);
  } catch (error) {
    console.error("Review creation error:", error);
    return jsonError("Internal server error", 500);
  }
}
