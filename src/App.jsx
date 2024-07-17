import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { Login } from "./routes/pages/Login";
import { Register } from "./routes/pages/Register";
import { Home } from "./routes/pages/protected/Home";
import { ContratosProvider } from "./context/ContratosContext";
import { useEffect, useState } from "react";
import { Navbar } from "./components/ui/Navbar";
import { ContratosGarantias } from "./routes/pages/protected/ContratosGarantias";
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";
import { ContratosPorGarantizar } from "./routes/pages/protected/ContratosPorGarantizar";
import { ToastContainer } from "react-toastify";
import { ContratosConPlateas } from "./routes/pages/protected/ContratosConPlateas";
import { ContratosSinPlateas } from "./routes/pages/protected/ContratosSinPlateas";

function App() {
  const { isAuth } = useAuth();

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
                  <Navbar />
                  <main className="min-h-full max-h-full h-full flex">
                    <Outlet />
                  </main>
                </ContratosProvider>
              }
            >
              <Route index path="/" element={<Home />} />
              <Route
                index
                path="/contratos-garantias"
                element={<ContratosGarantias />}
              />
              <Route
                index
                path="/contratos-a-garantizar"
                element={<ContratosPorGarantizar />}
              />{" "}
              <Route
                index
                path="/contratos-con-plateas"
                element={<ContratosConPlateas />}
              />
              <Route
                index
                path="/contratos-sin-plateas"
                element={<ContratosSinPlateas />}
              />
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
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-orange-500 border-b-transparent"></div>
        <p className="mt-4 text-lg font-bold text-gray-700">Cargando...</p>
      </div>
    </div>
  );
};
