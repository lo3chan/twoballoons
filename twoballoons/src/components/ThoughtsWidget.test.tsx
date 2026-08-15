import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThoughtsWidget } from "./ThoughtsWidget";

import { fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

describe("ThoughtsWidget", () => {
  it("renders placeholder", () => {
    render(<ThoughtsWidget thoughts={[]} />);
    expect(screen.getByText(/AI Engine Thoughts/i)).toBeInTheDocument();
    expect(screen.getByText(/No thoughts yet/i)).toBeInTheDocument();
  });

  it("handles generation with mocked streaming response", async () => {
    const encoder = new TextEncoder();
    const mockStreamData = [
      "data: " + JSON.stringify({ type: "thought", content: "Analyzing diagram request..." }) + "\n\n",
      "data: " + JSON.stringify({ type: "token", content: "actor User" }) + "\n\n"
    ].join("");

    const mockReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(mockStreamData));
        controller.close();
      }
    });

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      body: mockReadableStream
    }));

    const onStreamToken = vi.fn();
    render(<ThoughtsWidget thoughts={[]} onStreamToken={onStreamToken} />);

    const input = screen.getByPlaceholderText(/Generate diagram/i);
    const button = screen.getByRole("button", { name: /Generate/i });

    fireEvent.change(input, { target: { value: "test prompt" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Analyzing diagram request.../i)).toBeInTheDocument();
      expect(onStreamToken).toHaveBeenCalledWith("actor User");
    });
  });
});
