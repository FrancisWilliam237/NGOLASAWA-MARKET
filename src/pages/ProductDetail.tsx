import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Minus, Plus } from "@phosphor-icons/react";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = parseInt(id || "0");
  const { data: product, isLoading } = trpc.product.byId.useQuery({
    id: productId,
  });
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.productId === productId);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-[#999]">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#555]">Product not found</p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 text-sm text-[#B4E435] hover:underline"
          >
            Back to shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#555] hover:text-[#111] transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-[#F6F5F2] rounded-2xl border border-black/[0.06] p-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-white">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#eee] flex items-center justify-center">
                  <span className="text-[#999]">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {product.category && (
              <span className="text-xs font-medium text-[#999] uppercase tracking-wide">
                {product.category.name}
              </span>
            )}
            <h1
              className="text-3xl font-bold text-[#111] mt-2"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-[#111] mt-3">
              FCFA {parseFloat(product.price).toLocaleString()}
              <span className="text-sm font-normal text-[#999] ml-1">
                / {product.unit}
              </span>
            </p>

            {product.description && (
              <p className="text-sm text-[#555] mt-4 leading-relaxed">
                {product.description}
              </p>
            )}

            <div className="mt-2 text-xs text-[#999]">
              {product.stock > 0 ? (
                <span className="text-green-600">
                  In stock ({product.stock} {product.unit}s available)
                </span>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </div>

            <div className="mt-auto pt-6">
              {!cartItem ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#555]">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-2 bg-[#F6F5F2] rounded-lg p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-black/[0.08] rounded-md"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-black/[0.08] rounded-md"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full py-3.5 bg-[#B4E435] text-[#111] font-semibold rounded-xl hover:bg-[#a3d42f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Add to cart — FCFA{" "}
                    {(parseFloat(product.price) * quantity).toLocaleString()}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-[#B4E435]/20 px-4 py-2 rounded-lg">
                    <span className="text-sm font-medium text-[#111]">
                      Already in cart:
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#F6F5F2] rounded-lg p-1">
                    <button
                      onClick={() =>
                        updateQuantity(product.id, cartItem.quantity - 1)
                      }
                      className="w-10 h-10 flex items-center justify-center bg-white border border-black/[0.08] rounded-md"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-semibold">
                      {cartItem.quantity} in cart
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, cartItem.quantity + 1)
                      }
                      className="w-10 h-10 flex items-center justify-center bg-white border border-black/[0.08] rounded-md"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
