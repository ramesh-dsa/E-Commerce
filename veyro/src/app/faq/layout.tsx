import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & FAQs | VEYRO",
  description:
    "Find answers to common questions about orders, shipping, returns, sizing, payments and your VEYRO account.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
