//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const RevestimientoContext = createContext();

//use context
export const useRevestimientoContext = () => {
  const context = useContext(RevestimientoContext);
  if (!context) {
    throw new Error("error context");
  }
  return context;
};

// ProveedoresProvider component
export const RevestimientoProvider = ({ children }) => {
  const [revestimientos, setRevestimientos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await client.get("/revestimientos");
        setRevestimientos(respuesta.data);
      } catch (error) {
        console.error("Error fetching proveedores data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <RevestimientoContext.Provider
      value={{ revestimientos, setRevestimientos }}
    >
      {children}
    </RevestimientoContext.Provider>
  );
};
