import { renderHook } from "@testing-library/react";
import useForm from "./useForm";
import FormStore from "./FormStore";

describe("Component/Form/useForm", () => {
  it("behavior: returns form instance", () => {
    const { result } = renderHook(() => useForm());
    const [form] = result.current;

    expect(form).toBeDefined();
    expect(form.getFieldValue).toBeDefined();
    expect(form.setFieldValue).toBeDefined();
  });

  it("behavior: returns same instance across re-renders", () => {
    const { result, rerender } = renderHook(() => useForm());
    const [firstForm] = result.current;

    rerender();
    const [secondForm] = result.current;

    expect(firstForm).toBe(secondForm);
  });

  it("props check: uses provided form instance", () => {
    const formStore = new FormStore();
    const providedForm = formStore.getForm();

    const { result } = renderHook(() => useForm(providedForm));
    const [form] = result.current;

    expect(form).toBe(providedForm);
  });

  it("behavior: creates new form instance when not provided", () => {
    const { result: result1 } = renderHook(() => useForm());
    const { result: result2 } = renderHook(() => useForm());

    const [form1] = result1.current;
    const [form2] = result2.current;

    expect(form1).not.toBe(form2);
  });

  it("behavior: form instance methods work correctly", () => {
    const { result } = renderHook(() => useForm());
    const [form] = result.current;

    form.setFieldValue("test", "value");
    expect(form.getFieldValue("test")).toBe("value");
  });
});
