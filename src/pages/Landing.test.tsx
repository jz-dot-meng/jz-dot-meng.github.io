import React from 'react';
import { render, screen } from '@testing-library/react';
import Landing from './Landing';

test('renders h1 element', () => {
    render(<Landing />);
    const h1Element = screen.getByText(/meng/i);
    expect(h1Element).toBeInTheDocument();
});
