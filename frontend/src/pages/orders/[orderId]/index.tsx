"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

interface Supplement {
  id: string;
  name: string;
  description: string;
  image?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  supplement: Supplement;
  unitPrice: number;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token || !id) return;
    fetch(`http://localhost:8080/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((err) => {
        console.error("Failed to fetch order details:", err);
        setOrder(null);
      });
  }, [token, id]);

  if (!order) return <div className="p-6">Duke u ngarkuar...</div>;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold mb-2">Orders Details</h1>
        <p className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleString()}
        </p>
        <p
          className={`font-medium capitalize ${
              order.status === "completed"
              ? "text-green-600"
              : order.status === "pending"
              ? "text-yellow-600"
              : order.status === "failed"
              ? "text-red-600"
              : order.status === "cancelled"
              ? "text-grey-600"
              : 'text-white'
          }`}
        >
          Status: {order.status}
        </p>

        <div className="border rounded-md p-4">
          <h2 className="text-lg font-medium mb-4">Products</h2>
          <div className="divide-y">
            {order.orderItems.map((item) => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                 <img
                    src={`http://localhost:8080/uploads/${item.supplement.image}`}
                    alt={item.supplement.name}
                    height={200}
                    className=" rounded w-[92px]"
                  />
                <div className="flex-1">
                  <p className="font-medium">{item.supplement.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">
                  € {(item.unitPrice ?? 0).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right text-xl font-bold">
          Total: € {order.totalAmount.toFixed(2)}
        </div>
      </div>
    </DashboardLayout>
  );
}
