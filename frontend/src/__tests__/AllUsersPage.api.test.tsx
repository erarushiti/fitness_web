import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AllUsersPage from '@/pages/Admin/users/index';

// Mock localStorage for token retrieval
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => "mock-token"),
      setItem: jest.fn(),
    },
    writable: true,
  });
});

// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});

describe("AllUsersPage API GET", () => {
  const mockFetch = (data: any[]) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      })
    ) as jest.Mock;
  };

  it("fetches and displays users when 'All' tab is selected", async () => {
    mockFetch([
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "admin",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ]);

    render(<AllUsersPage />);

    await waitFor(() => {
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/auth/users",
      expect.any(Object)
    );
  });

  it("fetches and displays clients when 'Clients' tab is selected", async () => {
    mockFetch([
      {
        id: "2",
        name: "Client One",
        email: "client@example.com",
        fitnessGoals: "Lose weight",
        weight: 70,
        height: 170,
      },
    ]);

    render(<AllUsersPage />);
    fireEvent.click(screen.getByText("Clients"));

    await waitFor(() => {
      expect(screen.getByText("Client One")).toBeInTheDocument();
      expect(screen.getByText("client@example.com")).toBeInTheDocument();
      expect(screen.getByText("Lose weight")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/auth/clients",
      expect.any(Object)
    );
  });

  it("fetches and displays trainers when 'Trainers' tab is selected", async () => {
    mockFetch([
      {
        id: "3",
        name: "Trainer X",
        email: "trainer@example.com",
        specialization: "Strength",
        experienceYears: 5,
      },
    ]);

    render(<AllUsersPage />);
    fireEvent.click(screen.getByText("Trainers"));

    await waitFor(() => {
      expect(screen.getByText("Trainer X")).toBeInTheDocument();
      expect(screen.getByText("trainer@example.com")).toBeInTheDocument();
      expect(screen.getByText("Strength")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/auth/trainers",
      expect.any(Object)
    );
  });
});
