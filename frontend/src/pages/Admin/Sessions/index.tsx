

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable, { Column } from "@/components/Table";
import EditModal from "@/components/EditModal";
import DeleteModal from "@/components/DeleteModal";
import { fetchWithAuth } from "@/utils/api";

interface Session {
  id: string;
  name: string;
  description: string;
  weekDays: string[];
  time: string;
  price: number;
  isOpen: boolean;
}

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AllSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);

  const [token, setToken] = useState("");
  
    useEffect(() => {
      // Retrieve token from localStorage when component mounts
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        setToken(storedToken);
      }
    }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/sessions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSessions(data);
        } else if (Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        } else {
          console.error("Unexpected data format:", data);
          setSessions([]);
        }
      })
      .catch((err) => {
        console.error("Fetch sessions failed:", err);
        setSessions([]);
      });
  }, []);

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (session: Session) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/sessions/${sessionToDelete.id}`,
        {
          method: "DELETE",
        
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
         }
        }
      );
      if (res.status === 204) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete.id));
      } else {
        console.error("Failed to delete session");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSession) return;
  
    const formData = new FormData(e.currentTarget);
    const formEntries = Object.fromEntries(formData.entries());
  
    const weekDays = WEEKDAYS.filter(day => formEntries[day]);
    WEEKDAYS.forEach(day => delete formEntries[day]);
  
    const updatedSession = {
      ...formEntries,
      weekDays,
    };
  
    try {
      const res = await fetchWithAuth(`http://localhost:8080/api/sessions/${selectedSession.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedSession),
      });
  
      if (!res.ok) throw new Error("Update failed");
  
      const updated = await res.json();
      setSessions((prev) =>
        prev.map((s) => (s.id === selectedSession.id ? updated : s))
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const columns: Column<Session>[] = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Week Days", accessor: "weekDays" },
    { header: "Time", accessor: "time" },
    { header: "Price", accessor: "price" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <DataTable
          data={Array.isArray(sessions) ? sessions : []}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Session"
        >
          {selectedSession && (
            <form onSubmit={handleModalSubmit} className="space-y-4">
              {columns.map((col) => (
                <div key={col.accessor}>
                  {col.accessor === "weekDays" ? (
                    <div className="grid grid-cols-2 gap-2">
                      {WEEKDAYS.map((day) => (
                        <label
                          key={day}
                          className="flex items-center space-x-2 text-black"
                        >
                          <input
                            type="checkbox"
                            name={day}
                            checked={selectedSession.weekDays.includes(day)}
                            onChange={(e) => {
                              const newWeekDays = e.target.checked
                                ? [...selectedSession.weekDays, day]
                                : selectedSession.weekDays.filter(
                                    (d) => d !== day
                                  );

                              setSelectedSession((prev) => ({
                                ...prev!,
                                weekDays: newWeekDays,
                              }));
                            }}
                          />
                          <span>{day}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-black">
                        {col.header}
                      </label>
                      <input
                        type={col.accessor === "price" ? "number" : "text"}
                        name={col.accessor}
                        defaultValue={(selectedSession as any)[col.accessor]}
                        className="w-full border p-2 rounded text-black"
                        required
                      />
                    </div>
                  )}
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
          title={`Delete "${sessionToDelete?.name}"?`}
          message="Are you sure you want to delete this session? This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
