import type { OrderRecord } from "@/types";

export function getReturnEligibility(order: OrderRecord): {
  isEligible: boolean;
  reason?: string;
} {
  if (order.status !== "Delivered") {
    return { isEligible: false, reason: "Order is not delivered yet." };
  }

  if (!order.deliveredDate) {
    return { isEligible: false, reason: "Delivery date is missing." };
  }

  const deliveredAt = new Date(order.deliveredDate);
  const now = new Date();
  
  // 7 days in milliseconds
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  
  if (now.getTime() - deliveredAt.getTime() > SEVEN_DAYS_MS) {
    const expiredDate = new Date(deliveredAt.getTime() + SEVEN_DAYS_MS);
    return { 
      isEligible: false, 
      reason: `Return window expired on ${expiredDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })}.` 
    };
  }

  return { isEligible: true };
}
