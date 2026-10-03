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
        <h1 className="text-xl font-bold text-veyro-black mb-3">Product Not Found</h1>
        <p className="text-sm text-veyro-muted mb-6">
          Product with ID &ldquo;{productId}&rdquo; does not exist or was deleted.
        </p>
        <Link
          href="/admin/products"
          className="text-sm font-semibold text-veyro-yellow hover:underline"
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
          className="p-2 rounded-lg hover:bg-veyro-surface transition-colors text-veyro-muted hover:text-veyro-black"
          aria-label="Back to products"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-veyro-black">Edit Product</h1>
          <p className="text-sm text-veyro-muted mt-0.5">
            {product.name} · <span className="font-mono">{product.id}</span>
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
