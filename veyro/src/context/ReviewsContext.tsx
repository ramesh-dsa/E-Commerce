"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Review, ReviewFit, ReviewStats } from "@/types";
import {
  getSeedReviewsForProduct,
  calculateReviewStats,
} from "@/data/reviews";

interface AddReviewInput {
  productId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  fit: ReviewFit;
  sizePurchased?: string;
}

interface ReviewsContextType {
  getReviews: (productId: string) => Review[];
  getStats: (productId: string) => ReviewStats;
  addReview: (input: AddReviewInput) => Review;
  voteReview: (reviewId: string, type: "helpful" | "unhelpful") => boolean;
  hasVoted: (reviewId: string) => "helpful" | "unhelpful" | null;
  userVotes: Record<string, "helpful" | "unhelpful">;
  isLoaded: boolean;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

const STORAGE_CUSTOM_REVIEWS = "veyro_custom_reviews_v1";
const STORAGE_USER_VOTES = "veyro_review_votes_v1";
const STORAGE_VOTE_DELTAS = "veyro_vote_deltas_v1";

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [customReviews, setCustomReviews] = useState<Review[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, "helpful" | "unhelpful">>({});
  const [voteDeltas, setVoteDeltas] = useState<Record<string, { helpful: number; unhelpful: number }>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted custom reviews and votes from localStorage on client mount
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedReviews = localStorage.getItem(STORAGE_CUSTOM_REVIEWS);
        const storedVotes = localStorage.getItem(STORAGE_USER_VOTES);
        const storedDeltas = localStorage.getItem(STORAGE_VOTE_DELTAS);

        if (storedReviews) {
          try {
            setCustomReviews(JSON.parse(storedReviews));
          } catch {}
        }
        if (storedVotes) {
          try {
            setUserVotes(JSON.parse(storedVotes));
          } catch {}
        }
        if (storedDeltas) {
          try {
            setVoteDeltas(JSON.parse(storedDeltas));
          } catch {}
        }
      } catch (e) {
        console.error("Failed to load reviews or votes from localStorage", e);
      } finally {
        setIsLoaded(true);
      }
    });
  }, []);

  // Save custom reviews when changed
  const persistCustomReviews = useCallback((reviews: Review[]) => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error("Failed to save custom reviews", e);
    }
  }, []);

  // Save user votes and deltas
  const persistVotes = useCallback(
    (
      votes: Record<string, "helpful" | "unhelpful">,
      deltas: Record<string, { helpful: number; unhelpful: number }>
    ) => {
      try {
        localStorage.setItem(STORAGE_USER_VOTES, JSON.stringify(votes));
        localStorage.setItem(STORAGE_VOTE_DELTAS, JSON.stringify(deltas));
      } catch (e) {
        console.error("Failed to save votes", e);
      }
    },
    []
  );

  /**
   * Retrieves merged reviews for a product (custom submitted + seed data),
   * applying any user vote deltas.
   */
  const getReviews = useCallback(
    (productId: string): Review[] => {
      const seed = getSeedReviewsForProduct(productId);
      const customForProduct = customReviews.filter((r) => r.productId === productId);

      // Custom reviews appear first (most recent), then seed reviews
      const combined = [...customForProduct, ...seed];

      // Apply vote deltas
      return combined.map((review) => {
        const delta = voteDeltas[review.id];
        if (!delta) return review;
        return {
          ...review,
          helpfulCount: review.helpfulCount + (delta.helpful || 0),
          unhelpfulCount: review.unhelpfulCount + (delta.unhelpful || 0),
        };
      });
    },
    [customReviews, voteDeltas]
  );

  /**
   * Calculates dynamic statistics (average rating, count, distribution)
   */
  const getStats = useCallback(
    (productId: string): ReviewStats => {
      const reviews = getReviews(productId);
      return calculateReviewStats(reviews);
    },
    [getReviews]
  );

  /**
   * Appends a newly submitted customer review
   */
  const addReview = useCallback(
    (input: AddReviewInput): Review => {
      const newReview: Review = {
        id: `user-rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        productId: input.productId,
        author: input.author.trim() || "Verified Buyer",
        rating: Math.min(Math.max(input.rating, 1), 5),
        title: input.title.trim(),
        content: input.content.trim(),
        date: new Date().toISOString().split("T")[0],
        verified: true,
        fit: input.fit,
        sizePurchased: input.sizePurchased,
        helpfulCount: 0,
        unhelpfulCount: 0,
      };

      setCustomReviews((prev) => {
        const updated = [newReview, ...prev];
        persistCustomReviews(updated);
        return updated;
      });

      return newReview;
    },
    [persistCustomReviews]
  );

  /**
   * Votes on a review (helpful or unhelpful) with duplicate-vote prevention.
   */
  const voteReview = useCallback(
    (reviewId: string, type: "helpful" | "unhelpful"): boolean => {
      if (userVotes[reviewId]) {
        // User already voted on this review — duplicate vote blocked!
        return false;
      }

      const updatedVotes = {
        ...userVotes,
        [reviewId]: type,
      };

      const currentDelta = voteDeltas[reviewId] || { helpful: 0, unhelpful: 0 };
      const updatedDeltas = {
        ...voteDeltas,
        [reviewId]: {
          helpful: currentDelta.helpful + (type === "helpful" ? 1 : 0),
          unhelpful: currentDelta.unhelpful + (type === "unhelpful" ? 1 : 0),
        },
      };

      setUserVotes(updatedVotes);
      setVoteDeltas(updatedDeltas);
      persistVotes(updatedVotes, updatedDeltas);

      return true;
    },
    [userVotes, voteDeltas, persistVotes]
  );

  /**
   * Returns whether current user has voted on a specific review
   */
  const hasVoted = useCallback(
    (reviewId: string): "helpful" | "unhelpful" | null => {
      return userVotes[reviewId] ?? null;
    },
    [userVotes]
  );

  const contextValue = useMemo(
    () => ({
      getReviews,
      getStats,
      addReview,
      voteReview,
      hasVoted,
      userVotes,
      isLoaded,
    }),
    [getReviews, getStats, addReview, voteReview, hasVoted, userVotes, isLoaded]
  );

  return (
    <ReviewsContext.Provider value={contextValue}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
