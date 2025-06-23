"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";
import { fetchWithAuth } from "utils/api";
import useAdminRedirect from "../../../../hooks/useAdminRedirect";

interface Supplement {
  id: string;
  name: string;
  description: string;
  goal: string;
  activity: string;
  gender: string;
  age: string;
  price: string;
  image: string | null; // Changed File | null to string | null because you use image filename for src
}

export default function AllSupplementsPage() {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [selectedSupplement, setSelectedSupplement] =
    useState<Supplement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplementoDelete, setSupplementToDelete] =
    useState<Supplement | null>(null);
  useAdminRedirect(); // Call hook at top level
  const [token, setToken] = useState("");
  const [searchParams, setSearchParams] = useState({
    name: "",
    goal: "",
    gender: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const { name, goal, gender } = searchParams;

    const query = new URLSearchParams();
    if (name) query.append("name", name);
    if (goal) query.append("goal", goal);
    if (gender) query.append("gender", gender);

    const url = query.toString()
      ? `http://localhost:8080/api/supplement/search?${query.toString()}`
      : `http://localhost:8080/api/supplement`;

    fetchWithAuth(url)
      .then((res) => res.json())
      .then((data) => setSupplements(data))
      .catch((err) => {
        console.error("Filtered fetch failed:", err);
        setSupplements([]);
      });
  }, [searchParams.name, searchParams.goal, searchParams.gender]);

  const handleEdit = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (supplement: Supplement) => {
    setSupplementToDelete(supplement);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!supplementoDelete) return;
    try {
      const res = await fetchWithAuth(
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
      const res = await fetchWithAuth(
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
      render: (data) =>
        data.image ? (
          <img
            src={`http://localhost:8080/uploads/${data.image}`}
            alt={data.name}
            className="w-16 h-16 object-cover rounded"
          />
        ) : null,
    },
    { header: "Price", accessor: "price" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="border p-2 rounded text-black"
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <select
            className="border p-2 rounded text-black"
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, goal: e.target.value }))
            }
          >
            <option value="">All Goals</option>
            <option value="lose weight">Lose Weight</option>
            <option value="gain weight">Gain Weight</option>
            <option value="maintain weight">Maintain Weight</option>
          </select>

          <select
            className="border p-2 rounded text-black"
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, gender: e.target.value }))
            }
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

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
              {columns.map((col) => {
                const val = (selectedSupplement as any)[col.accessor];

                if (col.accessor === "goal") {
                  return (
                    <div key={col.accessor}>
                      <label className="block text-sm font-medium text-black">
                        {col.header}
                      </label>
                      <select
                        name="goal"
                        defaultValue={val}
                        className="w-full border p-2 rounded text-black"
                        required
                      >
                        <option value="">Select Goal</option>
                        <option value="lose weight">Lose Weight</option>
                        <option value="gain weight">Gain Weight</option>
                        <option value="maintain weight">Maintain Weight</option>
                      </select>
                    </div>
                  );
                }

                if (col.accessor === "activity") {
                  return (
                    <div key={col.accessor}>
                      <label className="block text-sm font-medium text-black">
                        {col.header}
                      </label>
                      <select
                        name="activity"
                        defaultValue={val}
                        className="w-full border p-2 rounded text-black"
                        required
                      >
                        <option value="">Select Activity</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                      </select>
                    </div>
                  );
                }

                if (col.accessor === "gender") {
                  return (
                    <div key={col.accessor}>
                      <label className="block text-sm font-medium text-black">
                        {col.header}
                      </label>
                      <select
                        name="gender"
                        defaultValue={val}
                        className="w-full border p-2 rounded text-black"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  );
                }

                if (col.accessor === "age") {
                  return (
                    <div key={col.accessor}>
                      <label className="block text-sm font-medium text-black">
                        {col.header}
                      </label>
                      <select
                        name="age"
                        defaultValue={val}
                        className="w-full border p-2 rounded text-black"
                        required
                      >
                        <option value="">Select Age Group</option>
                        <option value="18-25">18-25</option>
                        <option value="26-35">26-35</option>
                        <option value="36-45">36-45</option>
                        <option value="46-60">46-60</option>
                        <option value="60+">60+</option>
                      </select>
                    </div>
                  );
                }

                // Default input for other fields
                return (
                  <div key={col.accessor}>
                    <label className="block text-sm font-medium text-black">
                      {col.header}
                    </label>
                    <input
                      type={col.accessor === "price" ? "number" : "text"}
                      name={col.accessor}
                      defaultValue={val}
                      className="w-full border p-2 rounded text-black"
                      required
                    />
                  </div>
                );
              })}
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
