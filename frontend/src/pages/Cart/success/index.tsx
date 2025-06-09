import { useRouter } from "next/router";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

export default function SuccessPage() {
  const router = useRouter();
  const { session_id, order_id } = router.query;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Order Confirmed</h1>
        <p>Thank you for your purchase! Your order ID is {order_id}.</p>
        <Link href="/supplements" className="text-[#EE7838] hover:underline">
          Continue Shopping
        </Link>
      </div>
    </DashboardLayout>
  );
}