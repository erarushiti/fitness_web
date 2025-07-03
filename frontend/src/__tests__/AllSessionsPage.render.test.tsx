import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AllSessionsPage from '@/pages/Admin/Sessions/index';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { id: '1', name: 'Yoga', description: 'Stretching', weekDays: ['Monday'], time: '10:00', price: 15, isOpen: true }
    ])
  })
) as jest.Mock;

describe('AllSessionsPage - Render', () => {
  it('fetches and displays sessions in table', async () => {
    render(<AllSessionsPage />);

    await waitFor(() => {
      expect(screen.getByText('Yoga')).toBeInTheDocument();
      expect(screen.getByText('Stretching')).toBeInTheDocument();
    });
  });
});
