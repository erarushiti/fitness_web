import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  FC,
} from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { fetchWithAuth } from "utils/api";
import useAdminRedirect from "../../../../hooks/useAdminRedirect";

/* ─────────────── Types ─────────────── */
interface Category {
  id: string;
  name: string;
}

interface ExerciseForm {
  name: string;
  description: string;
  steps: string;              // comma‑separated
  musclesWorked: string;      // comma‑separated
  recommendedSetsReps: string;
  categoryId: string;
  image: File | null;
}

/* ─────────────── Component ─────────────── */
const CreateExercise: FC = () => {
  useAdminRedirect();

  const [formData, setFormData] = useState<ExerciseForm>({
    name: "",
    description: "",
    steps: "",
    musclesWorked: "",
    recommendedSetsReps: "",
    categoryId: "",
    image: null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithAuth("http://localhost:8080/api/categories", {
          method: "GET",
        });
        const data = await res.json();
        setCategories(data);
      } catch {
        setError("Failed to load categories");
      }
    })();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append(
      "steps",
      JSON.stringify(formData.steps.split(",").map((s) => s.trim()))
    );
    payload.append(
      "musclesWorked",
      JSON.stringify(formData.musclesWorked.split(",").map((s) => s.trim()))
    );
    payload.append("recommendedSetsReps", formData.recommendedSetsReps);
    payload.append("categoryId", formData.categoryId);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      const res = await fetch("http://localhost:8080/api/exercises", {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create exercise");
      }

      setSuccess("Exercise created successfully!");
      setFormData({
        name: "",
        description: "",
        steps: "",
        musclesWorked: "",
        recommendedSetsReps: "",
        categoryId: "",
        image: null,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6">
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
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />

          <Textarea
            label="Steps (comma‑separated)"
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            rows={2}
          />

          <Textarea
            label="Muscles Worked (comma‑separated)"
            name="musclesWorked"
            value={formData.musclesWorked}
            onChange={handleChange}
            rows={2}
          />

          <Input
            label="Recommended Sets/Reps"
            name="recommendedSetsReps"
            value={formData.recommendedSetsReps}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-black">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded-lg text-black"
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 w-full p-2 border rounded-lg text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg"
          >
            Create Exercise
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

/* ─────────────── Inputs ─────────────── */
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

export default CreateExercise;
