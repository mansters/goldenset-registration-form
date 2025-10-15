import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from ".";
import { testPropToClassName } from "../__tests__/testUtils";

describe("Component/Button", () => {
  it("check default classes", () => {
    testPropToClassName(<Button />, ["btn", "btn-default"]);
  });

  it("props check -> custom className", () => {
    const cls = `custom-class-${Math.floor(Math.random() * 10000)}`;
    testPropToClassName(<Button className={cls} />, ["btn", "btn-default", cls]);
  });

  it("props check -> onClick", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("props check -> disabled", () => {
    render(<Button disabled>Click Me</Button>);

    const button = screen.getByText("Click Me") as HTMLButtonElement;
    expect(button).toBeDisabled();
  });

  it("behavior check -> does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click Me
      </Button>
    );

    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("props classNames mapping check -> type", () => {
    const types: Array<"default" | "primary"> = ["default", "primary"];

    types.forEach((type) => {
      testPropToClassName(<Button type={type}>Click Me</Button>, ["btn", `btn-${type}`]);
    });
  });
});
