import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Alert from "./index";
import { testPropToClassName } from "../__tests__/testUtils";

describe("Component/Alert", () => {
  it("check default classes", () => {
    testPropToClassName(<Alert type="success" message="Test" />, ["alert", "alert-success"]);
  });

  it("props check: custom className", () => {
    const cls = `custom-class-${Math.floor(Math.random() * 10000)}`;
    testPropToClassName(<Alert type="success" message="Test" className={cls} />, ["alert", "alert-success", cls]);
  });

  it("props check: message renders correctly", () => {
    render(<Alert type="success" message="Operation successful" />);
    expect(screen.getByText("Operation successful")).toBeInTheDocument();
  });

  it("props classNames mapping check: type success", () => {
    testPropToClassName(<Alert type="success" message="Test" />, "alert-success");
  });

  it("props classNames mapping check: type warning", () => {
    testPropToClassName(<Alert type="warning" message="Test" />, "alert-warning");
  });

  it("props classNames mapping check: type error", () => {
    testPropToClassName(<Alert type="error" message="Test" />, "alert-error");
  });

  it("behavior: renders success icon", () => {
    const { container } = render(<Alert type="success" message="Test" />);
    const icon = container.querySelector(".alert-icon");
    expect(icon).toBeInTheDocument();
  });

  it("behavior: renders warning icon", () => {
    const { container } = render(<Alert type="warning" message="Test" />);
    const icon = container.querySelector(".alert-icon");
    expect(icon).toBeInTheDocument();
  });

  it("behavior: renders error icon", () => {
    const { container } = render(<Alert type="error" message="Test" />);
    const icon = container.querySelector(".alert-icon");
    expect(icon).toBeInTheDocument();
  });

  it("behavior: has role alert", () => {
    render(<Alert type="success" message="Test" />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
  });
});
