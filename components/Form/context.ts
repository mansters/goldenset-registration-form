"use client";
import React from "react";
import { FormInstance } from "./interface";
import FormStore from "./FormStore";
import { FormSharedConfig } from "../FormItem/interface";

const FormContext = {
  Store: React.createContext<FormInstance>(new FormStore().getForm()),
  Internal: React.createContext<FormSharedConfig>({}),
};

export default FormContext;
