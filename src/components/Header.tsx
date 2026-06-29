import { Link, useLocation } from "react-router";
import { ShoppingCart, User, List, X, Gear } from "@phosphor-icons/react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Header() {
  const { items, getTotalItems, openCart } = useCartStore();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Shop", path: "/shop" },
    { label: "Tracking", path: "/tracking" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 h-[58px] bg-white border-b border-black/[0.06]">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-bold text-[18px] tracking-tight text-[#111]"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          NGOLASAWA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? "text-[#111]"
                  : "text-[#555] hover:text-[#111]"
              }`}
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-1.5 text-sm text-[#555] hover:text-[#111] transition-colors"
            >
              <Settings size={18} />
            </Link>
          )}

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-[#555]">{user?.name}</span>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 text-sm text-[#555] hover:text-[#111] transition-colors"
            >
              <User size={18} />
            </Link>
          )}

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 px-3 py-1.5 border border-black/[0.08] rounded-full hover:bg-[#F6F5F2] transition-colors"
          >
            <ShoppingCart size={18} weight="regular" className="text-[#111]" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#B4E435] text-[#111] text-[11px] font-bold rounded-full">
                {getTotalItems()}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[58px] left-0 right-0 bg-white border-b border-black/[0.06] shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#111] py-2"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#111] py-2 flex items-center gap-2"
              >
                <Gear size={18} />
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
