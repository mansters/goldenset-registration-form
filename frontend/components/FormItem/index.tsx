"use client";

import React, { useContext, useEffect, useCallback, useMemo } from "react";
import classnames from "classnames";
import { FormItemProps } from "./interface";
import FormContext from "../Form/context";
import Row from "../Row";
import Col from "../Col";
import "./style.css";

const FormItem: React.FC<FormItemProps> = ({ children, label, name, rules = [], layout: itemLayout, labelCol: itemLabelCol, wrapperCol: itemWrapperCol, classNames }) => {
  const form = useContext(FormContext.Store);
  const config = useContext(FormContext.Internal);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const layout = itemLayout || config.layout;
  const labelCol = itemLabelCol || config.labelCol || { span: 6 };
  const wrapperCol = itemWrapperCol || config.wrapperCol || { span: 18 };

  useEffect(() => {
    if (form?.__register && name) {
      const unsubscribe = form.__register(name, rules, forceUpdate);
      return unsubscribe;
    }
  }, []);

  if (!name) {
    if (layout === "vertical") {
      return (
        <div className={classnames("form-item form-item-vertical", classNames)}>
          <div className="form-item-label">{label}</div>
          <div className="form-item-control">{children}</div>
        </div>
      );
    }

    return (
      <div className={classnames("form-item form-item-horizontal", classNames)}>
        <Row>
          <Col span={labelCol.span}>
            <div className="form-item-label">{label}</div>
          </Col>
          <Col span={wrapperCol.span}>
            <div className="form-item-control">{children}</div>
          </Col>
        </Row>
      </div>
    );
  }

  const value = form.getFieldValue(name) || undefined;
  const errors = form.getFieldError(name) || [];
  const touched = form.isFieldTouched(name) || false;
  const showError = touched && errors.length > 0;

  // check required for UI render
  const isRequired = useMemo(() => rules.some((rule) => rule.type === "required"), [rules]);

  const handleChange = useCallback(
    async (nextValue: any) => {
      if (name) {
        form.setFieldTouched(name, true);
        form.setFieldValue(name, nextValue);
        form.validateField(name);
      }
    },
    [name, form, rules]
  );

  // inject value/onChange
  const childNode = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        value,
        onChange: handleChange,
      })
    : children;

  if (layout === "vertical") {
    return (
      <div className={classnames("form-item", "form-item-vertical", classNames, { "form-item-has-error": showError })}>
        {label && (
          <div className="form-item-label">
            {isRequired && <span className="form-item-required">*</span>}
            {label}
          </div>
        )}
        <div className="form-item-control">
          {childNode}
          {showError && <div className="form-item-error">{errors.join("; ")}</div>}
        </div>
      </div>
    );
  }

  // Horizontal layout
  return (
    <div className={classnames("form-item", "form-item-horizontal", classNames, { "form-item-has-error": showError })}>
      <Row>
        {label && (
          <Col span={labelCol.span}>
            <div className="form-item-label">
              {isRequired && <span className="form-item-required">*</span>}
              {label}
            </div>
          </Col>
        )}
        <Col span={wrapperCol.span}>
          <div className="form-item-control">
            {childNode}
            {showError && <div className="form-item-error">{errors.join("; ")}</div>}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FormItem;
