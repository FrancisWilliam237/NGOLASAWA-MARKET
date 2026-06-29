import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react";
import { trpc } from "@/providers/trpc";
import ProductCard from "@/components/ProductCard";
import gsap from "gsap";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data: categories } = trpc.category.list.useQuery();
  const { data: products, isLoading } = trpc.product.list.useQuery({
    search: search || undefined,
    categoryId: selectedCategory
      ? categories?.find((c) => c.slug === selectedCategory)?.id
      : undefined,
  });

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    if (products && gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll(".product-item"),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [products]);

  const handleCategoryChange = (slug: string) => {
    if (selectedCategory === slug) {
      setSelectedCategory("");
      setSearchParams({});
    } else {
      setSelectedCategory(slug);
      setSearchParams({ category: slug });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1
            className="text-2xl font-bold text-[#111]"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Shop
          </h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <MagnifyingGlass
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-black/[0.08] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50"
              />
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 bg-white border border-black/[0.08] rounded-xl"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Categories */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white lg:bg-transparent p-5 lg:p-0 transform transition-transform lg:transform-none ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="lg:hidden flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111]">Filters</h3>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="bg-white rounded-xl border border-black/[0.06] p-4">
              <h3
                className="font-semibold text-[#111] mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSearchParams({});
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCategory
                      ? "bg-[#B4E435] text-[#111] font-medium"
                      : "text-[#555] hover:bg-[#F6F5F2]"
                  }`}
                >
                  All Products
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-[#B4E435] text-[#111] font-medium"
                        : "text-[#555] hover:bg-[#F6F5F2]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/25 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Product Grid */}
          <div className="flex-1" ref={gridRef}>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-3 animate-pulse"
                  >
                    <div className="aspect-square bg-[#eee] rounded-lg" />
                    <div className="h-4 bg-[#eee] rounded mt-3 w-3/4" />
                    <div className="h-3 bg-[#eee] rounded mt-2 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="product-item">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-[#555]">No products found</p>
                <p className="text-sm text-[#999] mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
