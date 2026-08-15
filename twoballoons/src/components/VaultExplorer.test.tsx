import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { VaultExplorer } from './VaultExplorer';

vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn().mockResolvedValue([
        { name: 'architecture.balloon', is_dir: false },
        { name: 'logic_proofs.logi', is_dir: false }
    ])
}));

describe('VaultExplorer', () => {
    it('renders local vault header', async () => {
        render(<VaultExplorer />);
        expect(screen.getByText(/Vault Explorer/i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('Architecture.logi')).toBeInTheDocument();
        });
    });
});
