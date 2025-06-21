"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import DeleteModal from "@/components/DeleteModal";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

export default function ContactDashboardPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/contact", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let rawContacts: Contact[] = [];

        if (Array.isArray(data)) rawContacts = data;
        else if (data.contacts && Array.isArray(data.contacts)) rawContacts = data.contacts;
        else if (data.data && Array.isArray(data.data)) rawContacts = data.data;
  
        const formattedContacts = rawContacts.map((contact) => ({
          ...contact,
          createdAt: new Date(contact.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        }));
  
        setContacts(formattedContacts);
      });
  }, [token]);

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/contact/${contactToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== contactToDelete.id));
      } else {
        console.error("Failed to delete contact");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setContactToDelete(null);
    }
  };

  const columns: Column<Contact>[] = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Message", accessor: "message" },
    { header: "Date", accessor: "createdAt" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable
          data={contacts}
          columns={columns}
          onDelete={handleDeleteClick}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={`Delete "${contactToDelete?.name}"?`}
          message="Are you sure you want to delete this contact? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
