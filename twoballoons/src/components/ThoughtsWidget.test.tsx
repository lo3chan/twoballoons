import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThoughtsWidget } from "./ThoughtsWidget";

describe("ThoughtsWidget", () => {
  it("renders placeholder", () => {
    render(<ThoughtsWidget thoughts={[]} />);
    expect(screen.getByText(/AI Engine Thoughts/i)).toBeInTheDocument();
  });
});
