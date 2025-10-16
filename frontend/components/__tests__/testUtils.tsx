import { render } from "@testing-library/react";
import { ReactElement } from "react";

/**
 * checking prop className mappings
 */
export function testPropToClassName(component: ReactElement, expectedClassNames: string | string[]) {
  const { container } = render(component);
  const element = container.firstChild as HTMLElement;

  const classNames = Array.isArray(expectedClassNames) ? expectedClassNames : [expectedClassNames];
  classNames.forEach((className) => {
    expect(element).toHaveClass(className);
  });
}

/**
 * checking prop className mapping with querySelector
 */
export function testPropToClassNameWithSelector(component: ReactElement, selector: string, expectedClassNames: string | string[]) {
  const { container } = render(component);
  const element = container.querySelector(selector) as HTMLElement;

  expect(element).toBeInTheDocument();

  const classNames = Array.isArray(expectedClassNames) ? expectedClassNames : [expectedClassNames];
  classNames.forEach((className) => {
    expect(element).toHaveClass(className);
  });
}

/**
 * checking component styles
 */
export function testComponentStyle(component: ReactElement, expectedStyles: Record<string, string>) {
  const { container } = render(component);
  const element = container.firstChild as HTMLElement;
  expect(element).toHaveStyle(expectedStyles);
}

/**
 * checking component styles with selector
 */
export function testComponentStyleWithSelector(component: ReactElement, selector: string, expectedStyles: Record<string, string>) {
  const { container } = render(component);
  const element = container.querySelector(selector) as HTMLElement;
  expect(element).toHaveStyle(expectedStyles);
}
