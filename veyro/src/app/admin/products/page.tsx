"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/context/ProductsContext";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Search, RotateCcw } from "lucide-react";

export default function AdminProductsPage() {
  const { products, deleteProduct, resetToDefaults } = useProducts();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    let result = products;
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.subcategoryTag.toLowerCase().includes(q) ||
          p.colorName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, search, categoryFilter]);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"?\nThis will remove it from all store listings immediately.`)) {
      deleteProduct(id);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all products to original VEYRO catalogue?\nAny custom products will be removed.")) {
      resetToDefaults();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-veyro-black">Products</h1>
          <p className="text-sm text-veyro-muted mt-0.5">{products.length} total products</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium
              border border-veyro-border text-veyro-muted hover:text-veyro-black hover:border-veyro-black transition-colors"
            title="Reset to default VEYRO catalogue"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 bg-veyro-yellow text-veyro-black px-4 py-2.5
              rounded-lg text-sm font-bold hover:bg-veyro-yellow-dark transition-colors"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-veyro-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, ID, tag, or color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-veyro-border bg-white text-sm
              focus:outline-none focus:border-veyro-black transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-veyro-border bg-white text-sm
            focus:outline-none focus:border-veyro-black transition-colors"
        >
          <option value="all">All Categories</option>
          <option value="Clothing">Clothing</option>
          <option value="Footwear">Footwear</option>
          <option value="Watches">Watches</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-veyro-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-veyro-border bg-veyro-surface">
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Product
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Price
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted hidden sm:table-cell">
                  Stock
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted hidden lg:table-cell">
                  Badge
                </th>
                <th className="text-right px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-veyro-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-veyro-border-light hover:bg-veyro-surface/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-veyro-surface flex-shrink-0 relative">
                        {product.imageUrl.startsWith("data:") ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Image src={product.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-veyro-black truncate">{product.name}</div>
                        <div className="text-[11px] text-veyro-muted font-mono">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-veyro-surface px-2 py-1 rounded font-medium">
                      {product.subcategoryTag}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">₹{product.price.toLocaleString("en-IN")}</div>
                    {product.originalPrice && (
                      <div className="text-[11px] text-veyro-muted line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`text-xs font-semibold ${
                        product.inStock ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {product.badge && (
                      <span className="text-[10px] bg-veyro-black text-white px-2 py-0.5 rounded font-bold">
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        className="p-2 rounded-lg hover:bg-veyro-surface transition-colors text-veyro-muted hover:text-veyro-black"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors text-veyro-muted hover:text-red-600"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-veyro-muted text-sm">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
