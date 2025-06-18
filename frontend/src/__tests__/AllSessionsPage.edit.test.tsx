import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditModalButton from "@/components/EditModal";


describe("EditModalButton", () => {
  it("renders title and children when open", () => {
    render(
      <EditModalButton
        title="Edit Session"
        isOpen={true}
        onClose={jest.fn()}
      >
        <div>Modal Content</div>
      </EditModalButton>
    );

    expect(screen.getByText("Edit Session")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <EditModalButton isOpen={false} onClose={jest.fn()}>
        <div>Hidden Content</div>
      </EditModalButton>
    );

    expect(screen.queryByText("Hidden Content")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = jest.fn();

    render(
      <EditModalButton isOpen={true} onClose={onCloseMock}>
        <div>Test Content</div>
      </EditModalButton>
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
