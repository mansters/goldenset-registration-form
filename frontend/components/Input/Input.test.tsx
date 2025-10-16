import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Input from ".";
import { testPropToClassName } from "../__tests__/testUtils";

describe("Component/Input", () => {
  describe("Text", () => {
    it("check default classes", () => {
      testPropToClassName(<Input />, "input");
    });

    it("props check -> custom className", () => {
      const cls = `custom-class-${Math.floor(Math.random() * 10000)}`;
      testPropToClassName(<Input className={cls} />, ["input", cls]);
    });

    it("behavior: handles onChange", () => {
      const handleChange = jest.fn();
      render(<Input value="" onChange={handleChange} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "new" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("new");
    });

    it("behavior: updates value on change", () => {
      const { rerender } = render(<Input value="init" />);
      let input = screen.getByDisplayValue("init") as HTMLInputElement;
      expect(input.value).toBe("init");

      rerender(<Input value="updated" />);
      input = screen.getByDisplayValue("updated") as HTMLInputElement;
      expect(input.value).toBe("updated");
    });

    it("props check: placeholder", () => {
      render(<Input placeholder="placeholder" />);
      const input = screen.getByPlaceholderText("placeholder");
      expect(input).toBeInTheDocument();
    });

    it("props check: disabled", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it("behavior: default value", () => {
      render(<Input />);
      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });

  describe("Password", () => {
    it("behavior: show/hide btn should be rendered under password type", () => {
      render(<Input type="password" />);
      expect(screen.getByText("Show")).toBeInTheDocument();
    });

    it("behavior: show/hide btn should not be rendered under text type", () => {
      render(<Input type="text" />);
      expect(screen.queryByText("Show")).not.toBeInTheDocument();
      expect(screen.queryByText("Hide")).not.toBeInTheDocument();
    });

    it("behavior: toggles password visibility", () => {
      const { container } = render(<Input type="password" />);

      const input = container.querySelector("input") as HTMLInputElement;
      const toggleButton = screen.getByText("Show");

      // init
      expect(input.type).toBe("password");
      expect(toggleButton).toHaveTextContent("Show");

      // to show
      fireEvent.click(toggleButton);
      expect(input.type).toBe("text");
      expect(screen.getByText("Hide")).toBeInTheDocument();

      // to hide
      fireEvent.click(screen.getByText("Hide"));
      expect(input.type).toBe("password");
      expect(screen.getByText("Show")).toBeInTheDocument();
    });

    it("behavior: disables toggle button when input is disabled", () => {
      render(<Input type="password" disabled />);
      const toggleButton = screen.getByText("Show") as HTMLButtonElement;
      expect(toggleButton).toBeDisabled();
    });
  });
});
