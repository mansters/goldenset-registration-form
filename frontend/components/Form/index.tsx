"use client";

import React, { useCallback, useMemo } from "react";
import FormContext from "./context";
import useForm from "./useForm";
import type { FormProps } from "./interface";
import { FormSharedConfig } from "../FormItem/interface";

const Form: React.FC<FormProps> = (props) => {
  const { children, onFinish, onFinishFailed, form } = props;

  const [formInstance] = useForm(form);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      formInstance.submit(onFinish, onFinishFailed);
    },
    [formInstance]
  );

  const sharedConfig = useMemo<FormSharedConfig>(
    () => ({
      layout: props.layout || "vertical",
      labelCol: props.labelCol,
      wrapperCol: props.wrapperCol,
    }),
    [props.layout, props.labelCol, props.wrapperCol]
  );

  return (
    <FormContext.Store.Provider value={formInstance}>
      <FormContext.Internal.Provider value={sharedConfig}>
        <form onSubmit={handleSubmit}>{children}</form>
      </FormContext.Internal.Provider>
    </FormContext.Store.Provider>
  );
};

export default Form;
