import { validateRule } from "./validators";
import { ValidationRule } from "../FormItem/interface";

describe("Component/Form/validators", () => {
  describe("required validation", () => {
    it("behavior: rejects empty string", async () => {
      const rule: ValidationRule = { type: "required" };
      await expect(validateRule(rule, "")).rejects.toBe("This field is required");
    });

    it("behavior: rejects null", async () => {
      const rule: ValidationRule = { type: "required" };
      await expect(validateRule(rule, null)).rejects.toBe("This field is required");
    });

    it("behavior: rejects undefined", async () => {
      const rule: ValidationRule = { type: "required" };
      await expect(validateRule(rule, undefined)).rejects.toBe("This field is required");
    });

    it("behavior: rejects empty array", async () => {
      const rule: ValidationRule = { type: "required" };
      await expect(validateRule(rule, [])).rejects.toBe("This field is required");
    });

    it("behavior: accepts non-empty value", async () => {
      const rule: ValidationRule = { type: "required" };
      await expect(validateRule(rule, "test")).resolves.toBeUndefined();
    });

    it("props check: custom message", async () => {
      const rule: ValidationRule = { type: "required", message: "Custom error" };
      await expect(validateRule(rule, "")).rejects.toBe("Custom error");
    });
  });

  describe("pattern validation", () => {
    it("behavior: accepts matching pattern", async () => {
      const rule: ValidationRule = { type: "pattern", pattern: /^\d+$/ };
      await expect(validateRule(rule, "123")).resolves.toBeUndefined();
    });

    it("behavior: rejects non-matching pattern", async () => {
      const rule: ValidationRule = { type: "pattern", pattern: /^\d+$/ };
      await expect(validateRule(rule, "abc")).rejects.toBe("Invalid format");
    });

    it("behavior: skips validation for empty value", async () => {
      const rule: ValidationRule = { type: "pattern", pattern: /^\d+$/ };
      await expect(validateRule(rule, "")).resolves.toBeUndefined();
    });

    it("props check: custom message", async () => {
      const rule: ValidationRule = { type: "pattern", pattern: /^\d+$/, message: "Must be digits" };
      await expect(validateRule(rule, "abc")).rejects.toBe("Must be digits");
    });

    it("behavior: handles no pattern provided", async () => {
      const rule: ValidationRule = { type: "pattern" };
      await expect(validateRule(rule, "abc")).resolves.toBeUndefined();
    });
  });

  describe("custom validator", () => {
    it("behavior: calls validator function", async () => {
      const validator = jest.fn().mockResolvedValue(undefined);
      const rule: ValidationRule = { type: "validator", validator };

      await validateRule(rule, "test");
      expect(validator).toHaveBeenCalledWith("test");
    });

    it("behavior: accepts when validator resolves", async () => {
      const rule: ValidationRule = {
        type: "validator",
        validator: async () => Promise.resolve(),
      };
      await expect(validateRule(rule, "test")).resolves.toBeUndefined();
    });

    it("behavior: rejects when validator rejects", async () => {
      const rule: ValidationRule = {
        type: "validator",
        validator: async () => Promise.reject("Custom validation failed"),
      };
      await expect(validateRule(rule, "test")).rejects.toBe("Custom validation failed");
    });

    it("behavior: handles no validator provided", async () => {
      const rule: ValidationRule = { type: "validator" };
      await expect(validateRule(rule, "test")).resolves.toBeUndefined();
    });
  });
});
