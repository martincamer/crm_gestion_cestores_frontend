//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const InformesContext = createContext();

//use context
export const useInformesContext = () => {
  const context = useContext(InformesContext);
  if (!context) {
    throw new Error("error context");
  }
  return context;
};

// ProveedoresProvider component
export const InformesProvider = ({ children }) => {
  const [informes, setInformes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await client.get("/informes");
        setInformes(respuesta.data);
      } catch (error) {
        console.error("Error fetching proveedores data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <InformesContext.Provider value={{ informes, setInformes }}>
      {children}
    </InformesContext.Provider>
  );
};
