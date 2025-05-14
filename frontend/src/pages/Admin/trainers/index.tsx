"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";

interface Trainer {
  id: string;
  userId: string;
  name: string;         // From user
  email: string;        // From user
  specialization: string;
  experienceYears: number;
  bio: string;
}


export default function AllTrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState<Trainer | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/trainer")
      .then((res) => res.json())
      .then((data) => setTrainers(data))
      .catch((err) => {
        console.error("Failed to fetch trainers:", err);
        setTrainers([]);
      });
  }, []);

  const handleEdit = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (trainer: Trainer) => {
    setTrainerToDelete(trainer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!trainerToDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/trainer/${trainerToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 204) {
        setTrainers((prev) => prev.filter((t) => t.id !== trainerToDelete.id));
      } else {
        console.error("Failed to delete trainer");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setTrainerToDelete(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTrainer) return;

    const formData = new FormData(e.currentTarget);
    const formEntries = Object.fromEntries(formData.entries());

    const updatedTrainer = {
      specialization: formEntries.specialization,
      experienceYears: Number(formEntries.experienceYears),
      bio: formEntries.bio,
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/trainer/${selectedTrainer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTrainer),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setTrainers((prev) =>
        prev.map((t) => (t.id === selectedTrainer.id ? updated : t))
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const columns: Column<Trainer>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Specialization", accessor: "specialization" },
    { header: "Experience (years)", accessor: "experienceYears" },
    { header: "Bio", accessor: "bio" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable
          data={Array.isArray(trainers) ? trainers : []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Trainer"
        >
          {selectedTrainer && (
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  defaultValue={selectedTrainer.specialization}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black">
                  Experience Years
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  defaultValue={selectedTrainer.experienceYears}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black">Bio</label>
                <textarea
                  name="bio"
                  defaultValue={selectedTrainer.bio}
                  className="w-full border p-2 rounded text-black"
                  rows={4}
                />
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
        //   title={`Delete trainer "${trainerToDelete?.user?.name}"?`}
          message="Are you sure you want to delete this trainer? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
