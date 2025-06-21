"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import DeleteModal from "@/components/DeleteModal";

interface Feedback {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function FeedbackDashboardPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [token, setToken] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/feedback", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let rawFeedbacks: Feedback[] = [];

        if (Array.isArray(data)) rawFeedbacks = data;
        else if (data.feedbacks && Array.isArray(data.feedbacks)) rawFeedbacks = data.feedbacks;
        else if (data.data && Array.isArray(data.data)) rawFeedbacks = data.data;

        const formatted = rawFeedbacks.map((f) => ({
          ...f,
          createdAt: new Date(f.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        }));

        setFeedbacks(formatted);
      });
  }, [token]);

  const handleDeleteClick = (feedback: Feedback) => {
    setFeedbackToDelete(feedback);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/feedback/${feedbackToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackToDelete.id));
      } else {
        console.error("Failed to delete feedback");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setFeedbackToDelete(null);
    }
  };

  const columns: Column<Feedback>[] = [
    { header: "Name", accessor: "name" },
    { header: "Rating", accessor: "rating" },
    { header: "Comment", accessor: "comment" },
    { header: "Date", accessor: "createdAt" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable
          data={feedbacks}
          columns={columns}
          onDelete={handleDeleteClick}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={`Delete feedback from "${feedbackToDelete?.name}"?`}
          message="Are you sure you want to delete this feedback? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
