import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";

export const MenuMobile = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOverlayClick = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`${
        isOpen ? "w-64 opacity-1" : "w-0 opacity-1"
      } transition-all ease-linear flex flex-col bg-white min-h-[220vh] max-h-full h-full z-[100] border-r max-md:fixed md:hidden`}
    >
      {/* Botón de menú */}
      <div className={`py-4 px-4 ${isOpen ? "flex justify-between " : ""}`}>
        <button className="text-3xl text-orange-500" onClick={handleToggle}>
          {isOpen ? <IoCloseOutline /> : <IoMenuOutline />}
        </button>
        {isOpen && (
          <p className="bg-orange-500 py-1 px-2 rounded-xl text-sm text-white capitalize">
            {user?.username}
          </p>
        )}
      </div>
      {isOpen && (
        <div className="w-full max-h-full min-h-full h-full flex flex-col gap-0">
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/"}
            className={`${
              location.pathname === "/" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Inicio/estadistica/compras
          </Link>

          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/salidas"}
            className={`${
              location.pathname === "/salidas" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3 max-md:hidden`}
          >
            Crear nuevas salidas/ver/editar
          </Link>
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/remuneraciones"}
            className={`${
              location.pathname === "/remuneraciones"
                ? "bg-orange-100"
                : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3 max-md:hidden`}
          >
            Crear nuevas remuneraciones/ver/editar
          </Link>
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/legales"}
            className={`${
              location.pathname === "/legales" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3 max-md:hidden`}
          >
            Crear nuevas ordenes legales/ver/editar
          </Link>
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/rendiciones"}
            className={`${
              location.pathname === "/rendiciones" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3 max-md:hidden`}
          >
            Crear nuevas rendiciones/editar/ver
          </Link>
          <Link
            onClick={() => setIsOpen(!isOpen)}
            to={"/estadistica"}
            className={`${
              location.pathname === "/estadistica" ? "bg-orange-100" : "bg-none"
            } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
          >
            Filtrar estadisticas del semanales/mensuales/anuales
          </Link>
          {user.localidad === "admin" && (
            <Link
              onClick={() => setIsOpen(!isOpen)}
              to={"/cuentas"}
              className={`${
                location.pathname === "/cuentas" ? "bg-orange-100" : "bg-none"
              } hover:text-orange-700 text-slate-700 text-sm transition-all py-3 px-3`}
            >
              Crear cuentas/editar/administrar
            </Link>
          )}
        </div>
      )}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/0 opacity-50 z-[-1]"
          onClick={handleOverlayClick}
        />
      )}
    </div>
  );
};
