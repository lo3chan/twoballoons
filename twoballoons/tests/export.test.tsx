import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportModal } from '../src/components/ExportModal';
import { useStore } from '../src/store';
import React from 'react';

// Mock the global URL object used for downloading
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('Export Modal', () => {
  it('should generate SVG correctly and trigger download', () => {
    // Setup store with sample data
    useStore.setState({
      nodes: [
        { id: 'web_app', name: 'Web Application', label: 'Web Application', kind: 'Container', x: 180, y: 140, description: 'Test' },
        { id: 'api_gw', name: 'API Gateway', label: 'API Gateway', kind: 'Container', x: 500, y: 320, description: 'Test' },
      ],
      edges: [
        { from: 'web_app', to: 'api_gw', label: 'HTTPS / REST', rel_type: 'DirectedFlow' }
      ]
    });

    const mockClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<ExportModal isOpen={true} onClose={() => {}} />);

    // Find SVG export button
    const svgButton = screen.getByText('Vector SVG');
    fireEvent.click(svgButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();

    mockClick.mockRestore();
  });

  it('should generate TikZ correctly and trigger download', () => {
    const mockClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    render(<ExportModal isOpen={true} onClose={() => {}} />);

    // Find TikZ export button
    const tikzButton = screen.getByText('LaTeX TikZ');
    fireEvent.click(tikzButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();

    mockClick.mockRestore();
  });
});
