import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Pencil,
  Trash,
  Package,
  ShoppingBag,
  X,
  MagnifyingGlass,
  CaretLeft,
} from "@phosphor-icons/react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [searchProduct, setSearchProduct] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    unit: "piece",
    categoryId: "",
    stock: "",
    featured: "no" as "yes" | "no",
    image: "",
  });

  const utils = trpc.useUtils();
  const { data: products, isLoading: productsLoading } =
    trpc.product.list.useQuery({ search: searchProduct || undefined });
  const { data: orders, isLoading: ordersLoading } =
    trpc.order.list.useQuery();
  const { data: categories } = trpc.category.list.useQuery();

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      resetForm();
    },
  });
  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      resetForm();
    },
  });
  const deleteProduct = trpc.product.delete.useMutation({
    onSuccess: () => utils.product.list.invalidate(),
  });
  const updateOrderStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => utils.order.list.invalidate(),
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      unit: "piece",
      categoryId: "",
      stock: "",
      featured: "no",
      image: "",
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEdit = (product: (typeof products)[0]) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      unit: product.unit,
      categoryId: product.categoryId.toString(),
      stock: product.stock.toString(),
      featured: product.featured as "yes" | "no",
      image: product.image || "",
    });
    setEditingProduct(product.id);
    setShowProductForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description || undefined,
      price: form.price,
      unit: form.unit,
      categoryId: parseInt(form.categoryId),
      stock: parseInt(form.stock) || 0,
      featured: form.featured,
      image: form.image || undefined,
    };

    if (editingProduct) {
      updateProduct.mutate({ id: editingProduct, ...data });
    } else {
      createProduct.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate({ id });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F6F5F2] flex items-center justify-center">
        <div className="animate-pulse text-[#999]">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F6F5F2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#555]">Access denied. Admin only.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-[#B4E435] text-[#111] font-semibold rounded-xl text-sm"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <CaretLeft size={20} />
            </button>
            <h1
              className="text-2xl font-bold text-[#111]"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-black/[0.06]">
            <button
              onClick={() => setTab("products")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                tab === "products"
                  ? "bg-[#B4E435] text-[#111]"
                  : "text-[#555] hover:text-[#111]"
              }`}
            >
              <Package size={16} />
              Products
            </button>
            <button
              onClick={() => setTab("orders")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                tab === "orders"
                  ? "bg-[#B4E435] text-[#111]"
                  : "text-[#555] hover:text-[#111]"
              }`}
            >
              <ShoppingBag size={16} />
              Orders
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
                />
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-black/[0.08] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50"
                />
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowProductForm(true);
                }}
                className="px-4 py-2 bg-[#B4E435] text-[#111] font-semibold rounded-xl text-sm flex items-center gap-2 hover:bg-[#a3d42f] transition-colors"
              >
                <Plus size={16} />
                Add product
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/25"
                  onClick={resetForm}
                />
                <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#111]">
                      {editingProduct ? "Edit Product" : "Add Product"}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="p-1.5 hover:bg-[#F6F5F2] rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#111] mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 border border-black/[0.08] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111] mb-1">
                        Description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-black/[0.08] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#111] mb-1">
                          Price (FCFA) *
                        </label>
                        <input
                          type="number"
                          value={form.price}
                          onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                          }
                          required
                          className="w-full px-3 py-2 border border-black/[0.08] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#111] mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={form.unit}
                          onChange={(e) =>
                            setForm({ ...form, unit: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-black/[0.08] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50"
                          placeholder="piece, kg, bunch..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#111] mb-1">
                          Category *
                        </label>
                        <select
                          value={form.categoryId}
                          onChange={(e) =>
                            setForm({ ...form, categoryId: e.target.value })
                          }
                          required
                          className="w-full px-3 py-2 border border-black/[0.08] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50 bg-white"
                        >
                          <option value="">Select</option>
                          {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#111] mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={form.stock}
                          onChange={(e) =>
                            setForm({ ...form, stock: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-black/[0.08] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#111] mb-1">
                          Featured
                        </label>
                        <select
                          value={form.featured}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              featured: e.target.value as "yes" | "no",
                            })
                          }
                          className="w-full px-3 py-2 border border-black/[0.08] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50 bg-white"
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#111] mb-1">
                          Image path
                        </label>
                        <input
                          type="text"
                          value={form.image}
                          onChange={(e) =>
                            setForm({ ...form, image: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-black/[0.08] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4E435]/50"
                          placeholder="/images/..."
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={
                        createProduct.isPending || updateProduct.isPending
                      }
                      className="w-full py-2.5 bg-[#B4E435] text-[#111] font-semibold rounded-xl hover:bg-[#a3d42f] transition-colors disabled:opacity-50"
                    >
                      {createProduct.isPending || updateProduct.isPending
                        ? "Saving..."
                        : editingProduct
                        ? "Update Product"
                        : "Create Product"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-black/[0.06] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F6F5F2]">
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Name
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Price
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Unit
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Stock
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-[#999]">
                          Loading...
                        </td>
                      </tr>
                    ) : products && products.length > 0 ? (
                      products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-t border-black/[0.04] hover:bg-[#F6F5F2]/50"
                        >
                          <td className="px-4 py-3 font-medium text-[#111]">
                            <div className="flex items-center gap-3">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt=""
                                  className="w-8 h-8 rounded-lg object-cover"
                                />
                              )}
                              {product.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#555]">
                            FCFA {parseFloat(product.price).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-[#555]">
                            {product.unit}
                          </td>
                          <td className="px-4 py-3 text-[#555]">
                            {categories?.find(
                              (c) => c.id === product.categoryId
                            )?.name || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                product.stock < 10
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-1.5 hover:bg-[#F6F5F2] rounded-lg transition-colors"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-[#999]">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            <div className="bg-white rounded-xl border border-black/[0.06] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F6F5F2]">
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Order#
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Customer
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Phone
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Zone
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Total
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-[#111]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-[#999]">
                          Loading...
                        </td>
                      </tr>
                    ) : orders && orders.length > 0 ? (
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-t border-black/[0.04] hover:bg-[#F6F5F2]/50"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-[#555]">
                            {order.orderNumber}
                          </td>
                          <td className="px-4 py-3 text-[#111]">
                            {order.customerName}
                          </td>
                          <td className="px-4 py-3 text-[#555]">
                            {order.customerPhone}
                          </td>
                          <td className="px-4 py-3 text-[#555]">
                            {order.zone}
                          </td>
                          <td className="px-4 py-3 font-medium text-[#111]">
                            FCFA {parseFloat(order.total).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-[#B4E435]/20 text-[#111]"
                              }`}
                            >
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus.mutate({
                                  id: order.id,
                                  status: e.target.value as typeof order.status,
                                })
                              }
                              className="text-xs px-2 py-1 border border-black/[0.08] rounded-lg bg-white focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="preparing">Preparing</option>
                              <option value="out_for_delivery">
                                Out for delivery
                              </option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-[#999]">
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
