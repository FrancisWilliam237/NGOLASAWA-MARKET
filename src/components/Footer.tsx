import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span
              className="font-bold text-[#111]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              NGOLASAWA
            </span>
            <Link
              to="/shop"
              className="text-sm text-[#555] hover:text-[#111] transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/tracking"
              className="text-sm text-[#555] hover:text-[#111] transition-colors"
            >
              Tracking
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#999]">
            <span>Yaoundé deliveries</span>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-black/[0.04] text-center text-xs text-[#999]">
          © {new Date().getFullYear()} Ngolasawa Market. Fresh produce delivered
          to your door.
        </div>
      </div>
    </footer>
  );
}
