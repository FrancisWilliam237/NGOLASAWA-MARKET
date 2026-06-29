import { Link } from "react-router";
import { ArrowRight, ShoppingBag, Package, Truck } from "@phosphor-icons/react";
import { trpc } from "@/providers/trpc";
import ProductCard from "@/components/ProductCard";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const { data: categories } = trpc.category.list.useQuery();
  const { data: featuredProducts } = trpc.product.featured.useQuery();
  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        ".hero-text",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-image",
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(
        ".hero-pill",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          delay: 0.4,
          ease: "back.out(1.6)",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Scroll animations for other sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target.querySelectorAll(".animate-item"),
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.5,
                ease: "power2.out",
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    [categoriesRef, productsRef, stepsRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [categories, featuredProducts]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-[calc(100vh-58px)] flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-0 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-6">
            {/* Text */}
            <div className="flex-1 lg:pr-8">
              <div className="space-y-1">
                <h1
                  className="hero-text text-[clamp(48px,10vw,120px)] font-black leading-[0.88] tracking-[-0.02em] text-[#111]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  FRESH
                </h1>
                <h1
                  className="hero-text text-[clamp(48px,10vw,120px)] font-black leading-[0.88] tracking-[-0.02em] text-[#111]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  MARKET
                </h1>
                <h1
                  className="hero-text text-[clamp(48px,10vw,120px)] font-black leading-[0.88] tracking-[-0.02em] text-[#111]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  DELIVERED
                </h1>
              </div>
              <p className="hero-text mt-6 text-base sm:text-lg text-[#555] max-w-md leading-relaxed">
                Yaoundé&apos;s freshest produce, cleaned, packed, and sent to your
                door.
              </p>
              <div className="hero-text flex flex-wrap items-center gap-4 mt-8">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#B4E435] text-[#111] font-semibold rounded-xl hover:bg-[#a3d42f] transition-colors"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <ShoppingBag size={18} />
                  Shop Now
                </Link>
                <Link
                  to="/tracking"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black/[0.08] text-[#111] font-medium rounded-xl hover:bg-[#F6F5F2] transition-colors text-sm"
                >
                  View your order status
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Image Card */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
              <div className="hero-image relative bg-[#B4E435] rounded-2xl p-3">
                <div className="bg-white rounded-xl p-2.5 border border-black/[0.06]">
                  <img
                    src="/images/hero_fresh_bag.jpg"
                    alt="Fresh produce delivery"
                    className="w-full h-auto rounded-lg object-cover aspect-[4/3]"
                  />
                </div>
                {/* Floating pills */}
                <div className="hero-pill absolute -top-3 -left-3 bg-[#B4E435] px-4 py-2 rounded-full border border-black/[0.06] shadow-sm text-sm font-semibold text-[#111]">
                  Free Delivery
                </div>
                <div className="hero-pill absolute -bottom-3 -right-3 bg-white px-4 py-2 rounded-full border border-black/[0.06] shadow-sm text-sm font-semibold text-[#111]">
                  Yaoundé
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-16 bg-[#F6F5F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-2xl font-bold text-[#111]"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Browse Categories
            </h2>
            <Link
              to="/shop"
              className="text-sm font-medium text-[#555] hover:text-[#111] flex items-center gap-1 transition-colors"
            >
              Browse all
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories?.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="animate-item group relative aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={cat.image || "/images/cat_fruits.jpg"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-semibold text-[#111]">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={productsRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2
            className="text-2xl font-bold text-[#111] mb-8"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Featured Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredProducts?.slice(0, 5).map((product) => (
              <div key={product.id} className="animate-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} className="py-16 bg-[#F6F5F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2
            className="text-2xl font-bold text-[#111] mb-10 text-center"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-item text-center">
              <div className="w-14 h-14 mx-auto bg-[#B4E435] rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={24} weight="bold" className="text-[#111]" />
              </div>
              <span className="inline-block bg-[#B4E435] text-[#111] text-xs font-bold px-3 py-1 rounded-full mb-3">
                1
              </span>
              <h3 className="text-lg font-semibold text-[#111] mb-2">
                Choose your items
              </h3>
              <p className="text-sm text-[#555] leading-relaxed">
                Browse our fresh selection and add what you need to your cart.
              </p>
            </div>
            <div className="animate-item text-center">
              <div className="w-14 h-14 mx-auto bg-[#B4E435] rounded-full flex items-center justify-center mb-4">
                <Package size={24} weight="bold" className="text-[#111]" />
              </div>
              <span className="inline-block bg-[#B4E435] text-[#111] text-xs font-bold px-3 py-1 rounded-full mb-3">
                2
              </span>
              <h3 className="text-lg font-semibold text-[#111] mb-2">
                We prepare everything
              </h3>
              <p className="text-sm text-[#555] leading-relaxed">
                We clean, weigh, and pack your order with care.
              </p>
            </div>
            <div className="animate-item text-center">
              <div className="w-14 h-14 mx-auto bg-[#B4E435] rounded-full flex items-center justify-center mb-4">
                <Truck size={24} weight="bold" className="text-[#111]" />
              </div>
              <span className="inline-block bg-[#B4E435] text-[#111] text-xs font-bold px-3 py-1 rounded-full mb-3">
                3
              </span>
              <h3 className="text-lg font-semibold text-[#111] mb-2">
                Delivered to your door
              </h3>
              <p className="text-sm text-[#555] leading-relaxed">
                A rider brings your fresh produce straight to you in Yaoundé.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#B4E435] text-[#111] font-semibold rounded-xl hover:bg-[#a3d42f] transition-colors"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Start your order
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
