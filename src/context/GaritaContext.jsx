//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const GaritaContext = createContext();

//use context
export const useCargasContext = () => {
  const context = useContext(GaritaContext);
  if (!context) {
    throw new Error("error context");
  }
  return context;
};

// ProveedoresProvider component
export const GaritaProvider = ({ children }) => {
  const [garitas, setGaritas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await client.get("/garitas");
        setGaritas(respuesta.data);
      } catch (error) {
        console.error("Error fetching proveedores data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <GaritaContext.Provider value={{ garitas, setGaritas }}>
      {children}
    </GaritaContext.Provider>
  );
};
