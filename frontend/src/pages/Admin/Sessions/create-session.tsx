"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import DashboardLayout from "../../../components/DashboardLayout";
import { fetchWithAuth } from "@/utils/api";
import useAdminRedirect from "../../../../hooks/useAdminRedirect";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface FormData {
  name: string;
  description: string;
  weekDays: string[];
  time: string;
  price: string;
}

export default function CreateSession() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useAdminRedirect();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const formik = useFormik<FormData>({
    initialValues: {
      name: "",
      description: "",
      weekDays: [],
      time: "",
      price: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Session name is required"),
      description: Yup.string().required("Description is required"),
      weekDays: Yup.array()
        .of(Yup.string())
        .min(1, "Select at least one weekday"),
      time: Yup.string().required("Time is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .min(0, "Price must be 0 or more")
        .required("Price is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setError(null);
      setSuccess(null);

      try {
        const response = await fetchWithAuth("http://localhost:8080/api/session", {
          method: "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to create session");
        }

        setSuccess("Session created successfully!");
        resetForm();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    },
  });

  // Helper to toggle weekdays in Formik
  const toggleWeekDay = (day: string) => {
    const current = formik.values.weekDays;
    if (current.includes(day)) {
      formik.setFieldValue(
        "weekDays",
        current.filter((d) => d !== day)
      );
    } else {
      formik.setFieldValue("weekDays", [...current, day]);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>
        )}
        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-black"
            >
              Session Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-600 text-sm">{formik.errors.name}</div>
            ) : null}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-black"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              rows={4}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-600 text-sm">{formik.errors.description}</div>
            ) : null}
          </div>

          {/* Weekdays */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Week Days
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WEEKDAYS.map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="weekDays"
                    value={day}
                    checked={formik.values.weekDays.includes(day)}
                    onChange={() => toggleWeekDay(day)}
                    className="accent-blue-600"
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
            {formik.touched.weekDays && formik.errors.weekDays ? (
              <div className="text-red-600 text-sm">{formik.errors.weekDays}</div>
            ) : null}
          </div>

          {/* Time */}
          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-black"
            >
              Time
            </label>
            <input
              id="time"
              name="time"
              type="time"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.time}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {formik.touched.time && formik.errors.time ? (
              <div className="text-red-600 text-sm">{formik.errors.time}</div>
            ) : null}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-black"
            >
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
              className="mt-1 block w-full p-2 border border-[#1c1c1c] rounded-lg text-black"
            />
            {formik.touched.price && formik.errors.price ? (
              <div className="text-red-600 text-sm">{formik.errors.price}</div>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full bg-[#111] text-white p-2 rounded-lg"
          >
            Create Session
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
