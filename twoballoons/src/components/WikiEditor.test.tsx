import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WikiEditor } from './WikiEditor';
import { useStore } from '../store';

vi.mock('react-markdown', () => ({
    default: ({ children }: any) => <div data-testid="markdown-preview">{children}</div>
}));
vi.mock('remark-gfm', () => ({ default: () => {} }));
vi.mock('remark-math', () => ({ default: () => {} }));
vi.mock('rehype-katex', () => ({ default: () => {} }));

describe('WikiEditor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return null if not open or node not found', () => {
        useStore.setState({ isWikiEditorOpen: false, selectedWikiNodeId: null, nodes: [] });
        const { container } = render(<WikiEditor />);
        expect(container.firstChild).toBeNull();
    });

    it('should render and switch tabs', () => {
        useStore.setState({
            isWikiEditorOpen: true,
            selectedWikiNodeId: 'node1',
            nodes: [{ id: 'node1', name: 'Test Node', x: 0, y: 0, type: 'container', wikiContent: 'Test Content' }]
        });
        
        render(<WikiEditor />);
        
        expect(screen.getByText('Wiki / Docs:')).toBeInTheDocument();
        expect(screen.getByText('Test Node')).toBeInTheDocument();
        
        const textArea = screen.getByDisplayValue('Test Content');
        expect(textArea).toBeInTheDocument();
        expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
        
        act(() => {
            fireEvent.click(screen.getByText('Edit'));
        });
        expect(screen.getByDisplayValue('Test Content')).toBeInTheDocument();
        expect(screen.queryByTestId('markdown-preview')).not.toBeInTheDocument();

        act(() => {
            fireEvent.click(screen.getByText('Preview'));
        });
        expect(screen.queryByDisplayValue('Test Content')).not.toBeInTheDocument();
        expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
    });

    it('should update content and store', () => {
        let updatedId = '';
        let updatedData: any = {};
        
        useStore.setState({
            isWikiEditorOpen: true,
            selectedWikiNodeId: 'node1',
            nodes: [{ id: 'node1', name: 'Test Node', x: 0, y: 0, type: 'container', wikiContent: '' }],
            updateNode: (id, data) => {
                updatedId = id;
                updatedData = data;
            }
        });
        
        render(<WikiEditor />);
        
        const textArea = screen.getByPlaceholderText(/Markdown Documentation/);
        act(() => {
            fireEvent.change(textArea, { target: { value: '# Hello' } });
        });
        
        expect(updatedId).toBe('node1');
        expect(updatedData.wikiContent).toBe('# Hello');
    });
});
