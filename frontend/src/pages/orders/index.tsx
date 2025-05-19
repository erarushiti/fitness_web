"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";

interface Supplement {
  id: string;
  name: string;
  description: string;
}

interface OrderItem {
  id: string;
  quantity: any;
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
  orderItems: OrderItem[]; // ✅ array, not object
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [token, setToken] = useState("");

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
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error("Fetch orders failed:", err);
        setOrders([]);
      });
  }, [token]);

  // Helper to get nested property safely
  const getNested = (obj: any, path: string) => {
    return path.split(".").reduce((o, key) => (o ? o[key] : undefined), obj);
  };

  const columns: Column<Order>[] = [
    {
      header: "Email",
      accessor: "user",
      render: (order) => order.user.email,
    },
    {
      header: "Supplements",
      accessor: "orderItems",
      render: (order) =>
        order.orderItems.map((item) => item.supplement.name).join(", "),
    },
    {
      header: "Quantities",
      accessor: "orderItems",
      render: (order) =>
        order.orderItems.map((item) => item.quantity).join(", "),
    },
    {
      header: "Status",
      accessor: "status",
      render: (order) => <span className="capitalize">{order.status}</span>,
    },
    {
      header: "Total",
      accessor: "totalAmount",
      render: (order) => `$${order.totalAmount.toFixed(2)}`,
    },

    {
      header: "Date",
      accessor: "createdAt",
      render: (order) => new Date(order.createdAt).toLocaleString(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable
          data={Array.isArray(orders) ? orders : []}
          columns={columns}
          // If your DataTable expects accessor as string, you might want to support nested props or use render only.
        />
      </div>
    </DashboardLayout>
  );
}
