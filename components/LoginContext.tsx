"use client";

import { createContext, useContext } from "react";

export const LoginContext = createContext<{ openLogin: () => void }>({
  openLogin: () => {},
});

export const useLogin = () => useContext(LoginContext);
