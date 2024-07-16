import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaList, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useContratosContext } from "../../../context/ContratosContext";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { toast } from "react-toastify";
import io from "socket.io-client";
import client from "../../../api/axios";
import { useObtenerId } from "../../../helpers/useObtenerId";

export const ContratosPorGarantizar = () => {
  const { contratos } = useContratosContext();

  // Función para obtener la fecha actual formateada como YYYY-MM-DD
  const obtenerFechaActual = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const obtenerMensajeYClaseFecha = (fechaDiasHabiles) => {
    const fechaActual = obtenerFechaActual();
    if (!fechaDiasHabiles) {
      return { mensaje: "-", clase: "" };
    }

    if (fechaDiasHabiles > fechaActual) {
      return { mensaje: "Falta para que sea vencido", clase: "bg-green-500" };
    } else if (fechaDiasHabiles === fechaActual) {
      return { mensaje: "Hoy es la fecha límite", clase: "bg-yellow-500" };
    } else {
      return { mensaje: "Vencido", clase: "bg-red-500" };
    }
  };

  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">Contratos para garantizar</p>
        {/* <div>
          <button
            onClick={() =>
              document.getElementById("my_modal_contrato").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-blue-600 text-white py-2 rounded-md px-2 hover:bg-blue-700 transition-all"
          >
            Convertir contratos garantizados
            <FaChevronDown />
          </button>
        </div> */}
      </div>
      <div className="bg-white w-full min-h-screen max-w-full h-full px-10 py-10">
        <div className="flex justify-between items-center">
          <select className="border border-gray-300 rounded-md py-2 px-2 w-1/12 text-sm font-semibold focus:border-blue-600 cursor-pointer outline-none">
            <option className="font-bold text-xs text-blue-600">Todos</option>
            <option className="text-xs font-semibold">Garantizados</option>
            <option className="text-xs font-semibold">Vencidos</option>
            <option className="text-xs font-semibold">En platea</option>
            <option className="text-xs font-semibold">Contados</option>
            <option className="text-xs font-semibold">Cuotas</option>
          </select>

          <div className="flex gap-5 items-center">
            <div className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium flex items-center hover:border-blue-600">
              <FaSearch className="text-gray-400" />
              <input className="text-sm outline-none w-full px-2" />
            </div>
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                role="button"
                className="px-4 py-1 text-gray-500 border border-gray-300 rounded-md text-sm font-medium"
              >
                Filtros
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu border border-gray-300 mt-2 rounded z-10 bg-white w-60 p-3"
              >
                <div className="border-b pb-3 border-gray-300">
                  <p className="font-bold text-blue-500">
                    Filtrar por fechas de contratos
                  </p>
                  <div className="flex flex-col gap-1">
                    <input
                      type="date"
                      className="border border-gray-300 py-1 px-2 rounded-md text-xs font-semibold mt-1 outline-none focus:border-blue-600"
                    />{" "}
                    <input
                      type="date"
                      className="border border-gray-300 py-1 px-2 rounded-md text-xs font-semibold mt-1 outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="text-xs font-semibold bg-gray-700 text-white rounded-md py-1 px-2">
                    Año actual
                  </button>
                  <button className="text-xs font-semibold bg-gray-700 text-white rounded-md py-1 px-2">
                    Año anterior
                  </button>
                </div>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 z-0">
          <table className="table">
            <thead>
              <tr className="font-extrabold text-sm text-black">
                <th>Referencia</th>
                <th>Cliente</th>
                <th>N° Contrato</th>
                <th>Sucursal</th>
                <th>Fecha de cancelación anticipo</th>
                <th>Fecha de email garantias</th>
                <th>Plazo de días</th>
                <th>Estado del plazo</th>
                <th>Tipo plan</th>
                <th>Observaciónes</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium capitalize">
              {contratos.map((contrato) => {
                contratos.sort((a, b) => b.id - a.id);
                return (
                  contrato.estado === "por garantizar" && (
                    <tr key={contrato.id}>
                      <th>{contrato.id}</th>
                      <td>{contrato.nombre_apellido}</td>
                      <td>{contrato.numero_contrato}</td>
                      <td>{contrato.sucursal}</td>

                      <td>
                        {contrato?.datos
                          ? JSON.parse(contrato.datos)
                              .fecha_cancelacion_anticipo
                          : "-"}
                      </td>
                      <td>
                        {contrato?.datos
                          ? JSON.parse(contrato.datos).fecha_email_garantias
                          : "-"}
                      </td>
                      <td>
                        {contrato?.datos
                          ? JSON.parse(contrato.datos).fecha_dias_habiles
                          : "-"}
                      </td>
                      <td>
                        {contrato.datos ? (
                          <td
                            className={`${
                              obtenerMensajeYClaseFecha(
                                JSON.parse(contrato.datos).fecha_dias_habiles
                              ).clase
                            } py-1 px-2 rounded text-white font-semibold`}
                          >
                            {
                              obtenerMensajeYClaseFecha(
                                JSON.parse(contrato.datos).fecha_dias_habiles
                              ).mensaje
                            }
                          </td>
                        ) : (
                          <td className="text-center">-</td>
                        )}
                      </td>
                      <td>
                        <div className="flex">
                          <p className="bg-rose-500 py-1 px-2 text-white rounded font-semibold">
                            {contrato.tipo_plan}
                          </p>
                        </div>
                      </td>
                      <td>
                        {contrato?.datos
                          ? JSON.parse(contrato.datos).observación
                          : "-"}
                      </td>

                      <td>
                        <div className="flex">
                          <p className="bg-blue-600 py-1 px-2 rounded text-white font-semibold">
                            {contrato.estado}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="dropdown dropdown-end">
                          <button
                            tabIndex={0}
                            role="button"
                            className="font-semibold hover:bg-gray-600 py-2 px-2 text-sm transition-all hover:text-white rounded-full"
                          >
                            <FaList />
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content  menu bg-base-100 rounded-md z-[1] w-52 p-1 gap-1 border border-gray-300"
                          >
                            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                              <button
                                onClick={() => {
                                  handleObtenerId(contrato.id);
                                }}
                              >
                                Enviar a sin plateas
                              </button>
                            </li>
                            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                              <button
                                onClick={() => {
                                  handleObtenerId(contrato.id);
                                }}
                              >
                                Enviar a con plateas
                              </button>
                            </li>
                            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                              <button
                                onClick={() => {
                                  handleObtenerId(contrato.id);
                                }}
                              >
                                Editar la garantia
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
