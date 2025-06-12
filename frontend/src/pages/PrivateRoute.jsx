import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { setShowLogin } = useContext(AppContext);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setShowLogin(true);
      navigate("/");
      toast.error("Login required");
    }
  }, []);

  if (!localStorage.getItem("token")) {
    return null;
  }

  return children;
};

export default PrivateRoute;
