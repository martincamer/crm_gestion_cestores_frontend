import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthProvider";
import { Login } from "./routes/pages/Login";
import { Register } from "./routes/pages/Register";
import { Home } from "./routes/pages/protected/Home";
import { ContratosProvider } from "./context/ContratosContext";
import { Navbar } from "./components/ui/Navbar";
import { ContratosGarantias } from "./routes/pages/protected/ContratosGarantias";
import { ContratosPorGarantizar } from "./routes/pages/protected/ContratosPorGarantizar";
import { ToastContainer } from "react-toastify";
import { ContratosConPlateas } from "./routes/pages/protected/ContratosConPlateas";
import { ContratosSinPlateas } from "./routes/pages/protected/ContratosSinPlateas";
import { ContratosEnInformes } from "./routes/pages/protected/ContratosEnInformes";
import { Perfil } from "./routes/pages/protected/Perfil";
import { ProveedoresProvider } from "./context/ProveedoresContext";
import { Proveedores } from "./routes/pages/protected/proveedores/Proveedores";
import { Comprobantes } from "./routes/pages/protected/proveedores/Comprobantes";
import { OrdenesCompra } from "./routes/pages/protected/proveedores/OrdenesCompra";
import { Cajas } from "./routes/pages/protected/Cajas";
import { CajasSucursales } from "./routes/pages/protected/CajasSucursales";
import { Cargas } from "./routes/pages/protected/Cargas";
import { CargasProvider } from "./context/CargasContext";
import { GaritaControl } from "./routes/pages/protected/GaritaControl";
import { GaritaProvider } from "./context/GaritaContext";
import { Informes } from "./routes/pages/protected/Informes";
import { InformesProvider } from "./context/InformesContext";
import { InformesFabrica } from "./routes/pages/protected/InformesFabrica";
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Productos } from "./routes/pages/protected/proveedores/Productos";
import { Revestimiento } from "./routes/pages/protected/Revestimiento";

function App() {
  const { isAuth, user } = useAuth();

  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Simula un tiempo de carga de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Desactiva la pantalla de carga después de 5 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpia el temporizador cuando se desmonta
  }, []);

  if (isLoading) {
    // Muestra la pantalla de carga mientras se está cargando
    return <LoadingScreen />;
  }

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route
            element={<RutaProtegida isAllowed={!isAuth} redirectTo={"/"} />}
          >
            <Route index path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route
            element={<RutaProtegida isAllowed={isAuth} redirectTo={"/login"} />}
          >
            <Route
              element={
                <ContratosProvider>
                  <ProveedoresProvider>
                    <CargasProvider>
                      <GaritaProvider>
                        <InformesProvider>
                          <Navbar />
                          <main className="min-h-full max-h-full h-full flex">
                            <Outlet />
                          </main>
                        </InformesProvider>
                      </GaritaProvider>
                    </CargasProvider>
                  </ProveedoresProvider>
                </ContratosProvider>
              }
            >
              <Route index path="/" element={<Home />} />
              {user?.sector === "garantias" && (
                <>
                  <Route
                    path="/contratos-garantias"
                    element={<ContratosGarantias />}
                  />
                  <Route
                    path="/contratos-a-garantizar"
                    element={<ContratosPorGarantizar />}
                  />{" "}
                  <Route
                    path="/contratos-con-plateas"
                    element={<ContratosConPlateas />}
                  />
                  <Route
                    path="/contratos-sin-plateas"
                    element={<ContratosSinPlateas />}
                  />{" "}
                  <Route
                    path="/contratos-en-informes"
                    element={<ContratosEnInformes />}
                  />
                </>
              )}
              {user?.sector === "revestimiento" && (
                <>
                  <Route
                    path="/area-revestimiento"
                    element={<Revestimiento />}
                  />
                </>
              )}
              {user?.sector === "proveedores" && (
                <>
                  <Route path="/proveedores" element={<Proveedores />} />
                  <Route path="/comprobantes" element={<Comprobantes />} />
                  <Route path="/ordenes" element={<OrdenesCompra />} />
                  <Route path="/productos" element={<Productos />} />
                </>
              )}
              {user?.sector === "caja" && (
                <>
                  <Route path="/cajas" element={<Cajas />} />
                  <Route
                    path="/sucursales-cajas"
                    element={<CajasSucursales />}
                  />
                </>
              )}{" "}
              {user?.sector === "carga" && (
                <>
                  <Route path="/sector-cargas" element={<Cargas />} />
                </>
              )}{" "}
              {user?.sector === "control-garita" && (
                <>
                  <Route path="/sector-garita" element={<GaritaControl />} />
                </>
              )}{" "}
              {user?.sector === "informes" && (
                <>
                  <Route path="/informes" element={<Informes />} />{" "}
                  <Route
                    path="/informes-fabrica/:id"
                    element={<InformesFabrica />}
                  />
                </>
              )}
              <Route index path="/perfil" element={<Perfil />} />
            </Route>
          </Route>
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-[#FD454D] border-b-transparent"></div>
        <p className="mt-4 text-lg font-bold text-gray-700">Cargando...</p>
      </div>
    </div>
  );
};
