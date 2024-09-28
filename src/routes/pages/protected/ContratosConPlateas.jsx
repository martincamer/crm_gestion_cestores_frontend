import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaList, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useContratosContext } from "../../../context/ContratosContext";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { toast } from "react-toastify";
import { useObtenerId } from "../../../helpers/useObtenerId";
import io from "socket.io-client";
import client from "../../../api/axios";

export const ContratosConPlateas = () => {
  const { contratos, sucursales } = useContratosContext();
  const { idObtenida, handleObtenerId } = useObtenerId();

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
      return {
        mensaje: "Falta para que venza la platea",
        clase: "bg-green-500",
      };
    } else if (fechaDiasHabiles === fechaActual) {
      return { mensaje: "Hoy es la fecha límite", clase: "bg-yellow-500" };
    } else {
      return { mensaje: "Vencio la platea", clase: "bg-red-500" };
    }
  };

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedSucursal, setSelectedSucursal] = useState(""); // Estado para almacenar la sucursal seleccionada
  const [selectedTipoPlan, setSelectedTipoPlan] = useState(""); // Estado para almacenar el
  const [selectedEstado, setSelectedEstado] = useState(""); // Estado para almacenar el

  const handleSearchClienteChange = (e) => {
    setSearchTermCliente(e.target.value);
  };

  const handleSucursalChange = (e) => {
    setSelectedSucursal(e.target.value);
  };

  const handleTipoPlanChange = (e) => {
    setSelectedTipoPlan(e.target.value);
  };

  const handleEstadoChange = (e) => {
    setSelectedEstado(e.target.value);
  };

  // Filtrar por término de búsqueda, sucursal seleccionada y tipo de plan seleccionado
  let filteredData = contratos.filter((contrato) => {
    const matchesSearchTerm =
      contrato.nombre_apellido
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase()) ||
      contrato.numero_contrato
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase());

    const matchesSucursal =
      selectedSucursal === "" || contrato.sucursal === selectedSucursal;

    const matchesTipoPlan =
      selectedTipoPlan === "" || contrato.tipo_plan === selectedTipoPlan;

    const matchesTipoEstado =
      selectedEstado === "" || contrato.estado === selectedEstado;

    return (
      matchesSearchTerm &&
      matchesSucursal &&
      matchesTipoPlan &&
      matchesTipoEstado
    );
  });

  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">Contratos con plateas</p>
      </div>
      <div className="bg-white w-full min-h-screen max-w-full h-full px-10 py-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <select
              value={selectedTipoPlan}
              onChange={handleTipoPlanChange}
              className="border border-gray-300 rounded-md py-2 px-2 w-auto text-sm font-semibold focus:border-blue-600 cursor-pointer outline-none"
            >
              <option value="" className="font-bold text-blue-600">
                Todos los tipos
              </option>
              <option className="font-semibold">Contado</option>
              <option value={"anticipo + cuotas"} className="font-semibold">
                Anticipo + Cuotas
              </option>
              <option value={"contado diferido"} className="font-semibold">
                Contado diferido
              </option>
              <option value={"todo financiado"} className="font-semibold">
                Todo financiado
              </option>
            </select>
          </div>

          <div className="flex gap-5 items-center">
            <div className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium flex items-center hover:border-blue-600">
              <FaSearch className="text-gray-400" />
              <input
                value={searchTermCliente}
                onChange={handleSearchClienteChange}
                className="text-sm outline-none w-full px-2"
              />
            </div>
            <div>
              <select
                className="border border-gray-300 px-2 py-1.5 rounded-md text-sm font-medium flex items-center hover:border-blue-600 outline-none"
                value={selectedSucursal}
                onChange={handleSucursalChange}
              >
                <option value="">Todas las sucursales</option>
                {sucursales.map((suc) => (
                  <option key={suc.nombre} value={suc.nombre}>
                    {suc.nombre}
                  </option>
                ))}
              </select>
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
                <th>Fecha de firma</th>
                <th>Fecha de cancelación primero</th>
                <th>Fecha de vencimiento platea</th>
                <th>Estado del plazo</th>
                <th>Tipo plan</th>
                <th>Observaciónes</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            {/* {"fecha_de_firma":"2024-07-16","fecha_de_cancelacion__primero":"2024-07-09","fecha_vencimiento_platea":"2024-07-31","observaciones_con_plateas":"asdasdasdasd"} */}
            <tbody className="text-xs font-medium capitalize">
              {filteredData.map((contrato) => {
                contratos.sort((a, b) => b.id - a.id);
                return (
                  contrato.estado === "en sección con platea" && (
                    <tr key={contrato.id}>
                      <th>{contrato.id}</th>
                      <td>{contrato.nombre_apellido}</td>
                      <td>{contrato.numero_contrato}</td>
                      <td>{contrato.sucursal}</td>

                      <td>
                        {contrato?.datos
                          ? JSON.parse(contrato.datos).fecha_de_firma
                          : "-"}
                      </td>
                      <td>
                        {contrato?.datos
                          ? JSON.parse(contrato.datos)
                              .fecha_de_cancelacion__primero
                          : "-"}
                      </td>
                      <td>
                        {contrato?.datos
                          ? JSON.parse(contrato.datos).fecha_vencimiento_platea
                          : "-"}
                      </td>
                      <td>
                        {contrato.datos ? (
                          <td
                            className={`${
                              obtenerMensajeYClaseFecha(
                                JSON.parse(contrato.datos)
                                  .fecha_vencimiento_platea
                              ).clase
                            } py-1 px-2 rounded text-white font-semibold`}
                          >
                            {
                              obtenerMensajeYClaseFecha(
                                JSON.parse(contrato.datos)
                                  .fecha_vencimiento_platea
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
                          ? JSON.parse(contrato.datos).observaciones_con_plateas
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
                            className="dropdown-content  menu bg-base-100 rounded-md z-[1] w-52 p-1 gap-1 drop-shadow-xl"
                          >
                            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                              <button
                                onClick={() => {
                                  handleObtenerId(contrato.id);
                                }}
                              >
                                Enviar a informes
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
      <ConvertirGarantiaPlatea idObtenida={idObtenida} />
    </section>
  );
};

const ConvertirGarantiaPlatea = ({ idObtenida }) => {
  const { register, handleSubmit, reset } = useForm();

  const navigate = useNavigate();

  const { setContratos } = useContratosContext();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.put(
        `/contratos-con-plateas/${idObtenida}/datos`,
        ordenData
      );

      setContratos(res.data.todosLosContratos);

      console.log(res.data);

      toast.success("¡Garantia traspasada correctamente!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
          padding: "12px",
        },
      });

      document.getElementById("my_modal_convertir_con_platea").close();

      reset();

      setTimeout(() => {
        navigate("/contratos-a-garantizar");
      }, 1000);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_convertir_con_platea" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Pasar contrato a garantias pero con platea.
        </h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras pasar el contrato con garantias a la seccion
          con plateas.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Fechas y observaciónes
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Fecha de firma</label>
              <input
                type="date"
                {...register("fecha_de_firma")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">
                Fecha de cancelación 1er 50%
              </label>
              <input
                type="date"
                {...register("fecha_de_cancelacion__primero")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">
                Vencimiento para la platea
              </label>
              <input
                type="date"
                {...register("fecha_vencimiento_platea")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Observaciones</label>
              <textarea
                {...register("observaciones_con_plateas")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
              Guardar en la sección con platea.
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
