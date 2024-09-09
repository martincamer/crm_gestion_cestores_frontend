import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

export const Navbar = () => {
  const { user, signout } = useAuth();
  return (
    <nav className="bg-gray-700 py-5 px-5 flex items-center justify-between">
      <div className="flex gap-3 items-center">
        <Link
          to={"/"}
          className="font-bold text-white flex gap-2 items-center mr-6 px-4"
        >
          <img src="https://app.holded.com/assets/img/brand/holded-logo.svg" />{" "}
          Prisma crm.
        </Link>
        {user.sector === "garantias" && (
          <>
            <div className="dropdown dropdown-hover">
              <button
                tabIndex={0}
                role="button"
                className="text-white font-semibold hover:bg-gray-600 py-2 px-2 text-sm rounded-md transition-all"
              >
                Sector Garantias
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-md z-[1] w-56 p-1 gap-1 shadow-md"
              >
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/contratos-a-garantizar"}>
                    Contratos para garantizar
                  </Link>
                </li>
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/contratos-sin-plateas"}>
                    Contratos sin plateas
                  </Link>
                </li>
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/contratos-con-plateas"}>
                    Contratos con plateas
                  </Link>
                </li>
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/contratos-en-informes"}>
                    Garantias en informes,final
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <Link
                to={"/contratos-garantias"}
                className="text-white font-semibold hover:bg-gray-600 py-2 px-2 text-sm rounded-md transition-all"
              >
                Cargar Contratos/Clientes
              </Link>
            </div>
          </>
        )}

        {user.sector === "proveedores" && (
          <>
            <div className="dropdown dropdown-hover">
              <button
                tabIndex={0}
                role="button"
                className="text-white font-semibold hover:bg-gray-600 py-2 px-2 text-sm rounded-md transition-all"
              >
                Sector proveedores
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-md z-[1] w-56 p-1 gap-1 shadow-md"
              >
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/proveedores"}>Proveedores</Link>
                </li>
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/comprobantes"}>Comprobantes</Link>
                </li>{" "}
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/ordenes"}>Ordenes de compra</Link>
                </li>
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/productos"}>Productos</Link>
                </li>
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/presupuestos"}>Presupuestos</Link>
                </li>
              </ul>
            </div>
          </>
        )}

        {user.sector === "caja" && (
          <>
            <div className="dropdown dropdown-hover">
              <button
                tabIndex={0}
                role="button"
                className="text-white font-semibold hover:bg-gray-600 py-2 px-2 text-sm rounded-md transition-all"
              >
                Sector control de cajas
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-md z-[1] w-56 p-1 gap-1 shadow-md"
              >
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/sucursales-cajas"}>Sucursales cajas</Link>
                </li>{" "}
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/cajas"}>Subir nuevas cajas</Link>
                </li>
              </ul>
            </div>
          </>
        )}

        {user.sector === "carga" && (
          <>
            <div className="dropdown dropdown-hover">
              <button
                tabIndex={0}
                role="button"
                className="text-white font-semibold hover:bg-gray-600 py-2 px-2 text-sm rounded-md transition-all"
              >
                Sector de carga, registros
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-md z-[1] w-56 p-1 gap-1 shadow-md"
              >
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/sector-cargas"}>Sector de carga</Link>
                </li>{" "}
              </ul>
            </div>
          </>
        )}

        {user.sector === "control-garita" && (
          <>
            <div className="dropdown dropdown-hover">
              <button
                tabIndex={0}
                role="button"
                className="text-white font-semibold hover:bg-gray-600 py-2 px-2 text-sm rounded-md transition-all"
              >
                Sector de salidas
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-md z-[1] w-56 p-1 gap-1 shadow-md"
              >
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/sector-garita"}>Cargar nuevas salidas</Link>
                </li>{" "}
              </ul>
            </div>
          </>
        )}

        {user.sector === "informes" && (
          <>
            <div className="dropdown dropdown-hover">
              <button
                tabIndex={0}
                role="button"
                className="text-white font-semibold hover:bg-gray-600 py-2 px-2 text-sm rounded-md transition-all"
              >
                Sector de informes
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-md z-[1] w-56 p-1 gap-1 shadow-md"
              >
                <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                  <Link to={"/informes"}>Cargar nuevas entregas</Link>
                </li>{" "}
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <div className="dropdown dropdown-bottom dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="bg-sky-400 py-5 px-5 rounded-full cursor-pointer"
          ></div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-white shadow-xl rounded-md z-[1] w-52 p-2 mt-1"
          >
            <li className="text-sm font-semibold hover:bg-gray-50 rounded-md text-gray-500">
              <Link to={"/perfil"}>
                <FaUser />
                Perfil
              </Link>
            </li>
            <li className="text-sm font-semibold hover:bg-gray-50 rounded-md text-gray-500">
              <Link onClick={() => signout()} to={"/perfil"}>
                <IoLogOut className="text-xl" />
                Cerrar la cuenta
              </Link>
            </li>
          </ul>
        </div>
        <div className="fle flex-col">
          {" "}
          <p className="text-white text-xs font-semibold rounded-md">
            {user.username}
          </p>
          <p className="text-white text-xs font-semibold rounded-md">
            {user.email}
          </p>
        </div>
      </div>
    </nav>
  );
};
