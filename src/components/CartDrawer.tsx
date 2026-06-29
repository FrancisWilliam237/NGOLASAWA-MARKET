import { Link } from "react-router";
import { X, Minus, Plus, ShoppingCart } from "@phosphor-icons/react";
import { useCartStore } from "@/store/cartStore";
import { useEffect, useRef } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, getTotalPrice } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
          <h2
            className="text-lg font-bold text-[#111]"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Your order
          </h2>
          <button
            onClick={closeCart}
            className="p-1.5 hover:bg-[#F6F5F2] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={48} className="text-[#ccc] mb-3" />
              <p className="text-[#555] text-sm">Your cart is empty</p>
              <p className="text-[#999] text-xs mt-1">
                Add some fresh produce to get started
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3 p-3 bg-[#F6F5F2] rounded-xl"
                >
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#eee]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#111] truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#555] mt-0.5">
                      {item.unit} · FCFA {item.price}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center bg-white border border-black/[0.08] rounded-lg hover:bg-[#F6F5F2] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center bg-white border border-black/[0.08] rounded-lg hover:bg-[#F6F5F2] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-[#111]">
                      FCFA{" "}
                      {(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-black/[0.06] bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#555]">Subtotal</span>
              <span className="text-lg font-bold text-[#111]">
                FCFA {getTotalPrice().toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-[#999] mb-4">
              Delivery fee calculated at checkout
            </p>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="block w-full py-3 bg-[#B4E435] text-[#111] font-semibold text-center rounded-xl hover:bg-[#a3d42f] transition-colors"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Go to checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
