"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Product, ReviewFit } from "@/types";
import { useReviews } from "@/context/ReviewsContext";
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Filter,
  X,
  Plus,
  ArrowRight,
  ChevronDown,
  Check,
} from "lucide-react";

interface ProductReviewsSectionProps {
  product: Product;
}

type SortOption = "recent" | "helpful" | "rating-desc" | "rating-asc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recent", label: "Most Recent" },
  { value: "helpful", label: "Most Helpful" },
  { value: "rating-desc", label: "Highest Rating" },
  { value: "rating-asc", label: "Lowest Rating" },
];

const STAR_LABELS: Record<number, string> = {
  1: "Poor — Needs improvement",
  2: "Fair — Below expectations",
  3: "Average — Good but room to improve",
  4: "Very Good — Highly recommended",
  5: "Exceptional — Flawless quality & fit",
};

export function ProductReviewsSection({ product }: ProductReviewsSectionProps) {
  const { getReviews, getStats, addReview, voteReview, hasVoted } = useReviews();

  // ── Component State ────────────────────────────────────────────────────────
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [visibleCount, setVisibleCount] = useState(4);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // ── Form State ─────────────────────────────────────────────────────────────
  const [formRating, setFormRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formAuthor, setFormAuthor] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formFit, setFormFit] = useState<ReviewFit>("True to Size");
  const [formSize, setFormSize] = useState(product.sizes?.[0] || "");
  const [formErrors, setFormErrors] = useState<{ rating?: string; content?: string; title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch reviews & stats reactively from ReviewsContext
  const allReviews = getReviews(product.id);
  const stats = getStats(product.id);

  // Close sort dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    if (sortDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortDropdownOpen]);

  // Handle escape key to close write-review modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isWriteModalOpen) {
        setIsWriteModalOpen(false);
      }
    }
    if (isWriteModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isWriteModalOpen]);

  // ── Filtered & Sorted Reviews ─────────────────────────────────────────────
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...allReviews];

    // Filter by Star Rating
    if (selectedRatingFilter !== "ALL") {
      result = result.filter(
        (r) => Math.round(r.rating) === selectedRatingFilter
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === "helpful") {
        return b.helpfulCount - a.helpfulCount;
      }
      if (sortBy === "rating-desc") {
        return b.rating - a.rating;
      }
      if (sortBy === "rating-asc") {
        return a.rating - b.rating;
      }
      return 0;
    });

    return result;
  }, [allReviews, selectedRatingFilter, sortBy]);

  const displayedReviews = filteredAndSortedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSortedReviews.length;

  // ── Form Submission ───────────────────────────────────────────────────────
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { rating?: string; content?: string; title?: string } = {};
    if (formRating === 0) {
      errors.rating = "Please select a star rating between 1 and 5";
    }
    if (!formTitle.trim()) {
      errors.title = "Please provide a headline for your review";
    }
    if (!formContent.trim() || formContent.trim().length < 10) {
      errors.content = "Please write at least 10 characters detailing your experience";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    // Simulate luxury brief delay before adding
    setTimeout(() => {
      addReview({
        productId: product.id,
        author: formAuthor.trim() || "Verified Buyer",
        rating: formRating,
        title: formTitle.trim(),
        content: formContent.trim(),
        fit: formFit,
        sizePurchased: formSize || undefined,
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after short success view
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsWriteModalOpen(false);
        setFormRating(0);
        setHoverRating(0);
        setFormAuthor("");
        setFormTitle("");
        setFormContent("");
        setFormFit("True to Size");
      }, 1200);
    }, 400);
  };

  return (
    <section
      id="customer-reviews"
      aria-label="Customer Reviews & Ratings"
      className="w-full pt-16 pb-20 border-t border-veyro-border scroll-mt-24"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-veyro-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono tracking-widest text-veyro-muted uppercase">
                [ 004 ] ARCHIVAL VERIFICATION
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-veyro-black leading-none">
              Customer Reviews
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-veyro-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.99] w-full sm:w-auto"
          >
            <Plus size={15} />
            <span>Write a Review</span>
          </button>
        </div>

        {/* ── SUMMARY DASHBOARD (Prominent average, bar chart, fit breakdown) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-veyro-surface border border-veyro-border p-6 sm:p-8 rounded-[3px] mb-12">
          {/* Col 1: Overall Average & Recommendation */}
          <div className="lg:col-span-4 flex flex-col justify-between pr-0 lg:pr-6 lg:border-r lg:border-veyro-border">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-veyro-muted">
                Overall Rating
              </span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-veyro-black">
                  {stats.averageRating.toFixed(1)}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={17}
                        className={
                          star <= Math.round(stats.averageRating)
                            ? "fill-veyro-yellow text-veyro-yellow"
                            : "fill-neutral-200 text-neutral-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-veyro-muted mt-1 font-medium">
                    Based on {stats.totalCount} verified reviews
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-veyro-border/60">
              <div className="flex items-center gap-2 text-xs font-bold text-veyro-black">
                <CheckCircle2 size={16} className="text-[#10b981]" />
                <span>{stats.recommendationPercentage}% of buyers recommend this product</span>
              </div>
              <p className="text-[11px] text-veyro-subtle mt-1">
                Authentic reviews from verified buyers across India.
              </p>
            </div>
          </div>

          {/* Col 2: Interactive Rating Distribution Bar Chart */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-veyro-muted mb-3 block">
              Rating Distribution
            </span>
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
                const percent =
                  stats.totalCount > 0
                    ? Math.round((count / stats.totalCount) * 100)
                    : 0;
                const isSelected = selectedRatingFilter === star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setSelectedRatingFilter((prev) => (prev === star ? "ALL" : star))
                    }
                    className={`w-full flex items-center gap-3 text-xs group cursor-pointer text-left transition-opacity ${
                      selectedRatingFilter !== "ALL" && !isSelected
                        ? "opacity-45 hover:opacity-100"
                        : "opacity-100"
                    }`}
                    aria-label={`Filter by ${star} star reviews (${count} reviews, ${percent} percent)`}
                  >
                    <span className="w-11 font-mono font-bold text-veyro-black flex items-center gap-1">
                      {star} <Star size={11} className="fill-veyro-yellow text-veyro-yellow inline" />
                    </span>

                    {/* Progress Bar Container */}
                    <div className="flex-1 h-2 bg-neutral-200/80 rounded-[1px] overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-500 rounded-[1px] ${
                          isSelected ? "bg-veyro-black" : "bg-veyro-yellow"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span className="w-10 font-mono text-[11px] text-right font-medium text-veyro-muted group-hover:text-veyro-black transition-colors">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col 3: Fit & Sizing Feedback */}
          <div className="lg:col-span-3 flex flex-col justify-between pl-0 lg:pl-6 lg:border-l lg:border-veyro-border">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-veyro-muted block mb-3">
                Customer Fit Gauge
              </span>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-veyro-black">True to Size</span>
                    <span className="font-mono text-veyro-muted">{stats.fitBreakdown.trueToSize}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-[1px] overflow-hidden">
                    <div
                      className="h-full bg-veyro-black rounded-[1px]"
                      style={{ width: `${stats.fitBreakdown.trueToSize}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-veyro-subtle">Runs Large</span>
                    <span className="font-mono text-veyro-muted">{stats.fitBreakdown.runsLarge}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-[1px] overflow-hidden">
                    <div
                      className="h-full bg-neutral-400 rounded-[1px]"
                      style={{ width: `${stats.fitBreakdown.runsLarge}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-veyro-subtle">Runs Small</span>
                    <span className="font-mono text-veyro-muted">{stats.fitBreakdown.runsSmall}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-[1px] overflow-hidden">
                    <div
                      className="h-full bg-neutral-400 rounded-[1px]"
                      style={{ width: `${stats.fitBreakdown.runsSmall}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-veyro-subtle mt-4 uppercase tracking-wider">
              {stats.fitBreakdown.trueToSize >= 75
                ? "Most customers advise ordering your regular size."
                : "Refer to sizing guide before ordering."}
            </p>
          </div>
        </div>

        {/* ── FILTER & SORT CONTROLS TOOLBAR ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Star Filter Chips */}
          <div
            role="toolbar"
            aria-label="Filter reviews by rating"
            className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
          >
            <span className="text-[11px] font-bold text-veyro-muted uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Filter size={12} /> Filter:
            </span>

            <button
              type="button"
              onClick={() => setSelectedRatingFilter("ALL")}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-bold tracking-tight transition-all duration-200 shrink-0 cursor-pointer ${
                selectedRatingFilter === "ALL"
                  ? "bg-veyro-black text-white shadow-xs"
                  : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
              }`}
            >
              All ({allReviews.length})
            </button>

            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
              const isSelected = selectedRatingFilter === star;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRatingFilter(isSelected ? "ALL" : star)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-[2px] text-xs font-bold tracking-tight transition-all duration-200 shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-veyro-black text-white shadow-xs"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                  }`}
                >
                  <span>{star}</span>
                  <Star
                    size={11}
                    className={
                      isSelected
                        ? "fill-veyro-yellow text-veyro-yellow"
                        : "fill-neutral-400 text-neutral-400"
                    }
                  />
                  <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}

            {selectedRatingFilter !== "ALL" && (
              <button
                type="button"
                onClick={() => setSelectedRatingFilter("ALL")}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-veyro-muted hover:text-veyro-black ml-2 underline underline-offset-2 cursor-pointer shrink-0"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div ref={sortRef} className="relative shrink-0 flex items-center justify-between md:justify-end gap-2">
            <span className="text-[11px] font-bold text-veyro-muted uppercase tracking-wider">
              Sort by:
            </span>

            <button
              type="button"
              onClick={() => setSortDropdownOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={sortDropdownOpen}
              className="inline-flex items-center justify-between gap-3 bg-white border border-veyro-border hover:border-veyro-black text-xs font-bold text-veyro-black px-3.5 py-1.5 rounded-[2px] transition-colors cursor-pointer select-none min-w-[150px]"
            >
              <span>
                {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label}
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  sortDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortDropdownOpen && (
              <div
                role="listbox"
                className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-veyro-border rounded-[2px] shadow-xl py-1 z-40 animate-in fade-in zoom-in-95 duration-100"
              >
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = opt.value === sortBy;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortBy(opt.value);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? "font-bold text-veyro-black bg-veyro-surface"
                          : "font-medium text-neutral-600 hover:text-veyro-black hover:bg-neutral-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={13} className="text-veyro-black" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── REVIEWS CARDS LIST ── */}
        {filteredAndSortedReviews.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-veyro-border rounded-[3px] bg-veyro-surface/40">
            <p className="text-sm font-bold uppercase tracking-wider text-veyro-black mb-1">
              No reviews match your selected filter
            </p>
            <p className="text-xs text-veyro-muted mb-4">
              Try selecting another star rating or reset filters to view all reviews.
            </p>
            <button
              type="button"
              onClick={() => setSelectedRatingFilter("ALL")}
              className="px-4 py-2 bg-veyro-black text-white text-xs font-bold uppercase tracking-wider rounded-[2px] cursor-pointer hover:bg-neutral-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedReviews.map((review) => {
              const votedState = hasVoted(review.id);
              const isHelpfulActive = votedState === "helpful";
              const isUnhelpfulActive = votedState === "unhelpful";
              const isLocked = votedState !== null;

              return (
                <article
                  key={review.id}
                  className="bg-white border border-veyro-border p-5 sm:p-6 rounded-[2px] transition-all duration-200 hover:border-neutral-400 hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 mb-3">
                    {/* Reviewer Meta */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-veyro-black">
                          {review.author}
                        </span>

                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-[2px] tracking-wide">
                            <Check size={11} className="stroke-[2.5]" /> Verified Buyer
                          </span>
                        )}

                        {review.sizePurchased && (
                          <span className="text-[10px] font-mono text-veyro-muted">
                            • Size {review.sizePurchased}
                          </span>
                        )}

                        <span className="text-[10px] font-medium text-veyro-subtle">
                          • {review.fit}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating + Date */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div
                        className="flex items-center gap-0.5"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={13}
                            className={
                              star <= review.rating
                                ? "fill-veyro-yellow text-veyro-yellow"
                                : "fill-neutral-200 text-neutral-200"
                            }
                          />
                        ))}
                      </div>

                      <time
                        dateTime={review.date}
                        className="text-[11px] font-mono text-veyro-muted"
                      >
                        {review.date}
                      </time>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h3 className="text-sm sm:text-base font-bold text-veyro-black mb-2 leading-snug">
                    {review.title}
                  </h3>

                  {/* Review Content */}
                  <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed font-normal mb-4">
                    {review.content}
                  </p>

                  {/* Review Card Footer: Helpful Voting Buttons with Duplicate-Vote Prevention */}
                  <div className="pt-3 border-t border-veyro-border/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-veyro-subtle">
                      Was this review helpful?
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Helpful Button */}
                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => voteReview(review.id, "helpful")}
                        aria-label={`Mark as helpful. Currently ${review.helpfulCount} votes`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-semibold transition-all duration-200 ${
                          isHelpfulActive
                            ? "bg-veyro-black text-white cursor-default"
                            : isLocked
                            ? "opacity-50 cursor-not-allowed text-neutral-400 bg-neutral-100"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer active:scale-95"
                        }`}
                      >
                        <ThumbsUp size={12} className={isHelpfulActive ? "fill-white" : ""} />
                        <span>Yes ({review.helpfulCount})</span>
                      </button>

                      {/* Not Helpful Button */}
                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => voteReview(review.id, "unhelpful")}
                        aria-label={`Mark as unhelpful. Currently ${review.unhelpfulCount} votes`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-semibold transition-all duration-200 ${
                          isUnhelpfulActive
                            ? "bg-neutral-800 text-white cursor-default"
                            : isLocked
                            ? "opacity-50 cursor-not-allowed text-neutral-400 bg-neutral-100"
                            : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer active:scale-95"
                        }`}
                      >
                        <ThumbsDown size={12} className={isUnhelpfulActive ? "fill-white" : ""} />
                        <span>No ({review.unhelpfulCount})</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ── LOAD MORE BUTTON ── */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-veyro-black text-veyro-black hover:bg-veyro-black hover:text-white text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all duration-200 cursor-pointer shadow-xs hover:shadow"
            >
              <span>
                Load More Reviews (
                {filteredAndSortedReviews.length - visibleCount} remaining)
              </span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── WRITE A REVIEW MODAL ── */}
      {isWriteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="write-review-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-xl bg-white border border-veyro-border rounded-[3px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-veyro-border bg-veyro-surface">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-veyro-muted uppercase block">
                  AUTHENTIC FEEDBACK
                </span>
                <h3
                  id="write-review-title"
                  className="text-lg font-black uppercase tracking-tight text-veyro-black"
                >
                  Review: {product.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsWriteModalOpen(false)}
                aria-label="Close review dialog"
                className="p-1.5 text-neutral-500 hover:text-veyro-black hover:bg-neutral-200/60 rounded-[2px] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Success State */}
            {submitSuccess ? (
              <div className="p-10 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-[2px] flex items-center justify-center mb-4">
                  <Check size={28} className="stroke-[2.5]" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight text-veyro-black mb-1">
                  Review Published
                </h4>
                <p className="text-xs text-veyro-muted max-w-sm">
                  Your verified review has been recorded and added to the top of the archival feed.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitReview}
                className="p-6 overflow-y-auto space-y-5"
              >
                {/* 1. Interactive Star Rating Selector with Smooth Hover-Preview */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-veyro-black mb-1.5">
                    Your Rating <span className="text-red-500">*</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1"
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled =
                          star <= (hoverRating > 0 ? hoverRating : formRating);

                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => {
                              setFormRating(star);
                              if (formErrors.rating) {
                                setFormErrors((prev) => ({ ...prev, rating: undefined }));
                              }
                            }}
                            onMouseEnter={() => setHoverRating(star)}
                            onFocus={() => setHoverRating(star)}
                            onBlur={() => setHoverRating(0)}
                            aria-label={`Rate ${star} out of 5 stars — ${STAR_LABELS[star]}`}
                            className="p-1 hover:scale-120 active:scale-95 transition-transform duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-veyro-black rounded-xs"
                          >
                            <Star
                              size={24}
                              className={`transition-colors duration-150 ${
                                isFilled
                                  ? "fill-veyro-yellow text-veyro-yellow drop-shadow-[0_1px_4px_rgba(252,208,23,0.4)]"
                                  : "fill-neutral-200 text-neutral-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <span className="text-xs font-medium text-veyro-muted ml-2">
                      {hoverRating > 0
                        ? STAR_LABELS[hoverRating]
                        : formRating > 0
                        ? STAR_LABELS[formRating]
                        : "Click to rate"}
                    </span>
                  </div>

                  {formErrors.rating && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">
                      {formErrors.rating}
                    </p>
                  )}
                </div>

                {/* 2. Fit Feedback */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-veyro-black mb-1.5">
                    How does it fit?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Runs Small", "True to Size", "Runs Large"] as ReviewFit[]).map(
                      (fitOption) => (
                        <button
                          key={fitOption}
                          type="button"
                          onClick={() => setFormFit(fitOption)}
                          className={`py-2 px-3 text-xs font-bold rounded-[2px] border transition-all cursor-pointer text-center ${
                            formFit === fitOption
                              ? "bg-veyro-black text-white border-veyro-black shadow-xs"
                              : "bg-white text-neutral-700 border-veyro-border hover:border-neutral-400"
                          }`}
                        >
                          {fitOption}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 3. Review Headline / Title */}
                <div>
                  <label
                    htmlFor="review-title"
                    className="block text-xs font-bold uppercase tracking-wider text-veyro-black mb-1.5"
                  >
                    Review Headline <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="review-title"
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      if (formErrors.title) {
                        setFormErrors((prev) => ({ ...prev, title: undefined }));
                      }
                    }}
                    placeholder="e.g. Unmatched collar construction and perfect drape"
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-[2px] focus:outline-none transition-colors ${
                      formErrors.title
                        ? "border-red-500 focus:border-red-600"
                        : "border-veyro-border focus:border-veyro-black"
                    }`}
                  />
                  {formErrors.title && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                {/* 4. Review Body */}
                <div>
                  <label
                    htmlFor="review-content"
                    className="block text-xs font-bold uppercase tracking-wider text-veyro-black mb-1.5"
                  >
                    Your Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="review-content"
                    rows={4}
                    required
                    value={formContent}
                    onChange={(e) => {
                      setFormContent(e.target.value);
                      if (formErrors.content) {
                        setFormErrors((prev) => ({ ...prev, content: undefined }));
                      }
                    }}
                    placeholder="Describe the fabric feel, drape, longevity after wash, and overall styling tips..."
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-[2px] focus:outline-none transition-colors resize-none ${
                      formErrors.content
                        ? "border-red-500 focus:border-red-600"
                        : "border-veyro-border focus:border-veyro-black"
                    }`}
                  />
                  {formErrors.content && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">
                      {formErrors.content}
                    </p>
                  )}
                </div>

                {/* 5. Author Name & Size Purchased */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="review-author"
                      className="block text-xs font-bold uppercase tracking-wider text-veyro-black mb-1.5"
                    >
                      Your Name / Handle
                    </label>
                    <input
                      id="review-author"
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      placeholder="e.g. Yash S. (or leave blank for Verified Buyer)"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-veyro-border rounded-[2px] focus:outline-none focus:border-veyro-black transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="review-size"
                      className="block text-xs font-bold uppercase tracking-wider text-veyro-black mb-1.5"
                    >
                      Purchased Size
                    </label>
                    <select
                      id="review-size"
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-veyro-border rounded-[2px] focus:outline-none focus:border-veyro-black transition-colors"
                    >
                      {product.sizes?.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form Footer */}
                <div className="pt-4 border-t border-veyro-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-veyro-black transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-veyro-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded-[2px] transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
