import { render, screen } from '@testing-library/react';
import App from './App';

test('check Landing page', () => {
  render(<App />);

  expect(
    screen.getByText('Landing Page')
  ).toBeInTheDocument();
});