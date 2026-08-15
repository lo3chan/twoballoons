import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DiagramModal } from './DiagramModal';

test('DiagramModal renders correctly when open', () => {
    const onExportCanvasMock = vi.fn();
    const onCloseMock = vi.fn();

    render(<DiagramModal isOpen={true} onClose={onCloseMock} onExportCanvas={onExportCanvasMock} />);

    expect(screen.getByText('Diagram Tools')).toBeInTheDocument();
    expect(screen.getByText('Export Canvas as Image')).toBeInTheDocument();
    expect(screen.getByText('Generate Export')).toBeInTheDocument();
    expect(screen.getByText('Copy Code')).toBeInTheDocument();
});
