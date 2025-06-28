"use client";

import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";

interface Quote {
  id: string;
  text: string;
  author: string;
  image?: string;
}

export default function AllQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [token, setToken] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Controlled inputs for form
  const [formText, setFormText] = useState("");
  const [formAuthor, setFormAuthor] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/quote")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched quotes:", data);
        setQuotes(data);
      })
      .catch((err) => {
        console.error("Fetch quotes failed:", err);
        setQuotes([]);
      });
  }, []);

  // Sync controlled inputs when a quote is selected for editing
  useEffect(() => {
    if (selectedQuote) {
      setFormText(selectedQuote.text);
      setFormAuthor(selectedQuote.author);
      setImageFile(null);
      setErrorMessage(null);
    }
  }, [selectedQuote]);

  const handleEdit = (quote: Quote) => {
    if (!quote.id) {
      console.error("No valid ID for quote:", quote);
      setErrorMessage("Cannot edit quote: Invalid quote ID");
      return;
    }
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (quote: Quote) => {
    if (!quote.id) {
      console.error("No valid ID for quote to delete:", quote);
      setErrorMessage("Cannot delete quote: Invalid quote ID");
      return;
    }
    setQuoteToDelete(quote);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!quoteToDelete?.id) {
      console.error("No valid ID for quote to delete");
      setErrorMessage("Cannot delete quote: Invalid quote ID");
      setIsDeleteModalOpen(false);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/quote/${quoteToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 204) {
        setQuotes((prev) => prev.filter((q) => q.id !== quoteToDelete.id));
      } else {
        console.error("Failed to delete quote, status:", res.status);
        setErrorMessage(`Failed to delete quote, status: ${res.status}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setErrorMessage("Delete failed");
    } finally {
      setIsDeleteModalOpen(false);
      setQuoteToDelete(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedQuote?.id) {
      setErrorMessage("Cannot update quote: Invalid quote ID");
      return;
    }

    if (!formText.trim() || !formAuthor.trim()) {
      setErrorMessage("Quote text and author are required");
      return;
    }

    const formData = new FormData();
    formData.append("text", formText);
    formData.append("author", formAuthor);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`http://localhost:8080/api/quote/${selectedQuote.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Update failed: ${res.status} ${res.statusText}, ${JSON.stringify(errorData)}`);
      }

      const updated = await res.json();
      setQuotes((prev) => prev.map((q) => (q.id === selectedQuote.id ? updated : q)));
      setIsModalOpen(false);
      setSelectedQuote(null);
      setImageFile(null);
      setFormText("");
      setFormAuthor("");
      setErrorMessage(null);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to update quote");
      }
    }
  };

  const columns: Column<Quote>[] = [
    { header: "Quote", accessor: "text" },
    { header: "Author", accessor: "author" },
    {
      header: "Image",
      accessor: "image",
      render: (data) =>
        data.image ? (
          <img
            src={`http://localhost:8080/uploads/${data.image}`}
            alt={data.author}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <span>No Image</span>
        ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
            {errorMessage}
          </div>
        )}
        <DataTable
          data={Array.isArray(quotes) ? quotes : []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <EditModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedQuote(null);
            setFormText("");
            setFormAuthor("");
            setImageFile(null);
            setErrorMessage(null);
          }}
          title="Edit Quote"
        >
          {selectedQuote && (
            <form
              onSubmit={handleModalSubmit}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <div>
                <label className="block text-sm font-medium text-black">Quote</label>
                <input
                  type="text"
                  name="text"
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full border p-2 rounded text-black"
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
          onClose={() => {
            setIsDeleteModalOpen(false);
            setQuoteToDelete(null);
            setErrorMessage(null);
          }}
          onConfirm={confirmDelete}
          title={`Delete quote by "${quoteToDelete?.author}"?`}
          message="Are you sure you want to delete this quote? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
