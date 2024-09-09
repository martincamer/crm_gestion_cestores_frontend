import { useParams } from "react-router-dom";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { formatearFechaMes } from "../../../helpers/formatearFecha";
import { toast } from "react-toastify";
import client from "../../../api/axios";

export const InformesFabrica = () => {
  const [informe, setInforme] = useState({});

  const { handleObtenerId, idObtenida } = useObtenerId();

  const params = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await client.get(`/informes/${params.id}`);
        setInforme(res.data);
      } catch (error) {
        console.error("Error fetching informe:", error);
      }
    };
    loadData();
  }, [params.id]);

  const contratos = informe?.contratos ? JSON.parse(informe.contratos) : [];

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Extract unique years and months from cargas
  const years = [
    ...new Set(
      contratos.map((carga) => new Date(carga.fechaCreacion).getFullYear())
    ),
  ].sort((a, b) => b - a);
  const months = [
    ...new Set(
      contratos.map((carga) => new Date(carga.fechaCreacion).getMonth() + 1)
    ),
  ].sort((a, b) => a - b);

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Filter data based on search term, year, and month
  let filteredData = contratos.filter((carga) => {
    const createdDate = new Date(carga.fechaCreacion);
    const yearMatches = selectedYear
      ? createdDate.getFullYear() === parseInt(selectedYear)
      : true;
    const monthMatches = selectedMonth
      ? createdDate.getMonth() + 1 === parseInt(selectedMonth)
      : true;

    const matchesSearchTerm =
      carga.cliente.toLowerCase().includes(searchTermCliente.toLowerCase()) ||
      carga.numero_contrato
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase());

    return matchesSearchTerm && yearMatches && monthMatches;
  });

  // Filter for pending and delivered contracts
  const pendientes = filteredData.filter(
    (contrato) => contrato.estado === "pendiente"
  );
  const entregados = filteredData.filter(
    (contrato) => contrato.estado === "entregado"
  );

  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">
          Fabrica{" "}
          <span className="font-extrabold text-[#FD454D] capitalize">
            {informe?.fabrica}
          </span>{" "}
          obtenida.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_nuevo_contrato").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-[#FD454D] hover:bg-[#ef4242] text-white py-2 rounded-md px-2 transition-all"
          >
            Cargar nuevo contrato de entrega
          </button>
        </div>
      </div>

      <div className="bg-white px-10 pt-10 grid grid-cols-6 gap-2">
        <div className="py-5 px-4 bg-gray-800 rounded-lg border-t-4 border-blue-500">
          <p className="font-bold text-center text-white">
            Total contratos cargados.
          </p>
          <p className="font-bold text-center text-xl text-blue-400">
            {filteredData.length}
          </p>
        </div>{" "}
        <div className="py-5 px-4 bg-gray-800 rounded-lg border-t-4 border-[#FD454D]">
          <p className="font-bold text-center text-white">
            Total contratos pendientes.
          </p>
          <p className="font-bold text-center text-xl text-[#FD454D]">
            {pendientes.length}
          </p>
        </div>{" "}
        <div className="py-5 px-4 bg-gray-800 rounded-lg border-t-4 border-green-500">
          <p className="font-bold text-center text-white">
            Total contratos entregados.
          </p>
          <p className="font-bold text-center text-xl text-green-500">
            {entregados.length}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white px-10 pt-10">
        <div className="flex gap-3 items-center w-full">
          <div className="border border-gray-300 px-2 py-1 w-1/5 rounded-md text-sm font-medium flex items-center hover:border-blue-600">
            <FaSearch className="text-gray-400" />
            <input
              value={searchTermCliente}
              onChange={(e) => setSearchTermCliente(e.target.value)}
              className="text-sm outline-none w-full px-2"
              placeholder="Buscar por el cliente o contrato.."
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium outline-none hover:border-blue-600"
            >
              <option className="font-bold" value="">
                Seleccionar año
              </option>
              {years.map((year) => (
                <option className="font-semibold" key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium outline-none hover:border-blue-600 capitalize"
            >
              <option className="font-bold" value="">
                Seleccionar mes
              </option>
              {months.map((month) => (
                <option
                  className="capitalize font-semibold"
                  key={month}
                  value={month}
                >
                  {new Date(0, month - 1).toLocaleString("es-ES", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white px-10 py-5">
        <table className="table">
          <thead>
            <tr className="font-extrabold text-sm text-black">
              {/* <th>Referencia del contrato</th> */}
              <th>Cliente</th>
              <th>Numero contrato</th>
              <th>Vencimiento</th>
              <th>Contraentrega email</th>
              <th>Metros cuadrados</th>
              <th>Observaciones/Revestimiento</th>
              <th>Nombre del observante</th>
              <th>Entrega</th>
              <th>Mes y año de entrega</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium capitalize">
            {filteredData.length > 0 ? (
              filteredData.map((contrato) => (
                <tr key={contrato.id}>
                  {/* <td>{contrato.id}</td> */}
                  <th>{contrato.cliente}</th>
                  <th>{contrato.numero_contrato}</th>
                  <td>{contrato.vencimiento}</td>
                  <td>
                    {formatearDinero(Number(contrato.contraentrega_real))}
                  </td>
                  <td>{contrato.metros_cuadrados} mtrs</td>
                  <td>{contrato.observaciones}</td>
                  <td>{contrato.observaciones_persona}</td>
                  <th>{contrato.fecha_entrega}</th>
                  <th>{formatearFechaMes(contrato.fechaCreacion)}</th>
                  <td>
                    <div className="flex cursor-pointer">
                      <p
                        className={`${
                          (contrato.estado === "pendiente" &&
                            "bg-orange-500") ||
                          (contrato.estado === "entregado" && "bg-green-500")
                        } py-1 px-4 rounded-md text-white font-bold`}
                      >
                        {contrato.estado}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <FaEdit
                        onClick={() => {
                          handleObtenerId(contrato.id);
                          document
                            .getElementById("my_modal_actualizar_registro")
                            .showModal();
                        }}
                        className="text-xl text-blue-500 cursor-pointer"
                      />
                      <MdDelete
                        onClick={() => {
                          handleObtenerId(contrato.id);
                          document
                            .getElementById("my_modal_eliminar")
                            .showModal();
                        }}
                        className="text-2xl text-red-500 cursor-pointer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No hay contratos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ModalNuevoRegistro params={params} setInforme={setInforme} />
      <ModalActualizarRegistro
        params={params}
        setInforme={setInforme}
        idObtenida={idObtenida}
      />
      <ModalEliminar
        params={params}
        setInforme={setInforme}
        idObtenida={idObtenida}
      />
    </section>
  );
};

const ModalNuevoRegistro = ({ params, setInforme }) => {
  const { register, handleSubmit, reset, watch } = useForm();

  const cliente = watch("cliente");
  const numero_contrato = watch("numero_contrato");
  const vencimiento = watch("vencimiento");
  const contraentrega_real = watch("contraentrega_real");
  const tipo_plan = watch("tipo_plan");
  const metros_cuadrados = watch("metros_cuadrados");
  const observaciones = watch("observaciones");
  const observaciones_persona = watch("observaciones_persona");
  const fecha_entrega = watch("fecha_entrega");

  const onSubmit = async () => {
    try {
      const ordenData = {
        nuevoDato: {
          cliente,
          numero_contrato,
          tipo_plan,
          vencimiento,
          contraentrega_real,
          metros_cuadrados,
          observaciones,
          observaciones_persona,
          fecha_entrega,
          estado: "pendiente",
        },
      };

      const res = await client.post(
        `/informes/${params.id}/contratos`,
        ordenData
      );

      setInforme(res.data);

      reset();

      document.getElementById("my_modal_nuevo_contrato").close();

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
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_nuevo_contrato" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* Si hay un botón en el formulario, cerrará el modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar nuevo contrato</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Cliente</label>
              <input
                {...register("cliente")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el nombre del cliente..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">N° Contrato</label>
              <input
                {...register("numero_contrato")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el numero de contrato..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Tipo de plan</label>
              <select
                {...register("tipo_plan")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              >
                <option>Seleccionar el plan</option>
                <option value={"anticipo + cuotas"}>ANTICIPO + CUOTAS</option>
                <option value={"contado"}>CONTADO</option>
                <option value={"contado diferido"}>CONTADO DIFERIDO</option>
                <option value={"financiado"}>FINANCIADO</option>
              </select>
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Vencimiento</label>
              <input
                {...register("vencimiento")}
                type="date"
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Contraentrega real</label>
              <input
                {...register("contraentrega_real")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el $monto..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Metros cuadrados</label>
              <input
                {...register("metros_cuadrados")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Metros cuadrados..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">
                Observaciones revestimiento
              </label>
              <input
                {...register("observaciones")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Observacion..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Observaciones persona</label>
              <input
                {...register("observaciones_persona")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="LILI, NYLA..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Fecha de entrega</label>
              <input
                type="date"
                {...register("fecha_entrega")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>{" "}
          </div>

          <div className="mt-6">
            <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
              Guardar el cliente
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalActualizarRegistro = ({ params, setInforme, idObtenida }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    const loadData = async () => {
      const res = await client.get(
        `/informes/${params.id}/contratos/${idObtenida}`
      );

      setValue("cliente", res.data.cliente || "");
      setValue("numero_contrato", res.data.numero_contrato || "");
      setValue("vencimiento", res.data.vencimiento || "");
      setValue("contraentrega_real", res.data.contraentrega_real || "");
      setValue("metros_cuadrados", res.data.metros_cuadrados || "");
      setValue("observaciones", res.data.observaciones || "");
      setValue("observaciones_persona", res.data.observaciones_persona || "");
      setValue("fecha_entrega", res.data.fecha_entrega || "");
      setValue("tipo_plan", res.data.tipo_plan || "");
      setValue("estado", res.data.estado);
      setValue("fechaCreacion", res.data.fechaCreacion);
    };

    loadData();
  }, [idObtenida]);

  const cliente = watch("cliente");
  const numero_contrato = watch("numero_contrato");
  const vencimiento = watch("vencimiento");
  const tipo_plan = watch("tipo_plan");
  const contraentrega_real = watch("contraentrega_real");
  const metros_cuadrados = watch("metros_cuadrados");
  const observaciones = watch("observaciones");
  const observaciones_persona = watch("observaciones_persona");
  const fecha_entrega = watch("fecha_entrega");
  const estado = watch("estado");
  const fechaCreacion = watch("fechaCreacion");

  const onSubmit = async () => {
    try {
      const ordenData = {
        datosActualizados: {
          cliente,
          numero_contrato,
          tipo_plan,
          vencimiento,
          contraentrega_real,
          metros_cuadrados,
          observaciones,
          observaciones_persona,
          fecha_entrega,
          estado,
          fechaCreacion,
        },
      };

      const res = await client.put(
        `/informes/${params.id}/contratos/${idObtenida}`,
        ordenData
      );

      setInforme(res.data);

      document.getElementById("my_modal_actualizar_registro").close();

      toast.success("¡Contrato actualizado correctamente!", {
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
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_actualizar_registro" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* Si hay un botón en el formulario, cerrará el modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Actualizar el contrato{" "}
          <span className="font-extrabold text-blue-500 capitalize">
            {cliente} ({numero_contrato})
          </span>
          .
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Cliente</label>
              <input
                {...register("cliente")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el nombre del cliente..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">N° Contrato</label>
              <input
                {...register("numero_contrato")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el numero de contrato..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Tipo de plan</label>
              <select
                {...register("tipo_plan")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              >
                <option>Seleccionar el plan</option>
                <option value={"anticipo + cuotas"}>ANTICIPO + CUOTAS</option>
                <option value={"contado"}>CONTADO</option>
                <option value={"contado diferido"}>CONTADO DIFERIDO</option>
                <option value={"financiado"}>FINANCIADO</option>
              </select>
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Vencimiento</label>
              <input
                {...register("vencimiento")}
                type="date"
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Contraentrega real</label>
              <input
                {...register("contraentrega_real")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el $monto..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Metros cuadrados</label>
              <input
                {...register("metros_cuadrados")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Metros cuadrados..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">
                Observaciones revestimiento
              </label>
              <textarea
                {...register("observaciones")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Observacion..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Observaciones persona</label>
              <input
                {...register("observaciones_persona")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="LILI, NYLA..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Fecha de entrega</label>
              <input
                type="date"
                {...register("fecha_entrega")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Estado de la entrega</label>
              <select
                {...register("estado")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              >
                <option>Seleccionar el estado</option>
                <option value={"pendiente"}>Pendiente</option>
                <option value={"entregado"}>Entregado</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">
                Mover fecha de entrega / mes, mover si cambio de mes
              </label>
              <input
                type="date"
                {...register("fechaCreacion")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 font-bold"
              />
            </div>
          </div>

          <div className="mt-6">
            <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
              Actualizar el cliente
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida, params, setInforme }) => {
  const { handleSubmit } = useForm();

  const onSubmit = async (formData) => {
    try {
      const cargasData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(
        `/informes/${params.id}/contratos/${idObtenida}`,
        cargasData
      );

      setInforme(res.data);

      toast.error("¡Contrato eliminado correctamente!", {
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

      document.getElementById("my_modal_eliminar").close();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_eliminar" className="modal">
      <div className="modal-box rounded-md max-w-md">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <img
              className="w-44 mx-auto"
              src="https://app.holded.com/assets/img/document/doc_delete.png"
            />
          </div>
          <div className="font-semibold text-sm text-gray-400 text-center">
            REFERENCIA {idObtenida}
          </div>
          <div className="font-semibold text-[#FD454D] text-lg text-center">
            Eliminar el contrato cargado..
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">
            El contrato no podra ser recuperado nunca mas, no recuperaras todo
            lo cargado...
          </div>
          <div className="mt-4 text-center w-full px-16">
            <button
              type="submit"
              className="bg-red-500 py-1 px-4 text-center font-bold text-white text-sm rounded-md w-full"
            >
              Confirmar
            </button>{" "}
            <button
              type="button"
              onClick={() =>
                document.getElementById("my_modal_eliminar").close()
              }
              className="bg-orange-100 py-1 px-4 text-center font-bold text-orange-600 mt-2 text-sm rounded-md w-full"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
