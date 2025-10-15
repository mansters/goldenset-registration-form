import "@testing-library/jest-dom";
import Row from "./index";
import { testPropToClassName } from "../__tests__/testUtils";
import { RowProps } from "./interface";

describe("Component/Row", () => {
  it("check default classes", () => {
    testPropToClassName(<Row />, ["row", "row-justify-start", "row-align-top"]);
  });

  it("applies justify prop correctly", () => {
    testPropToClassName(<Row justify="center" />, "row-justify-center");
  });

  it("applies align prop correctly", () => {
    testPropToClassName(<Row align="middle" />, "row-align-middle");
  });

  it("check custom className", () => {
    const cls = `custom-class-${Math.floor(Math.random() * 10000)}`;
    testPropToClassName(<Row className={cls} />, cls);
  });

  it("check props: justify", () => {
    const justifyOptions: RowProps["justify"][] = ["start", "end", "center", "between", "around", "evenly"];

    justifyOptions.forEach((justify) => {
      testPropToClassName(<Row justify={justify} />, `row-justify-${justify}`);
    });
  });

  it("check props: align", () => {
    const alignOptions: RowProps["align"][] = ["top", "middle", "bottom", "stretch"];

    alignOptions.forEach((align) => {
      testPropToClassName(<Row align={align} />, `row-align-${align}`);
    });
  });
});
