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
          className="p-2 rounded-lg hover:bg-veyro-surface transition-colors text-veyro-muted hover:text-veyro-black"
          aria-label="Back to products"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-veyro-black">Add Product</h1>
          <p className="text-sm text-veyro-muted mt-0.5">
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
