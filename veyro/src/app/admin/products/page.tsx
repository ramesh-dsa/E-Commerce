"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProducts } from "@/context/ProductsContext";
import { useCustomSections } from "@/context/CustomSectionsContext";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Search, RotateCcw } from "lucide-react";
import { searchProducts, getUnifiedSearchableProducts } from "@/utils/searchEngine";

export default function AdminProductsPage() {
  const { products, deleteProduct, resetToDefaults } = useProducts();
  const { sections } = useCustomSections();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const allAvailableProducts = useMemo(() => {
    return getUnifiedSearchableProducts(products, sections);
  }, [products, sections]);

  const filtered = useMemo(() => {
    let result = allAvailableProducts;
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (search) {
      result = searchProducts(result, search);
    }
    return result;
  }, [allAvailableProducts, search, categoryFilter]);

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
          <h1 className="text-2xl font-bold font-heading text-white">Products</h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-0.5">{products.length} total products</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-medium
              bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/10
              text-[var(--admin-text-muted)] hover:text-white transition-colors cursor-pointer"
            title="Reset to default VEYRO catalogue"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)]
              text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, ID, tag, or color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[14px] border border-white/10 bg-[var(--admin-surface-2)] text-white placeholder:text-[var(--admin-text-muted)] text-sm
              focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-[14px] border border-white/10 bg-[var(--admin-surface-2)] text-white text-sm
            focus:outline-none focus:border-[var(--admin-primary)] transition-colors cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="Clothing">Clothing</option>
          <option value="Footwear">Footwear</option>
          <option value="Watches">Watches</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-[var(--admin-surface)] rounded-[28px] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-white/5 bg-[var(--admin-surface-2)]">
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-[var(--admin-text-muted)]">
                  Product
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-[var(--admin-text-muted)] hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-[var(--admin-text-muted)]">
                  Price
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-[var(--admin-text-muted)] hidden sm:table-cell">
                  Stock
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-[var(--admin-text-muted)] hidden lg:table-cell">
                  Badge
                </th>
                <th className="text-right px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-[var(--admin-text-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-[var(--admin-surface-2)] border border-white/5 flex-shrink-0 relative">
                        {product.imageUrl.startsWith("data:") ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Image src={product.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white truncate">{product.name}</div>
                        <div className="text-[11px] text-[var(--admin-text-muted)] font-mono">{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-[var(--admin-surface-2)] border border-white/5 text-[var(--admin-text-muted)] px-2.5 py-1 rounded-full font-medium">
                      {product.subcategoryTag}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white tabular-nums">₹{product.price.toLocaleString("en-IN")}</div>
                    {product.originalPrice && (
                      <div className="text-[11px] text-[var(--admin-text-muted)] line-through tabular-nums">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {product.stock !== undefined ? (
                      <div className="flex flex-col">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 w-fit ${
                            !product.inStock || product.stock === 0
                              ? "bg-[#FF4B55]/15 text-[#FF4B55]"
                              : product.stock <= (product.lowStockThreshold || 10)
                              ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                              : "bg-[#00F59B]/15 text-[#00F59B]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              !product.inStock || product.stock === 0
                                ? "bg-[#FF4B55]"
                                : product.stock <= (product.lowStockThreshold || 10)
                                ? "bg-[#F59E0B]"
                                : "bg-[#00F59B]"
                            }`}
                          />
                          {!product.inStock || product.stock === 0
                            ? "Out of Stock"
                            : product.stock <= (product.lowStockThreshold || 10)
                            ? `Low Stock (${product.stock})`
                            : `${product.stock} in stock`}
                        </span>
                        {product.inStock && product.stock > 0 && (
                          <span className="text-[10px] text-[var(--admin-text-muted)] mt-0.5 pl-2">
                            {product.sizes?.length ? `${product.sizes.length} sizes` : "Ready"}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 w-fit ${
                          product.inStock
                            ? "bg-[#00F59B]/15 text-[#00F59B]"
                            : "bg-[#FF4B55]/15 text-[#FF4B55]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.inStock ? "bg-[#00F59B]" : "bg-[#FF4B55]"
                          }`}
                        />
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {product.badge && (
                      <span className="text-[10px] bg-white/10 text-white border border-white/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--admin-text-muted)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--admin-text-muted)] hover:text-[#FF4B55] hover:bg-white/5 transition-colors cursor-pointer"
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
          <div className="py-12 text-center text-[var(--admin-text-muted)] text-sm">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
