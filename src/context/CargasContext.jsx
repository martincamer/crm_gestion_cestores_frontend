//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const CargasContext = createContext();

//use context
export const useCargasContext = () => {
  const context = useContext(CargasContext);
  if (!context) {
    throw new Error("error context");
  }
  return context;
};

// ProveedoresProvider component
export const CargasProvider = ({ children }) => {
  const [cargas, setCargas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await client.get("/cargas");
        setCargas(respuesta.data);
      } catch (error) {
        console.error("Error fetching proveedores data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <CargasContext.Provider value={{ cargas, setCargas }}>
      {children}
    </CargasContext.Provider>
  );
};
