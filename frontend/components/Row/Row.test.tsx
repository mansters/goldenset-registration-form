import "@testing-library/jest-dom";
import Row from "./index";
import { testPropToClassName } from "../__tests__/testUtils";
import { RowProps } from "./interface";

describe("Component/Row", () => {
  it("check default classes", () => {
    testPropToClassName(<Row />, ["row", "row-justify-start", "row-align-top"]);
  });

  it("props check -> custom className", () => {
    const cls = `custom-class-${Math.floor(Math.random() * 10000)}`;
    testPropToClassName(<Row className={cls} />, cls);
  });

  it("props classNames mapping check -> justify", () => {
    const justifyOptions: RowProps["justify"][] = ["start", "end", "center", "between", "around", "evenly"];

    justifyOptions.forEach((justify) => {
      testPropToClassName(<Row justify={justify} />, `row-justify-${justify}`);
    });
  });

  it("props classNames mapping check -> align", () => {
    const alignOptions: RowProps["align"][] = ["top", "middle", "bottom", "stretch"];

    alignOptions.forEach((align) => {
      testPropToClassName(<Row align={align} />, `row-align-${align}`);
    });
  });
});
