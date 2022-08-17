import React from "react";
import Button from "../index";
import { render, screen } from "@testing-library/react";

describe("App", () => {
  test("renders App component", async () => {
    render(
      <div data-testid="root">
        <Button label={"test"}/>
      </div>
    );
    console.log(screen.getByTestId("root").innerHTML);
    expect(1).toBe(1);
  });
});
