import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AllUsersPage from "@/pages/Admin/users/index";

jest.mock("@/components/DashboardLayout", () => {
  const React = require("react");
  return function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

jest.mock("@/components/Table", () => {
  const React = require("react");
  return function Table({ data }: { data: any[] }) {
    return (
      <div>
        {data.map((item) => (
          <div key={item.id}>
            {Object.values(item).map((val, i) => (
              <span key={i}>{String(val)}</span>
            ))}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("@/components/EditModal", () => {
  const React = require("react");
  return function EditModal() {
    return null;
  };
});

jest.mock("@/components/DeleteModal", () => {
  const React = require("react");
  return function DeleteModal() {
    return null;
  };
});

beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn((key) => {
        if (key === "accessToken") return "mock-token";
        if (key === "role") return "admin";
        return null;
      }),
      setItem: jest.fn(),
    },
    writable: true,
  });
});

import { fetchWithAuth } from "@/utils/api";
jest.mock("@/utils/api", () => ({
  fetchWithAuth: jest.fn(),
}));

describe("AllUsersPage - GET API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches All users by default", async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: "1",
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@example.com",
          role: "admin",
          createdAt: "2024-01-01",
        },
      ],
    });

    render(<AllUsersPage />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Smith")).toBeInTheDocument();
      expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    });

    expect(fetchWithAuth).toHaveBeenCalledWith("http://localhost:8080/api/auth/users");
  });

  it("fetches Clients when Clients tab is clicked", async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: "2",
          name: "Client Bob",
          email: "client@example.com",
          fitnessGoals: "Weight loss",
          weight: 75,
          height: 180,
        },
      ],
    });

    render(<AllUsersPage />);
    fireEvent.click(screen.getByText("Clients"));

    await waitFor(() => {
      expect(screen.getByText("Client Bob")).toBeInTheDocument();
      expect(screen.getByText("client@example.com")).toBeInTheDocument();
      expect(screen.getByText("Weight loss")).toBeInTheDocument();
    });

    expect(fetchWithAuth).toHaveBeenCalledWith("http://localhost:8080/api/auth/clients");
  });

  it("fetches Trainers when Trainers tab is clicked", async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: "3",
          name: "Trainer Zoe",
          email: "trainer@example.com",
          specialization: "Strength",
          experienceYears: 7,
        },
      ],
    });

    render(<AllUsersPage />);
    fireEvent.click(screen.getByText("Trainers"));

    await waitFor(() => {
      expect(screen.getByText("Trainer Zoe")).toBeInTheDocument();
      expect(screen.getByText("trainer@example.com")).toBeInTheDocument();
      expect(screen.getByText("Strength")).toBeInTheDocument();
    });

    expect(fetchWithAuth).toHaveBeenCalledWith("http://localhost:8080/api/auth/trainers");
  });
});
