import React, {
  useState,
  ChangeEvent,
  FormEvent,
  FC,
} from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { fetchWithAuth } from "utils/api";
import useAdminRedirect from "../../../../hooks/useAdminRedirect";

/* ─────────────── Form state type ─────────────── */
interface CategoryForm {
  name: string;
  description: string;
}

/* ─────────────── Component ─────────────── */
const CreateCategory: FC = () => {
  useAdminRedirect();

  /* ─── State ─── */
  const [formData, setFormData] = useState<CategoryForm>({
    name: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ─── Handlers ─── */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetchWithAuth(
        "http://localhost:8080/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create category");
      }

      setSuccess("Category created successfully!");
      setFormData({
        name: "",
        description: "",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  /* ─────────────── UI ─────────────── */
  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/* Description */}
          <Textarea
            label="Description (optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg"
          >
            Create Category
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

/* ─────────────── Small Reusable Inputs ─────────────── */
const Input: FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ label, ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-black">{label}</label>
    <input
      className="mt-1 w-full p-2 border rounded-lg text-black"
      {...rest}
    />
  </div>
);

const Textarea: FC<{
  label: string;
  name: string;
  value: string;
  rows: number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}> = ({ label, ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-black">{label}</label>
    <textarea
      className="mt-1 w-full p-2 border rounded-lg text-black"
      {...rest}
    />
  </div>
);

export default CreateCategory;
