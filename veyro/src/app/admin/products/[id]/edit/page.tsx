"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useProducts } from "@/context/ProductsContext";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const { getProductById, updateProduct } = useProducts();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const product = getProductById(productId);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold font-heading text-white mb-3">Product Not Found</h1>
        <p className="text-sm text-[var(--admin-text-muted)] mb-6">
          Product with ID &ldquo;{productId}&rdquo; does not exist or was deleted.
        </p>
        <Link
          href="/admin/products"
          className="text-sm font-semibold text-[var(--admin-primary)] hover:underline"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold font-heading text-white">Edit Product</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-0.5">
            <span className="text-white font-medium">{product.name}</span> · <span className="font-mono">{product.id}</span>
          </p>
        </div>
      </div>
      <ProductForm
        product={product}
        onSubmit={(updatedProduct) => {
          updateProduct(productId, updatedProduct);
          router.push("/admin/products");
        }}
        submitLabel="Save Changes"
      />
    </div>
  );
}
