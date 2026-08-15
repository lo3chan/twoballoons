import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DiagramModal } from './DiagramModal';

describe('DiagramModal', () => {
  it('renders correctly when open', () => {
    const onCloseMock = vi.fn();
    const onExportCanvasMock = vi.fn();

    render(<DiagramModal isOpen={true} onClose={onCloseMock} onExportCanvas={onExportCanvasMock} />);

    expect(screen.getByText('Universal Diagram Transpiler')).toBeInTheDocument();
    expect(screen.getByText('Export Diagram')).toBeInTheDocument();
    expect(screen.getByText('Import Syntax')).toBeInTheDocument();
    expect(screen.getByText('⚡ Transpile')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    const onCloseMock = vi.fn();
    render(<DiagramModal isOpen={false} onClose={onCloseMock} />);

    expect(screen.queryByText('Universal Diagram Transpiler')).not.toBeInTheDocument();
  });
});
