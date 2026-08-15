import React, { Component, ErrorInfo, ReactNode } from "react";

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
        <div style={{ padding: "30px", background: "#1e1e1e", color: "#f48771", height: "100vh", fontFamily: "monospace", overflow: "auto" }}>
          <h1 style={{ color: "#e06c75", fontSize: "24px", marginBottom: "16px" }}>⚠️ Application Render Error</h1>
          <p style={{ color: "#abb2bf", fontSize: "14px", marginBottom: "20px" }}>An uncaught error occurred while rendering the twoballoons desktop interface.</p>
          <div style={{ background: "#282c34", padding: "16px", borderRadius: "8px", border: "1px solid #e06c75", marginBottom: "20px" }}>
            <strong style={{ color: "#d19a66" }}>{this.state.error?.name}: </strong>
            <span>{this.state.error?.message}</span>
            <pre style={{ color: "#5c6370", marginTop: "10px", fontSize: "12px", whiteSpace: "pre-wrap" }}>
              {this.state.error?.stack}
            </pre>
          </div>
          <button 
            style={{ padding: "8px 16px", background: "#98c379", color: "#282c34", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => window.location.reload()}
          >
            🔄 Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
