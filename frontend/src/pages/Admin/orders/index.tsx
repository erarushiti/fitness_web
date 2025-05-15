
"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import DeleteModal from "@/components/DeleteModal";
import EditModal from "@/components/EditModal";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  Supplement: {
    id: string;
    name: string;
  };
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  User: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  OrderItems: OrderItem[];
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Retrieve token from localStorage when component mounts
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // Fetch all orders
    fetch("http://localhost:8080/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch orders failed:", err);
        setOrders([]);
      });
  }, [token]);

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    try {
      const res = await fetch(`http://localhost:8080/api/orders/${orderToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
      } else {
        console.error("Failed to delete order");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const formData = new FormData(e.currentTarget);
    const formEntries = Object.fromEntries(formData.entries());

    const updatedOrder = {
      ...formEntries,
      totalAmount: parseFloat(formEntries.totalAmount as string),
    };

    try {
      const res = await fetch(`http://localhost:8080/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedOrder),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? updated : o))
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const columns: Column<Order>[] = [
    {
      header: "User",
      accessor: "User",
      render: (data) => `${data.User.firstName} ${data.User.lastName} (${data.User.email})`,
    },
    { header: "Total Amount", accessor: "totalAmount" },
    { header: "Status", accessor: "status" },
    {
      header: "Items",
      accessor: "OrderItems",
      render: (data) =>
        data.OrderItems.map((item) => `${item.Supplement.name} (x${item.quantity})`).join(", "),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (data) => new Date(data.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable
          data={orders}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Order"
        >
          {selectedOrder && (
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Total Amount</label>
                <input
                  type="number"
                  name="totalAmount"
                  defaultValue={selectedOrder.totalAmount}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Status</label>
                <select
                  name="status"
                  defaultValue={selectedOrder.status}
                  className="w-full border p-2 rounded text-black"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </EditModal>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={`Delete Order #${orderToDelete?.id.slice(0, 8)}...?`}
          message="Are you sure you want to delete this order? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
