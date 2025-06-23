// src/__tests__/create-session.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mocks must come BEFORE component imports
jest.mock('@/components/DashboardLayout', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}));

jest.mock('@/utils/api', () => ({
  fetchWithAuth: jest.fn(),
}));

import CreateSession from '@/pages/Admin/Sessions/create-session';
import { fetchWithAuth } from '@/utils/api';

describe('CreateSession component', () => {
  beforeEach(() => {
    localStorage.setItem('accessToken', 'test-token');
  });

  it('renders the form inputs', () => {
    render(<CreateSession />);
    expect(screen.getByLabelText(/session name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  });

  it('allows filling the form and toggling a weekday', () => {
    render(<CreateSession />);
    const nameInput = screen.getByLabelText(/session name/i);
    fireEvent.change(nameInput, { target: { value: 'Yoga' } });
    expect(nameInput).toHaveValue('Yoga');

    const mondayCheckbox = screen.getByLabelText(/monday/i);
    fireEvent.click(mondayCheckbox);
    expect(mondayCheckbox).toBeChecked();
  });

  it('submits the form and shows success', async () => {
    (fetchWithAuth as jest.Mock).mockResolvedValue({ ok: true });

    render(<CreateSession />);

    fireEvent.change(screen.getByLabelText(/session name/i), { target: { value: 'Cardio' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Burn fat' } });
    fireEvent.click(screen.getByLabelText(/monday/i));
    fireEvent.change(screen.getByLabelText(/time/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '20' } });

    fireEvent.click(screen.getByText(/create session/i));

    await waitFor(() =>
      expect(screen.getByText(/session created successfully/i)).toBeInTheDocument()
    );
  });
});
