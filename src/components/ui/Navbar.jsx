import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-gray-700 py-5 px-5">
      <div className="flex gap-3 items-center">
        <Link
          to={"/"}
          className="font-bold text-white flex gap-2 items-center mr-6 px-4"
        >
          <img src="https://app.holded.com/assets/img/brand/holded-logo.svg" />{" "}
          Prisma crm.
        </Link>
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
              <Link to={"/contratos-sin-plateas"}>Contratos sin plateas</Link>
            </li>
            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
              <Link to={"/contratos-con-plateas"}>Contratos con plateas</Link>
            </li>
            {/* <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
              <Link to={"/contratos-vencidos"}>Vencidos</Link>
            </li> */}
            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
              <Link to={"/contratos-vencidos"}>Garantias en informes</Link>
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
      </div>
    </nav>
  );
};
