import { render, screen } from '@testing-library/react';
import { HomePage } from '../src/routes/-components/home-page';

describe('HomePage', () => {
  it('shows the project title and primary action in French', () => {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', { name: 'Orchestrateur Pharmafield' }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Commencer' })).toBeTruthy();
  });
});
