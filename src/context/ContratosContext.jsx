//imports
import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/axios";

//context
export const ContratosContext = createContext();

//use context
export const useContratosContext = () => {
  const context = useContext(ContratosContext);
  if (!context) {
    throw new Error("error context");
  }
  return context;
};

// ProveedoresProvider component
export const ContratosProvider = ({ children }) => {
  const [contratos, setContratos] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await client.get("/contratos");
        setContratos(respuesta.data);
      } catch (error) {
        console.error("Error fetching proveedores data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const respuesta = await client.get("/sucursal");
        setSucursales(respuesta.data);
      } catch (error) {
        console.error("Error fetching proveedores data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <ContratosContext.Provider
      value={{ contratos, setContratos, sucursales, setSucursales }}
    >
      {children}
    </ContratosContext.Provider>
  );
};
