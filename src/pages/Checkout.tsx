import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Check } from "@phosphor-icons/react";
import { useCartStore } from "@/store/cartStore";
import { trpc } from "@/providers/trpc";

const ZONES = [
  "Bastos",
  "Bonapriso",
  "Bonanjo",
  "Deido",
  "Akwa",
  "Bali",
  "Makepe",
  "Logbessou",
  "PK 14",
  "PK 17",
  "Odza",
  "Mvan",
  "Ekounou",
  "Biyem-Assi",
  "Mokolo",
  "Tsinga",
  "Other",
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      clearCart();
      navigate(`/tracking?phone=${encodeURIComponent(data?.customerPhone || "")}`);
    },
  });

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    zone: "",
    instructions: "",
    paymentMethod: "orange_money" as "orange_money" | "mtn_momo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = 500;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.customerName.trim()) newErrors.customerName = "Name is required";
    if (!form.customerPhone.trim())
      newErrors.customerPhone = "Phone number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.zone) newErrors.zone = "Zone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createOrder.mutate({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail || undefined,
      address: form.address,
      zone: form.zone,
      instructions: form.instructions || undefined,
      paymentMethod: form.paymentMethod,
      total: total.toString(),
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#555]">Your cart is empty</p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-6 py-2 bg-[#B4E435] text-[#111] font-semibold rounded-xl text-sm"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#555] hover:text-[#111] transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          Back to cart
        </button>

        <h1
          className="text-2xl font-bold text-[#111] mb-6"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111] mb-1.5">
                Full name *
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50 ${
                  errors.customerName ? "border-red-300" : "border-black/[0.08]"
                }`}
                placeholder="Your full name"
              />
              {errors.customerName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.customerName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111] mb-1.5">
                Phone number *
              </label>
              <input
                type="tel"
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50 ${
                  errors.customerPhone
                    ? "border-red-300"
                    : "border-black/[0.08]"
                }`}
                placeholder="e.g. 6XX XXX XXX"
              />
              {errors.customerPhone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.customerPhone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111] mb-1.5">
                Email (optional)
              </label>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) =>
                  setForm({ ...form, customerEmail: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-black/[0.08] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111] mb-1.5">
                Delivery address *
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50 ${
                  errors.address ? "border-red-300" : "border-black/[0.08]"
                }`}
                placeholder="Street, building, landmark"
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111] mb-1.5">
                Zone / Neighborhood *
              </label>
              <select
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50 bg-white ${
                  errors.zone ? "border-red-300" : "border-black/[0.08]"
                }`}
              >
                <option value="">Select your area</option>
                {ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              {errors.zone && (
                <p className="text-xs text-red-500 mt-1">{errors.zone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111] mb-1.5">
                Delivery instructions (optional)
              </label>
              <textarea
                value={form.instructions}
                onChange={(e) =>
                  setForm({ ...form, instructions: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2.5 border border-black/[0.08] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50 resize-none"
                placeholder="Any special instructions for the rider"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-[#111] mb-3">
                Payment method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, paymentMethod: "orange_money" })
                  }
                  className={`p-4 rounded-xl border-2 text-center transition-colors ${
                    form.paymentMethod === "orange_money"
                      ? "border-[#B4E435] bg-[#B4E435]/10"
                      : "border-black/[0.08] hover:border-black/[0.12]"
                  }`}
                >
                  <div className="text-sm font-semibold text-[#111]">
                    Orange Money
                  </div>
                  <div className="text-xs text-[#999] mt-1">Pay on delivery</div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, paymentMethod: "mtn_momo" })
                  }
                  className={`p-4 rounded-xl border-2 text-center transition-colors ${
                    form.paymentMethod === "mtn_momo"
                      ? "border-[#B4E435] bg-[#B4E435]/10"
                      : "border-black/[0.08] hover:border-black/[0.12]"
                  }`}
                >
                  <div className="text-sm font-semibold text-[#111]">
                    MTN MoMo
                  </div>
                  <div className="text-xs text-[#999] mt-1">Pay on delivery</div>
                </button>
              </div>
            </div>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#F6F5F2] rounded-xl p-5 sticky top-[74px]">
              <h3
                className="font-semibold text-[#111] mb-4"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Order Summary
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#999]">
                        {item.quantity} × FCFA {parseFloat(item.price).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-[#111]">
                      FCFA{" "}
                      {(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/[0.08] mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">Subtotal</span>
                  <span className="text-[#111]">
                    FCFA {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#555]">Delivery fee</span>
                  <span className="text-[#111]">
                    FCFA {deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-black/[0.08]">
                  <span className="text-[#111]">Total</span>
                  <span className="text-[#111]">
                    FCFA {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={createOrder.isPending}
                className="w-full mt-5 py-3 bg-[#B4E435] text-[#111] font-semibold rounded-xl hover:bg-[#a3d42f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {createOrder.isPending ? (
                  "Placing order..."
                ) : (
                  <>
                    <Check size={18} weight="bold" />
                    Place order
                  </>
                )}
              </button>

              <p className="text-xs text-[#999] text-center mt-3">
                You will pay via {form.paymentMethod === "orange_money" ? "Orange Money" : "MTN MoMo"} on delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
