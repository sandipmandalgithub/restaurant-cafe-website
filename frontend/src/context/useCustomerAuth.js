import { useContext } from "react";

import CustomerAuthContext from "./CustomerAuthContext";

const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);

  if (!context) {
    throw new Error(
      "useCustomerAuth must be used inside CustomerAuthProvider."
    );
  }

  return context;
};

export default useCustomerAuth;