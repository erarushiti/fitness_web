"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

interface Client {
  id: string;
  email: string;
  name: string;
  fitnessGoals: string;
  weight: number;
  height: number;
}

interface Trainer {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experienceYears: number;
}

const TABS = ["All", "Clients", "Trainers"];

export default function AllUsersPage() {
  const [selectedTab, setSelectedTab] = useState("All");
  const [data, setData] = useState<any[]>([]);
  const [token, setToken] = useState("");

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      let endpoint = "/api/auth/users";
      if (selectedTab === "Clients") endpoint = "/api/auth/clients";
      if (selectedTab === "Trainers") endpoint = "/api/auth/trainers";

      try {
        const res = await fetch(`http://localhost:8080${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error(`Failed to fetch ${selectedTab}:`, err);
      }
    };

    fetchData();
  }, [selectedTab, token]);

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    let endpoint = "/api/auth";
    if (selectedTab === "Clients")
      endpoint = `/api/auth/clients/${itemToDelete.id}`;
    else if (selectedTab === "Trainers")
      endpoint = `/api/auth/trainers/${itemToDelete.id}`;
    else endpoint = `/api/auth/${itemToDelete.id}`;

    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setData((prev) => prev.filter((u) => u.id !== itemToDelete.id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;

    const formData = new FormData(e.currentTarget);
    const updatedItem = Object.fromEntries(formData.entries());

    let endpoint = "/api/auth";
    if (selectedTab === "Clients")
      endpoint = `/api/auth/clients/${selectedItem.id}`;
    else if (selectedTab === "Trainers")
      endpoint = `/api/auth/trainers/${selectedItem.id}`;
    else endpoint = `/api/auth/${selectedItem.id}`;

    try {
      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      const updated = await res.json();
      setData((prev) =>
        prev.map((u) =>
          u.id === selectedItem.id
            ? updated.client || updated.trainer || updated.user
            : u
        )
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const getColumns = (): Column<any>[] => {
    if (selectedTab === "All") {
      return [
        { header: "First Name", accessor: "firstName" },
        { header: "Last Name", accessor: "lastName" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
        {
          header: "Created At",
          accessor: "createdAt",
          render: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
      ];
    }

    if (selectedTab === "Trainers") {
      return [
        { header: "Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Specialization", accessor: "specialization" },
        { header: "Experience Years", accessor: "experienceYears" },
      ];
    }

    if (selectedTab === "Clients") {
      return [
        { header: "Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Goals", accessor: "fitnessGoals" },
        { header: "Weight", accessor: "weight" },
        { header: "Height", accessor: "height" },
      ];
    }

    return [];
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-4 border-b border-gray-200">
          <nav className="flex space-x-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedTab === tab
                    ? "bg-gray-300 text-black"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <DataTable
          data={data}
          columns={getColumns()}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Record"
        >
          {selectedItem && (
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {Object.entries(selectedItem).map(([key, value]) =>
                typeof value === "string" || typeof value === "number" ? (
                  <div key={key}>
                    <label className="block text-sm font-medium text-black capitalize">
                      {key}
                    </label>
                    <input
                      name={key}
                      defaultValue={value as any}
                      className="w-full border p-2 rounded text-black"
                      required
                    />
                  </div>
                ) : null
              )}
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
          title={`Delete "${itemToDelete?.email || itemToDelete?.name}"?`}
          message="Are you sure you want to delete this entry? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
