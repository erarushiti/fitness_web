import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import AllSessionsPage from '@/pages/Admin/Sessions/index';

describe("AllSessionsPage API GET", () => {
  const mockSessions = [
    {
      id: "1",
      name: "Morning Yoga",
      description: "Stretch and relax",
      weekDays: ["Monday", "Wednesday"],
      time: "08:00",
      price: 15,
      isOpen: true,
    },
    {
      id: "2",
      name: "Evening Cardio",
      description: "High intensity training",
      weekDays: ["Tuesday", "Thursday"],
      time: "18:00",
      price: 20,
      isOpen: true,
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSessions),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches sessions and displays them", async () => {
    render(<AllSessionsPage />);

    await waitFor(() => {
      expect(screen.getByText("Morning Yoga")).toBeInTheDocument();
      expect(screen.getByText("Evening Cardio")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith("http://localhost:8080/api/session");
  });
});
