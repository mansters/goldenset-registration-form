import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Form from "./index";
import FormItem from "../FormItem";
import Input from "../Input";
import Button from "../Button";
import useForm from "./useForm";

describe("Component/Form", () => {
  it("behavior: renders form element", () => {
    const { container } = render(<Form>Content</Form>);
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
  });

  it("behavior: renders children", () => {
    render(
      <Form>
        <div data-testid="child">Child content</div>
      </Form>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("behavior: prevents default form submission", () => {
    const onFinish = jest.fn();
    render(
      <Form onFinish={onFinish}>
        <Button htmlType="submit">Submit</Button>
      </Form>
    );

    const form = screen.getByRole("button").closest("form");
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    form?.dispatchEvent(submitEvent);

    expect(submitEvent.defaultPrevented).toBe(true);
  });

  it("props check: onFinish called on successful validation", async () => {
    const onFinish = jest.fn();

    const TestComponent = () => {
      const [form] = useForm();
      return (
        <Form form={form} onFinish={onFinish}>
          <FormItem name="username" rules={[{ type: "required" }]}>
            <Input />
          </FormItem>
          <Button htmlType="submit">Submit</Button>
        </Form>
      );
    };

    const { container } = render(<TestComponent />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "john" } });

    // Submit form directly
    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it("props check: onFinishFailed called on validation failure", async () => {
    const onFinishFailed = jest.fn();

    const TestComponent = () => {
      const [form] = useForm();
      return (
        <Form form={form} onFinishFailed={onFinishFailed}>
          <FormItem name="username" rules={[{ type: "required" }]}>
            <Input />
          </FormItem>
          <Button htmlType="submit">Submit</Button>
        </Form>
      );
    };

    const { container } = render(<TestComponent />);

    // Submit form directly without filling required field
    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(onFinishFailed).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it("props check: layout prop sets vertical layout", () => {
    const { container } = render(
      <Form layout="vertical">
        <FormItem label="Username">
          <Input />
        </FormItem>
      </Form>
    );

    const formItem = container.querySelector(".form-item-vertical");
    expect(formItem).toBeInTheDocument();
  });

  it("props check: layout prop sets horizontal layout", () => {
    const { container } = render(
      <Form layout="horizontal">
        <FormItem label="Username">
          <Input />
        </FormItem>
      </Form>
    );

    const formItem = container.querySelector(".form-item-horizontal");
    expect(formItem).toBeInTheDocument();
  });

  it("props check: labelCol and wrapperCol passed to FormItem", () => {
    const { container } = render(
      <Form layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <FormItem label="Username" name="username">
          <Input />
        </FormItem>
      </Form>
    );

    const labelCol = container.querySelector(".col-8");
    const wrapperCol = container.querySelector(".col-16");

    expect(labelCol).toBeInTheDocument();
    expect(wrapperCol).toBeInTheDocument();
  });

  it("behavior: uses external form instance when provided", () => {
    const TestComponent = () => {
      const [form] = useForm();

      React.useEffect(() => {
        form.setFieldValue("username", "preset");
      }, [form]);

      return (
        <Form form={form}>
          <FormItem name="username">
            <Input />
          </FormItem>
        </Form>
      );
    };

    render(<TestComponent />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("preset");
  });

  it("behavior: creates internal form instance when not provided", () => {
    render(
      <Form>
        <FormItem name="username">
          <Input />
        </FormItem>
      </Form>
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    expect((input as HTMLInputElement).value).toBe("test");
  });
});
