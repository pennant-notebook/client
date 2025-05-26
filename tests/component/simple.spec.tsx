import { expect, test } from "@playwright/experimental-ct-react";
import React from "react";

// Simple test component
const TestButton = ({ label, onClick }: { label: string; onClick?: () => void }) => (
  <button
    onClick={onClick}
    data-testid="test-button">
    {label}
  </button>
);

test("Simple component test", async ({ mount }) => {
  const component = await mount(<TestButton label="Click me" />);

  await expect(component).toBeVisible();
  await expect(component.getByTestId("test-button")).toContainText("Click me");
});
