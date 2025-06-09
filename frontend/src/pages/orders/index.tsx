"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

interface Supplement {
  id: string;
  name: string;
  description: string;
  image?: string; // Make sure your API sends this
}

interface OrderItem {
  id: string;
  quantity: number;
  supplement: Supplement;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Order {
  id: string;
  user: User;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    const clientData = localStorage.getItem("user");
    if (!token || !clientData) return;

    const clientId = JSON.parse(clientData).id;
    fetch(`http://localhost:8080/api/orders/user/${clientId}`, {
      headers: {
        
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => {
        console.error("Fetch orders failed:", err);
        setOrders([]);
      });
  }, [token]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold mb-4">My orders</h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex  mb-2 justify-between  ">
              <div className="flex gap-[10px] justify-between items-center">
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("de-DE")}
                </p>
                •
                {
                  <span
                    className={`text-sm font-medium capitalize ${
                      order.status === "Kompletuar"
                        ? "text-green-600"
                        : order.status === "Anuluar"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                }
                •<p>Totali: € {order.totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  Detajet →
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-4 ">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border rounded-md p-2 w-[108px]"
                >
                  <img
                    src={`http://localhost:8080/uploads/${item.supplement.image}`}
                    alt={item.supplement.name}
                    height={200}
                    className=" rounded w-[92px]"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-gray-500">Nuk ka porosi të regjistruara.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
