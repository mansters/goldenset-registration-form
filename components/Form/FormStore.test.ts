import FormStore from "./FormStore";
import { ValidationBehavior } from "./interface";

describe("Component/Form/FormStore", () => {
  let formStore: FormStore;
  let formInstance: ReturnType<FormStore["getForm"]>;

  beforeEach(() => {
    formStore = new FormStore();
    formInstance = formStore.getForm();
  });

  describe("field value management", () => {
    it("behavior: getFieldValue returns undefined for unregistered field", () => {
      expect(formInstance.getFieldValue("test")).toBeUndefined();
    });

    it("behavior: setFieldValue stores value", () => {
      formInstance.setFieldValue("username", "john");
      expect(formInstance.getFieldValue("username")).toBe("john");
    });

    it("behavior: setFieldsValue sets multiple values", () => {
      formInstance.setFieldsValue({ username: "john", email: "john@test.com" });
      expect(formInstance.getFieldValue("username")).toBe("john");
      expect(formInstance.getFieldValue("email")).toBe("john@test.com");
    });

    it("behavior: getFieldsValue returns all field values", () => {
      formInstance.setFieldValue("username", "john");
      formInstance.setFieldValue("email", "john@test.com");

      const values = formInstance.getFieldsValue();
      expect(values).toEqual({ username: "john", email: "john@test.com" });
    });
  });

  describe("error management", () => {
    it("behavior: getFieldError returns empty array for field without errors", () => {
      formInstance.setFieldValue("test", "value");
      expect(formInstance.getFieldError("test")).toEqual([]);
    });

    it("behavior: setFieldError stores errors", () => {
      formInstance.setFieldError("username", ["Required field"]);
      expect(formInstance.getFieldError("username")).toEqual(["Required field"]);
    });

    it("behavior: setFieldError can store multiple errors", () => {
      formInstance.setFieldError("password", ["Too short", "Missing number"]);
      expect(formInstance.getFieldError("password")).toEqual(["Too short", "Missing number"]);
    });
  });

  describe("touched state management", () => {
    it("behavior: isFieldTouched returns false for untouched field", () => {
      formInstance.setFieldValue("test", "value");
      expect(formInstance.isFieldTouched("test")).toBe(false);
    });

    it("behavior: setFieldTouched marks field as touched", () => {
      formInstance.setFieldTouched("username", true);
      expect(formInstance.isFieldTouched("username")).toBe(true);
    });

    it("behavior: setFieldTouched can mark field as untouched", () => {
      formInstance.setFieldTouched("username", true);
      formInstance.setFieldTouched("username", false);
      expect(formInstance.isFieldTouched("username")).toBe(false);
    });
  });

  describe("validation", () => {
    it("behavior: validateField resolves for field without rules", async () => {
      formInstance.setFieldValue("test", "value");
      await expect(formInstance.validateField("test")).resolves.toBeUndefined();
    });

    it("behavior: validateField marks field as touched", async () => {
      formStore.setRules("username", [{ type: "required" }]);
      formInstance.setFieldValue("username", "test");

      await formInstance.validateField("username");
      expect(formInstance.isFieldTouched("username")).toBe(true);
    });

    it("behavior: validateField sets errors on validation failure", async () => {
      formStore.registerField("username");
      formStore.setRules("username", [{ type: "required" }]);

      await expect(formInstance.validateField("username")).rejects.toBeDefined();
      expect(formInstance.getFieldError("username").length).toBeGreaterThan(0);
    });

    it("behavior: validateAllFields validates all registered fields", async () => {
      formStore.setRules("username", [{ type: "required" }]);
      formStore.setRules("email", [{ type: "required" }]);

      formInstance.setFieldValue("username", "");
      formInstance.setFieldValue("email", "");

      await expect(formInstance.validateAllFields()).rejects.toBeDefined();
    });
  });

  describe("validation behavior", () => {
    it("behavior: ONE_BY_ONE stops at first error", async () => {
      formStore.registerField("test");
      formStore.setValidateBehavior(ValidationBehavior.ONE_BY_ONE);
      formStore.setRules("test", [
        { type: "required", message: "Error 1" },
        { type: "pattern", pattern: /\d+/, message: "Error 2" },
      ]);

      await expect(formInstance.validateField("test")).rejects.toBeDefined();
      expect(formInstance.getFieldError("test")).toHaveLength(1);
    });

    it("behavior: ALL collects all errors", async () => {
      formStore.setValidateBehavior(ValidationBehavior.ALL);
      formStore.setRules("test", [
        { type: "required", message: "Error 1" },
        { type: "pattern", pattern: /\d+/, message: "Error 2" },
      ]);
      formInstance.setFieldValue("test", "abc");

      await expect(formInstance.validateField("test")).rejects.toBeDefined();
      expect(formInstance.getFieldError("test")).toHaveLength(1);
    });
  });

  describe("field registration", () => {
    it("behavior: registerField creates field in store", () => {
      formStore.registerField("newField");
      expect(formInstance.getFieldValue("newField")).toBeUndefined();
      expect(formStore.getStore().newField).toBeDefined();
    });

    it("behavior: unregisterField removes field from store", () => {
      formInstance.setFieldValue("temp", "value");
      formStore.unregisterField("temp");
      expect(formStore.getStore().temp).toBeUndefined();
    });

    it("behavior: register adds listener and returns unsubscribe", () => {
      const listener = jest.fn();
      const unsubscribe = formStore.register("field", [], listener);

      formInstance.setFieldValue("other", "value");
      expect(listener).toHaveBeenCalled();

      listener.mockClear();
      unsubscribe();
      formInstance.setFieldValue("another", "value");
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("behavior: reset clears all field values", () => {
      formInstance.setFieldValue("username", "john");
      formInstance.setFieldValue("email", "john@test.com");

      formInstance.reset();

      expect(formInstance.getFieldValue("username")).toBeUndefined();
      expect(formInstance.getFieldValue("email")).toBeUndefined();
    });

    it("behavior: reset clears touched states", () => {
      formInstance.setFieldTouched("username", true);
      formInstance.reset();
      expect(formInstance.isFieldTouched("username")).toBe(false);
    });

    it("behavior: reset clears errors", () => {
      formInstance.setFieldError("username", ["Error"]);
      formInstance.reset();
      expect(formInstance.getFieldError("username")).toEqual([]);
    });
  });

  describe("submit", () => {
    it("behavior: calls onFinish when validation passes", async () => {
      const onFinish = jest.fn();
      formInstance.setFieldValue("username", "john");

      await formInstance.submit(onFinish, undefined);
      expect(onFinish).toHaveBeenCalledWith({ username: "john" });
    });

    it("behavior: calls onFinishFailed when validation fails", async () => {
      const onFinishFailed = jest.fn();
      formStore.registerField("username");
      formStore.setRules("username", [{ type: "required" }]);

      await formInstance.submit(undefined, onFinishFailed);
      expect(onFinishFailed).toHaveBeenCalled();
    });
  });

  describe("subscription", () => {
    it("behavior: subscribe adds listener", () => {
      const listener = jest.fn();
      formStore.subscribe(listener);

      formInstance.setFieldValue("test", "value");
      expect(listener).toHaveBeenCalled();
    });

    it("behavior: unsubscribe removes listener", () => {
      const listener = jest.fn();
      const unsubscribe = formStore.subscribe(listener);

      unsubscribe();
      listener.mockClear();

      formInstance.setFieldValue("test", "value");
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
