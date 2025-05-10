"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";

interface Supplement {
  id: string;
  name: string;
  description: string;
  goal: string;
  activity: string;
  gender: string;
  age: string;
  price: string;
  image: File | null;
}

export default function AllSupplementsPage() {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [selectedSupplement, setSelectedSupplement] =
    useState<Supplement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplementoDelete, setSupplementToDelete] =
    useState<Supplement | null>(null);

  const [token, setToken] = useState("");

  useEffect(() => {
    // Retrieve token from localStorage when component mounts
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/supplement")
      .then((res) => res.json())
      .then((data) => {
        setSupplements(data); // ✅ set supplements array into state
      })
      .catch((err) => {
        console.error("Fetch supplements failed:", err);
        setSupplements([]);
      });
  }, []);

  const handleEdit = (supplements: Supplement) => {
    setSelectedSupplement(supplements);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (supplements: Supplement) => {
    setSupplementToDelete(supplements);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!supplementoDelete) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/supplement/${supplementoDelete.id}`,
        {
          method: "DELETE",
           headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 204) {
        setSupplements((prev) =>
          prev.filter((s) => s.id !== supplementoDelete.id)
        );
      } else {
        console.error("Failed to delete supplements");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setSupplementToDelete(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSupplement) return;

    const formData = new FormData(e.currentTarget);
    const formEntries = Object.fromEntries(formData.entries());

    const updatedSupplement = {
      ...formEntries,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/supplement/${selectedSupplement.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSupplement),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setSupplements((prev) =>
        prev.map((s) => (s.id === selectedSupplement.id ? updated : s))
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const columns: Column<Supplement>[] = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Age", accessor: "age" },
    { header: "Gender", accessor: "gender" },
    { header: "Goal", accessor: "goal" },
    { header: "Activity", accessor: "activity" },
    {
      header: "Image",
      accessor: "image",
      render: (data) => (
        <img
          src={`http://localhost:8080/uploads/${data.image}`}
          alt={data.name}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    { header: "Price", accessor: "price" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable
          data={Array.isArray(supplements) ? supplements : []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Supplement"
        >
          {selectedSupplement && (
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {columns.map((col) => (
                <div key={col.accessor}>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      {col.header}
                    </label>
                    <input
                      type={col.accessor === "price" ? "number" : "text"}
                      name={col.accessor}
                      defaultValue={(selectedSupplement as any)[col.accessor]}
                      className="w-full border p-2 rounded text-black"
                      required
                    />
                  </div>
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
          title={`Delete "${supplementoDelete?.name}"?`}
          message="Are you sure you want to delete this supplement? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
