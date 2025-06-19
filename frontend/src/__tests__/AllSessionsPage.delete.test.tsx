import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteModal from "@/components/DeleteModal"; 

describe("DeleteModal", () => {
  
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();


  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when isOpen is true", () => {
    render(<DeleteModal {...defaultProps} />);

    
    expect(screen.getByRole("dialog", { name: /delete item/i })).toBeInTheDocument();
    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this item? This action cannot be undone.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument(); // X button
  });

  it("does not render modal when isOpen is false", () => {
    render(<DeleteModal {...defaultProps} isOpen={false} />);

   
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete Item")).not.toBeInTheDocument();
  });

  it("renders custom title and message when provided", () => {
    const customProps = {
      ...defaultProps,
      title: "Delete Session",
      message: "Are you sure you want to delete this session?",
    };
    render(<DeleteModal {...customProps} />);

    
    expect(screen.getByRole("dialog", { name: /delete session/i })).toBeInTheDocument();
    expect(screen.getByText("Delete Session")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete this session?")).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<DeleteModal {...defaultProps} />);

  
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("calls onClose when X button is clicked", () => {
    render(<DeleteModal {...defaultProps} />);

   
    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it("calls onConfirm and onClose when Delete button is clicked", () => {
    render(<DeleteModal {...defaultProps} />);

    
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("has accessible dialog with proper ARIA attributes", () => {
    render(<DeleteModal {...defaultProps} />);

    const dialog = screen.getByRole("dialog", { name: /delete item/i });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Are you sure you want to delete this item? This action cannot be undone.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toHaveAttribute("type", "button");
    expect(screen.getByRole("button", { name: /delete/i })).toHaveAttribute("type", "button");
  });
});