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

export const ContratosGarantias = () => {
  const { contratos } = useContratosContext();

  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const handleClick = () => {
    // Mostrar el mensaje preliminar
    setMostrarMensaje(true);

    // Simular una espera (opcional, solo para demostración)
    setTimeout(() => {
      // Mostrar el modal después de un tiempo
      document.getElementById("my_modal_convertir_en_garantia").showModal();

      // Ocultar el mensaje preliminar
      setMostrarMensaje(false);
    }, 1000); // Aquí puedes ajustar el tiempo de espera en milisegundos
  };

  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">Cargar contratos para garantizar.</p>
        <div>
          <button
            onClick={() =>
              document.getElementById("my_modal_contrato").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-blue-600 text-white py-2 rounded-md px-2 hover:bg-blue-700 transition-all"
          >
            Cargar nuevo contrato/cliente
            <FaChevronDown />
          </button>
        </div>
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
                <th>Tipo de plan</th>
                <th>Cancelo anticipo</th>
                <th>Sucursal</th>
                <th>Fecha de carga</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium capitalize">
              {contratos.map((contrato) => {
                //ordenar de mayor a menor por el id
                contratos.sort((a, b) => b.id - a.id);

                return (
                  <tr key={contrato.id}>
                    <th>{contrato.id}</th>
                    <td>{contrato.nombre_apellido}</td>
                    <td>{contrato.numero_contrato}</td>
                    <td>{contrato.tipo_plan}</td>
                    <td>{contrato.cuotas_anticipo}</td>
                    <td>{contrato.sucursal}</td>
                    <td>{formatearFecha(contrato.created_at)}</td>
                    <td>
                      <div className="flex">
                        <p
                          className={`${
                            (contrato.estado === "sin estado ahún" &&
                              "bg-orange-500") ||
                            (contrato.estado === "por garantizar" &&
                              "bg-blue-600") ||
                            (contrato.estado === "en sección con platea" &&
                              "bg-fuchsia-500") ||
                            (contrato.estado === "en sección sin platea" &&
                              "bg-pink-500") ||
                            (contrato.estado === "en informes" &&
                              "bg-green-500")
                          } py-1 px-2 rounded text-white font-semibold`}
                        >
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
                          {contrato.estado === "por garantizar" ? (
                            ""
                          ) : (
                            <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                              <button
                                onClick={() => {
                                  handleObtenerId(contrato.id), handleClick();
                                }}
                              >
                                Convertir en garantia
                              </button>
                            </li>
                          )}
                          <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                            <button>Eliminar</button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ContratoModal />
      <ConvertirEnGarantia idObtenida={idObtenida} />

      {mostrarMensaje && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="animate-pulse rounded-md bg-gray-700 py-20 px-20 text-white text-3xl">
            Convirtiendo en garantía...
          </p>
        </div>
      )}
    </section>
  );
};

const ContratoModal = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const { setContratos } = useContratosContext();

  //watchs
  const plan = watch("tipo_plan");

  // Array con los valores permitidos para mostrar el div
  const valoresPermitidos = ["anticipo + cuotas", "financiado en cuotas"];

  // Verificar si plan está en la lista de valores permitidos
  const mostrarDiv = valoresPermitidos.includes(plan);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("crear-contrato", (guardarContrato) => {
      setContratos(guardarContrato);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
      };

      const res = await client.post("/contratos", ordenData);

      if (socket) {
        socket.emit("crear-contrato", res.data.todosLosContratos);
      }

      console.log(res.data);

      toast.success("¡Contrato cargado correctamente!", {
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

      document.getElementById("my_modal_contrato").close();

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_contrato" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar nuevo contrato</h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras cargar un nuevo contrato o cliente para poder
          garantizar.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del cliente.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Nombre y apellido</label>
              <input
                {...register("nombre_apellido")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Localidad</label>
              <input
                {...register("localida_contrato")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir la localidad"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Provincia</label>
              <input
                {...register("provincia_contrato")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir la localidad"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">N° contrato</label>
              <input
                {...register("numero_contrato")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el numero contrato ej: 1255/12"
              />
            </div>
          </div>
          <div className="font-bold mb-2 text-[#FD454D] text-lg mt-3">
            Datos del contrato.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Tipo de plan</label>
              <select
                {...register("tipo_plan")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 font-semibold"
              >
                <option className="font-bold text-blue-600">
                  Seleccionar el plan
                </option>
                <option className="font-semibold">Contado</option>
                <option value={"anticipo + cuotas"} className="font-semibold">
                  Anticipo + Cuotas
                </option>
                <option
                  value={"financiado en cuotas"}
                  className="font-semibold"
                >
                  Financiado en cuotas
                </option>
              </select>
            </div>
            {mostrarDiv && (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Escribe las cuotas/anticipo
                </label>
                <textarea
                  {...register("cuotas_anticipo")}
                  className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                />
              </div>
            )}
          </div>

          <div className="font-bold mb-2 text-[#FD454D] text-lg mt-3">
            Sucursal del contrato
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <label className="font-bold text-sm">
              Seleccionar la sucursal del contrato
            </label>
            <select
              {...register("sucursal")}
              className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 font-semibold"
            >
              <option className="font-bold text-blue-600">
                Seleccionar la sucursal
              </option>
              <option value={"iraola"} className="font-semibold">
                Iraola
              </option>
              <option value={"burzaco"} className="font-semibold">
                Burzaco
              </option>
            </select>
          </div>
          <div className="mt-6">
            <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
              Guardar contrato
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ConvertirEnGarantia = ({ idObtenida }) => {
  const { register, handleSubmit, reset } = useForm();

  const navigate = useNavigate();

  const { setContratos } = useContratosContext();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("guardar-contrato-garantias", (guardarContrato) => {
      setContratos(guardarContrato);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.put(`/contratos/${idObtenida}/datos`, ordenData);

      if (socket) {
        socket.emit("guardar-contrato-garantias", res.data.todosLosContratos);
      }

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

      document.getElementById("my_modal_convertir_en_garantia").close();

      reset();

      setTimeout(() => {
        navigate("/contratos-a-garantizar");
      }, 1000);
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
        <h3 className="font-bold text-xl">Pasar contrato a garantias</h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras pasar el contrato o cliente para poder
          garantizar.
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
              Guardar en garantias
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
