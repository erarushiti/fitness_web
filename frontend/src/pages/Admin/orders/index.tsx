"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";
import { fetchWithAuth } from "utils/api";
import useAdminRedirect from "../../../../hooks/useAdminRedirect";

interface Order {
  id: string;
  userId: string;
  totalAmount: string;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  useAdminRedirect(); // Call hook at top level
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    fetchWithAuth("http://localhost:8080/api/orders"
    )
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
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
      const res = await fetchWithAuth(
        `http://localhost:8080/api/orders/${orderToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 204) {
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
    };

    try {
      const res = await fetchWithAuth(
        `http://localhost:8080/api/orders/${selectedOrder.id}`,
        {
          method: "PUT",
          body: JSON.stringify(updatedOrder),
        }
      );

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
    { header: "Order ID", accessor: "id" },
    { header: "User ID", accessor: "userId" },
    { header: "Total", accessor: "totalAmount" },
    { header: "Status", accessor: "status" },
    {
      header: "Date",
      accessor: "createdAt",
      render: (data) => new Date(data.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable
          data={Array.isArray(orders) ? orders : []}
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
              {columns.map((col) => (
                <div key={col.accessor}>
                  <label className="block text-sm font-medium text-black">
                    {col.header}
                  </label>
                  <input
                    type={col.accessor === "totalAmount" ? "number" : "text"}
                    name={col.accessor}
                    defaultValue={(selectedOrder as any)[col.accessor]}
                    className="w-full border p-2 rounded text-black"
                    required
                  />
                </div>
              ))}
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
          title={`Delete Order "${orderToDelete?.id}"?`}
          message="Are you sure you want to delete this order? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
