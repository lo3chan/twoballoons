import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "30px", background: "#faf5ee", color: "#3a302a", height: "100vh", fontFamily: "Manrope, sans-serif", overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#f6f0e8", padding: "40px", borderRadius: "12px", border: "1px solid rgba(216, 208, 200, 0.6)", boxShadow: "0 2px 16px rgba(58, 48, 42, 0.04)", maxWidth: "600px", width: "100%" }}>
            <h1 style={{ color: "#c2652a", fontSize: "28px", marginBottom: "16px", fontFamily: "'EB Garamond', serif" }}>Application Render Error</h1>
            <p style={{ color: "#605850", fontSize: "16px", marginBottom: "24px" }}>An uncaught error occurred while rendering the twoballoons desktop interface.</p>
            <div style={{ background: "#faf5ee", padding: "16px", borderRadius: "8px", border: "1px solid #d8d0c8", marginBottom: "24px", overflowX: "auto" }}>
              <strong style={{ color: "#8c3c3c", fontFamily: "monospace" }}>{this.state.error?.name}: </strong>
              <span style={{ fontFamily: "monospace", color: "#3a302a" }}>{this.state.error?.message}</span>
              <pre style={{ color: "#605850", marginTop: "12px", fontSize: "13px", whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                {this.state.error?.stack}
              </pre>
            </div>
            <button
              style={{ padding: "12px 24px", background: "#c2652a", color: "#faf5ee", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", transition: "background 0.2s" }}
              onClick={() => window.location.reload()}
              onMouseOver={(e) => e.currentTarget.style.background = "#e08850"}
              onMouseOut={(e) => e.currentTarget.style.background = "#c2652a"}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
