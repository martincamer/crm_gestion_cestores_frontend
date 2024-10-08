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
      return { mensaje: "Falta para que sea vencido", clase: "bg-green-500" };
    } else if (fechaDiasHabiles === fechaActual) {
      return { mensaje: "Hoy es la fecha límite", clase: "bg-yellow-500" };
    } else {
      return { mensaje: "Vencido", clase: "bg-red-500" };
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
        <p className="font-bold text-xl">Contratos para garantizar</p>
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
              {filteredData.map((contrato) => {
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
                            className="dropdown-content  menu bg-base-100 rounded-md z-[1] w-52 p-1 gap-1 drop-shadow-xl"
                          >
                            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                              <button
                                onClick={() => {
                                  handleObtenerId(contrato.id),
                                    document
                                      .getElementById(
                                        "my_modal_convertir_sin_platea"
                                      )
                                      .showModal();
                                }}
                              >
                                Enviar a sin plateas
                              </button>
                            </li>
                            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                              <button
                                onClick={() => {
                                  handleObtenerId(contrato.id),
                                    document
                                      .getElementById(
                                        "my_modal_convertir_con_platea"
                                      )
                                      .showModal();
                                }}
                              >
                                Enviar a con plateas
                              </button>
                            </li>
                            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                              <button
                                onClick={() => {
                                  handleObtenerId(contrato.id),
                                    document
                                      .getElementById(
                                        "my_modal_convertir_en_garantia"
                                      )
                                      .showModal();
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
      <ConvertirGarantiaPlatea idObtenida={idObtenida} />
      <ConvertirGarantiaEnSinPlatea idObtenida={idObtenida} />
      <ConvertirEnGarantia idObtenida={idObtenida} />
    </section>
  );
};

const ConvertirEnGarantia = ({ idObtenida }) => {
  const { register, handleSubmit, setValue } = useForm();

  const { setContratos } = useContratosContext();

  useEffect(() => {
    const obtenerContrato = async () => {
      const res = await client.get(`/contratos/${idObtenida}`);
      const datos = JSON.parse(res.data.datos);

      setValue("fecha_cancelacion_anticipo", datos.fecha_cancelacion_anticipo);
      setValue("fecha_email_garantias", datos.fecha_email_garantias);
      setValue("fecha_dias_habiles", datos.fecha_dias_habiles);
      setValue("observación", datos.observación);
      console.log(res.data);
    };
    obtenerContrato();
  }, [idObtenida]);

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.put(`/contratos/${idObtenida}/datos`, ordenData);

      setContratos(res.data.todosLosContratos);

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

      document.getElementById("my_modal_convertir_en_garantia").close();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_convertir_en_garantia" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Actualizar la garantia {idObtenida}
        </h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras actualizar el la garantia.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Fechas y observación.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">
                Fecha cancelación anticipo
              </label>
              <input
                type="date"
                {...register("fecha_cancelacion_anticipo")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Email de garantias</label>
              <input
                type="date"
                {...register("fecha_email_garantias")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">
                Plazo de 15 días habiles
              </label>
              <input
                type="date"
                {...register("fecha_dias_habiles")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>{" "}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Observanción</label>
              <textarea
                {...register("observación")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
              Actualizar la garantia
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ConvertirGarantiaPlatea = ({ idObtenida }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();

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
        navigate("/contratos-con-plateas");
      }, 1000);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const [plazoDias, setPlazoDias] = useState(""); // Estado para almacenar el plazo de días seleccionado
  const fecha_vencimiento_plateas = watch("fecha_de_cancelacion__primero");

  const handleChangePlazoDiasNew = (e) => {
    const selectedPlazo = e.target.value;
    setPlazoDias(selectedPlazo);

    const hoy = new Date();
    const fechaDiasHabiles = new Date(fecha_vencimiento_plateas);

    if (selectedPlazo === "60") {
      fechaDiasHabiles.setDate(fechaDiasHabiles.getDate() + 15);
    } else if (selectedPlazo === "90") {
      fechaDiasHabiles.setDate(fechaDiasHabiles.getDate() + 30);
    } else if (selectedPlazo === "120") {
      fechaDiasHabiles.setDate(fechaDiasHabiles.getDate() + 120);
    } else if (selectedPlazo === "150") {
      fechaDiasHabiles.setDate(fechaDiasHabiles.getDate() + 150);
    }

    // Formatear la fecha para asignarla al campo fecha_dias_habiles
    const formattedFechaDiasHabiles = fechaDiasHabiles
      .toISOString()
      .split("T")[0];
    setValue("fecha_vencimiento_platea", formattedFechaDiasHabiles);
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
                Seleccionar plazo de días de 15 a ..
              </label>
              <select
                {...register("plazo_dias")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                onChange={handleChangePlazoDiasNew}
              >
                <option value="">Seleccionar plazo</option>
                <option value="60">60 días</option>
                <option value="90">90 días</option>
                <option value="120">120 días</option>
                <option value="150">150 días</option>
              </select>
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

const ConvertirGarantiaEnSinPlatea = ({ idObtenida }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm();

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
        `/contratos-sin-plateas/${idObtenida}/datos`,
        ordenData
      );

      setContratos(res.data.todosLosContratos);

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

      document.getElementById("my_modal_convertir_sin_platea").close();

      reset();

      setTimeout(() => {
        navigate("/contratos-sin-plateas");
      }, 1000);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const [plazoDias, setPlazoDias] = useState(""); // Estado para almacenar el plazo de días seleccionado
  const fecha_vencimiento_platea = watch("fecha_de_garantizacion");

  console.log(fecha_vencimiento_platea);

  const handleChangePlazoDias = (e) => {
    const selectedPlazo = e.target.value;
    setPlazoDias(selectedPlazo);

    const hoy = new Date();
    const fechaDiasHabiles = new Date(fecha_vencimiento_platea);

    if (selectedPlazo === "60") {
      fechaDiasHabiles.setDate(fechaDiasHabiles.getDate() + 15);
    } else if (selectedPlazo === "90") {
      fechaDiasHabiles.setDate(fechaDiasHabiles.getDate() + 30);
    } else if (selectedPlazo === "120") {
      fechaDiasHabiles.setDate(fechaDiasHabiles.getDate() + 120);
    } else if (selectedPlazo === "150") {
      fechaDiasHabiles.setDate(fechaDiasHabiles.getDate() + 150);
    }

    // Formatear la fecha para asignarla al campo fecha_dias_habiles
    const formattedFechaDiasHabiles = fechaDiasHabiles
      .toISOString()
      .split("T")[0];
    setValue("fecha_de_vencimiento", formattedFechaDiasHabiles);
  };

  return (
    <dialog id="my_modal_convertir_sin_platea" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Pasar contrato a garantias pero sin platea.
        </h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras pasar el contrato con garantias a la seccion
          sin plateas.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Fechas y observaciónes
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">
                Fecha de cancelación anticipo
              </label>
              <input
                type="date"
                {...register("fecha_cancelación_anticipo")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">
                Fecha de garantización
              </label>
              <input
                type="date"
                {...register("fecha_de_garantizacion")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">
                Seleccionar plazo de días de 15 a ..
              </label>
              <select
                {...register("plazo_dias")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                onChange={handleChangePlazoDias}
              >
                <option value="">Seleccionar plazo</option>
                <option value="60">60 días</option>
                <option value="90">90 días</option>
                <option value="120">120 días</option>
                <option value="150">150 días</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Fecha de vencimiento</label>
              <input
                type="date"
                {...register("fecha_de_vencimiento")}
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
              Guardar en la sección sin platea.
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
