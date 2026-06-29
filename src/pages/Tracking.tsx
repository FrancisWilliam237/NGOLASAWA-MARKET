import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { MagnifyingGlass, Package, CheckCircle, ChefHat, Truck, House, XCircle, Clock } from "@phosphor-icons/react";
import { trpc } from "@/providers/trpc";

const STATUS_STEPS = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: House },
];

const STATUS_MAP: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
};

export default function Tracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [phone, setPhone] = useState(searchParams.get("phone") || "");
  const [searched, setSearched] = useState(!!searchParams.get("phone"));

  const { data: orders, isLoading } = trpc.order.byPhone.useQuery(
    { phone },
    { enabled: searched && phone.length > 0 }
  );

  useEffect(() => {
    const p = searchParams.get("phone");
    if (p) {
      setPhone(p);
      setSearched(true);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSearched(true);
    setSearchParams({ phone });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={20} />;
      case "confirmed":
        return <CheckCircle size={20} />;
      case "preparing":
        return <ChefHat size={20} />;
      case "out_for_delivery":
        return <Truck size={20} />;
      case "delivered":
        return <House size={20} />;
      case "cancelled":
        return <XCircle size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6]">
      {/* Hero */}
      <div className="relative min-h-[45vh] flex items-center justify-center overflow-hidden">
        {/* Animated drift paths */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[300px] h-[2px] bg-[#B4E435]/20 rounded-full"
            style={{
              top: "20%",
              left: "10%",
              animation: "driftA 12s linear infinite alternate",
            }}
          />
          <div
            className="absolute w-[200px] h-[2px] bg-[#B4E435]/15 rounded-full"
            style={{
              top: "60%",
              right: "15%",
              animation: "driftB 10s linear infinite alternate",
            }}
          />
          <div
            className="absolute w-[250px] h-[2px] bg-[#111]/10 rounded-full"
            style={{
              top: "40%",
              left: "50%",
              animation: "driftC 8s linear infinite alternate",
            }}
          />
        </div>

        <div className="relative z-10 max-w-md mx-auto px-4 text-center">
          <Package size={40} className="mx-auto text-[#111] mb-4" />
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#111] mb-3"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Where is my order?
          </h1>
          <p className="text-[#555] mb-6">
            Enter the phone number used at checkout.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 6XX XXX XXX"
              className="flex-1 px-4 py-3 bg-white border border-black/[0.08] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-[#B4E435] text-[#111] font-semibold rounded-xl hover:bg-[#a3d42f] transition-colors flex items-center gap-2"
            >
              <MagnifyingGlass size={18} />
              Track
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-[#999]">Loading...</div>
          </div>
        ) : searched && orders && orders.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#111]">
              {orders.length} order{orders.length > 1 ? "s" : ""} found
            </h2>
            {orders.map((order) => {
              const statusIndex = STATUS_MAP[order.status] ?? 0;
              const isCancelled = order.status === "cancelled";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-black/[0.06] p-5 shadow-sm"
                >
                  {/* Order header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-[#999]">Order number</p>
                      <p className="text-sm font-semibold text-[#111]">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          isCancelled
                            ? "bg-red-100 text-red-700"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-[#B4E435]/20 text-[#111]"
                        }`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-[#555]">
                          {item.product?.name || "Product"} × {item.quantity}
                        </span>
                        <span className="text-[#111] font-medium">
                          FCFA{" "}
                          {(
                            parseFloat(item.price) * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-black/[0.06] pt-3 flex items-center justify-between">
                    <span className="text-sm text-[#555]">Total</span>
                    <span className="text-lg font-bold text-[#111]">
                      FCFA {parseFloat(order.total).toLocaleString()}
                    </span>
                  </div>

                  {/* Timeline */}
                  {!isCancelled && (
                    <div className="mt-5 pt-4 border-t border-black/[0.06]">
                      <div className="relative flex items-start justify-between">
                        {/* Line */}
                        <div className="absolute top-[14px] left-0 right-0 h-[2px] bg-[#E5E5E5]" />
                        <div
                          className="absolute top-[14px] left-0 h-[2px] bg-[#B4E435] transition-all"
                          style={{
                            width: `${(statusIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                          }}
                        />

                        {STATUS_STEPS.map((step, index) => {
                          const StepIcon = step.icon;
                          const isActive = index <= statusIndex;
                          const isCurrent = index === statusIndex;

                          return (
                            <div
                              key={step.key}
                              className="relative z-10 flex flex-col items-center"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                  isActive
                                    ? "bg-[#B4E435] text-[#111]"
                                    : "bg-white border-2 border-[#E5E5E5] text-[#999]"
                                } ${isCurrent ? "ring-4 ring-[#B4E435]/30" : ""}`}
                              >
                                <StepIcon size={14} weight="bold" />
                              </div>
                              <span
                                className={`text-[10px] mt-1.5 font-medium ${
                                  isActive ? "text-[#111]" : "text-[#999]"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : searched ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-[#ccc] mb-3" />
            <p className="text-[#555]">No orders found for this number</p>
            <p className="text-sm text-[#999] mt-1">
              Make sure you entered the correct phone number
            </p>
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes driftA {
          from { transform: translate(-12vw, -6vh) rotate(-12deg); }
          to { transform: translate(12vw, 6vh) rotate(-12deg); }
        }
        @keyframes driftB {
          from { transform: translate(8vw, 4vh) rotate(8deg); }
          to { transform: translate(-8vw, -4vh) rotate(8deg); }
        }
        @keyframes driftC {
          from { transform: translate(-6vw, 8vh) rotate(-5deg); }
          to { transform: translate(6vw, -8vh) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
}
