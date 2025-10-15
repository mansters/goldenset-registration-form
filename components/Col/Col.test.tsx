/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Col from "./index";
import Row from "../Row/index";
import { testComponentStyleWithSelector, testPropToClassName, testComponentStyle } from "../__tests__/testUtils";

describe("Component/Col", () => {
  it("check props: default span value", () => {
    testPropToClassName(<Col />, "col-24");
  });

  it("check props: spans", () => {
    for (let span = 1; span <= 24; span++) {
      testPropToClassName(<Col span={span} />, `col-${span}`);
    }
  });

  it("check props: custom className", () => {
    const cls = `custom-class-${Math.floor(Math.random() * 10000)}`;
    testPropToClassName(<Col className={cls} />, cls);
  });

  it("check props: gutter", () => {
    const instance = (
      <Row gutter={16}>
        <Col span={12} />
      </Row>
    );

    testComponentStyle(instance, { marginLeft: "-8px", marginRight: "-8px" });
    testComponentStyleWithSelector(instance, ".col-12", { paddingLeft: "8px", paddingRight: "8px" });
  });

  it("check props: array gutter", () => {
    const instance = (
      <Row gutter={[24, 16]}>
        <Col span={12} />
      </Row>
    );

    testComponentStyle(instance, { marginLeft: "-12px", marginRight: "-12px" });
    testComponentStyleWithSelector(instance, ".col-12", { paddingLeft: "12px", paddingRight: "12px", paddingTop: "8px", paddingBottom: "8px" });
  });

  it("check props: gutter = 0", () => {
    const { container } = render(
      <Row gutter={0}>
        <Col span={12}>Content</Col>
      </Row>
    );

    const row = container.firstChild as HTMLElement;
    expect(row).not.toHaveStyle({ marginLeft: "0px" });

    const col = container.querySelector(".col-12") as HTMLElement;
    expect(col).not.toHaveStyle({ paddingLeft: "0px" });
  });

  it("check multiple cols", () => {
    const { container } = render(
      <Row gutter={16}>
        <Col span={8}>Col 1</Col>
        <Col span={8}>Col 2</Col>
        <Col span={8}>Col 3</Col>
      </Row>
    );
    const cols = container.querySelectorAll(".col-8");
    expect(cols).toHaveLength(3);

    cols.forEach((col) => {
      expect(col).toHaveStyle({
        paddingLeft: "8px",
        paddingRight: "8px",
      });
    });
  });
});
