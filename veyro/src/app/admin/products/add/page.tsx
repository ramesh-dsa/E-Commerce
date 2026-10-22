"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const { addProduct } = useProducts();
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="w-9 h-9 rounded-full bg-[var(--admin-surface)] border border-white/10 text-[var(--admin-text-muted)] hover:text-white hover:bg-[var(--admin-elevated)] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Back to products"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Add Product</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-0.5">
            New product will appear on the store immediately
          </p>
        </div>
      </div>
      <ProductForm
        onSubmit={(product) => {
          addProduct(product);
          router.push("/admin/products");
        }}
        submitLabel="Add Product"
      />
    </div>
  );
}
