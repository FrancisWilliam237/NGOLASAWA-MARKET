import { Plus, Minus } from "@phosphor-icons/react";
import { useCartStore } from "@/store/cartStore";
import { Link } from "react-router";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    unit: string;
    image: string | null;
    category?: { name: string } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.productId === product.id);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-black/[0.06] p-3 shadow-[0_2px_0_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square rounded-lg overflow-hidden bg-[#F6F5F2]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-[#eee] flex items-center justify-center">
              <span className="text-[#999] text-xs">No image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3">
        <Link to={`/product/${product.id}`}>
          <h3
            className="text-sm font-semibold text-[#111] truncate hover:underline"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="text-xs text-[#999] mt-0.5">{product.category.name}</p>
        )}
        <p className="text-sm font-medium text-[#555] mt-1">
          FCFA {parseFloat(product.price).toLocaleString()}
          <span className="text-[#999] text-xs ml-1">/ {product.unit}</span>
        </p>

        {/* Add / Quantity */}
        <div className="mt-3">
          {!cartItem ? (
            <button
              onClick={handleAdd}
              className="w-full py-2 bg-[#B4E435] text-[#111] font-semibold text-sm rounded-lg hover:bg-[#a3d42f] transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus size={16} weight="bold" />
              Add to cart
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#F6F5F2] rounded-lg p-1">
              <button
                onClick={() =>
                  updateQuantity(product.id, cartItem.quantity - 1)
                }
                className="w-8 h-8 flex items-center justify-center bg-white border border-black/[0.08] rounded-md hover:bg-[#F6F5F2] transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="flex-1 text-center text-sm font-semibold">
                {cartItem.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(product.id, cartItem.quantity + 1)
                }
                className="w-8 h-8 flex items-center justify-center bg-white border border-black/[0.08] rounded-md hover:bg-[#F6F5F2] transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
