"use client";
import { useRef } from "react";
import FormStore from "./FormStore";
import { FormInstance } from "./interface";

const useForm = <FormValues = any>(form?: FormInstance<FormValues>): [FormInstance<FormValues>] => {
  const formRef = useRef<FormInstance>();
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore = new FormStore();
      formRef!.current = formStore.getForm();
    }
  }
  return [formRef.current];
};

export default useForm;
