import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

export default function CancelPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Checkout Canceled</h1>
        <p>Your checkout was canceled. You can return to your cart to continue.</p>
        <Link href="/cart" className="text-[#EE7838] hover:underline">
          Back to Cart
        </Link>
      </div>
    </DashboardLayout>
  );
}