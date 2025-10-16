import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormItem from "./index";
import Form from "../Form";
import Input from "../Input";
import useForm from "../Form/useForm";
import { testPropToClassName } from "../__tests__/testUtils";

describe("Component/FormItem", () => {
  it("check default classes", () => {
    const { container } = render(
      <Form layout="vertical">
        <FormItem label="Test">
          <Input />
        </FormItem>
      </Form>
    );
    const formItem = container.querySelector(".form-item");
    expect(formItem).toBeInTheDocument();
    expect(formItem).toHaveClass("form-item");
    expect(formItem).toHaveClass("form-item-vertical");
  });

  it("props check: label renders", () => {
    render(
      <Form>
        <FormItem label="Username">
          <Input />
        </FormItem>
      </Form>
    );
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("props check: vertical layout", () => {
    const { container } = render(
      <Form layout="vertical">
        <FormItem name="test">
          <Input />
        </FormItem>
      </Form>
    );
    expect(container.querySelector(".form-item-vertical")).toBeInTheDocument();
  });

  it("props check: horizontal layout", () => {
    const { container } = render(
      <Form layout="horizontal">
        <FormItem name="test">
          <Input />
        </FormItem>
      </Form>
    );
    expect(container.querySelector(".form-item-horizontal")).toBeInTheDocument();
  });

  it("props check: required asterisk shows", () => {
    const { container } = render(
      <Form>
        <FormItem name="test" label="Test" rules={[{ type: "required" }]}>
          <Input />
        </FormItem>
      </Form>
    );
    expect(container.querySelector(".form-item-required")).toBeInTheDocument();
  });

  it("behavior: injects value to child", () => {
    function TestComp() {
      const [form] = useForm();
      form.setFieldValue("test", "value");
      return (
        <Form form={form}>
          <FormItem name="test">
            <Input />
          </FormItem>
        </Form>
      );
    }
    render(<TestComp />);
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("value");
  });

  it("behavior: injects onChange to child", () => {
    render(
      <Form>
        <FormItem name="test">
          <Input />
        </FormItem>
      </Form>
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new" } });
    expect((input as HTMLInputElement).value).toBe("new");
  });
});
