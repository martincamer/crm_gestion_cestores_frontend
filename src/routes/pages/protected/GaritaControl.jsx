import { useEffect, useState } from "react";
import { useCargasContext } from "../../../context/GaritaContext";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { FaPrint, FaSearch } from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { PDFViewer } from "@react-pdf/renderer";
import client from "../../../api/axios";
import { GaritaPdf } from "../../../components/pdf/GaritaPdf";

export const GaritaControl = () => {
  const { garitas } = useCargasContext();
  const { handleObtenerId, idObtenida } = useObtenerId();

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Extract unique years and months from cargas
  const years = [
    ...new Set(
      garitas.map((carga) => new Date(carga.created_at).getFullYear())
    ),
  ].sort((a, b) => b - a);
  const months = [
    ...new Set(
      garitas.map((carga) => new Date(carga.created_at).getMonth() + 1)
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
  let filteredData = garitas.filter((carga) => {
    const createdDate = new Date(carga.created_at);
    const yearMatches = selectedYear
      ? createdDate.getFullYear() === parseInt(selectedYear)
      : true;
    const monthMatches = selectedMonth
      ? createdDate.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const matchesSearchTerm =
      carga.autorizo.toLowerCase().includes(searchTermCliente.toLowerCase()) ||
      carga.chofer.toLowerCase().includes(searchTermCliente.toLowerCase()) ||
      carga.numero_remito
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase());

    return matchesSearchTerm && yearMatches && monthMatches;
  });

  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">Sector de salidas, registros, etc.</p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_nueva_salida").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-[#FD454D] hover:bg-[#ef4242] text-white py-2 rounded-md px-2 transition-all"
          >
            Cargar nuevo registro de salida
          </button>
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
              placeholder="Buscar por el que autorizo, n° remito, o chofer"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium outline-none hover:border-blue-600"
            >
              <option value="">Seleccionar año</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium outline-none hover:border-blue-600"
            >
              <option value="">Seleccionar mes</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month < 10 ? `0${month}` : month} -{" "}
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
              <th>Referencia</th>
              <th>Hora Egreso y Fecha</th>
              <th>Destino</th>
              <th>N° del remito</th>
              <th>Transporte</th>
              <th>Autorizo</th>
              <th>Vigilador</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium capitalize">
            {filteredData
              ?.sort((a, b) => b.id - a.id)
              ?.map((garita) => (
                <tr key={garita.id}>
                  <th>{garita.id}</th>
                  <th>{formatearFecha(garita.created_at)}</th>
                  <th>{garita.destino}</th>
                  <th>{garita.numero_remito}</th>
                  <th>
                    <div className="border py-1 px-3 uppercase">
                      <p className="font-medium">
                        Chofer:{" "}
                        <span className="font-bold">{garita.chofer}</span>
                      </p>{" "}
                      <p className="font-medium">
                        Dominio y chasis:{" "}
                        <span className="font-bold">
                          {garita.dominio_chasis}
                        </span>
                      </p>{" "}
                      <p className="font-medium">
                        Dominio y acoplado:{" "}
                        <span className="font-bold">
                          {garita.dominio_acoplado}
                        </span>
                      </p>
                    </div>
                  </th>
                  <th>{garita.autorizo}</th>
                  <th>{garita.vigilador}</th>
                  <th>
                    <div className="flex cursor-pointer gap-2">
                      <button
                        onClick={() => {
                          handleObtenerId(garita.id);
                          document
                            .getElementById("my_modal_ver_registro")
                            .showModal();
                        }}
                        type="button"
                        className="bg-blue-500 py-2 px-4 rounded-md text-white"
                      >
                        <FaPrint className="text-xl" />
                      </button>{" "}
                      <button
                        onClick={() => {
                          handleObtenerId(garita.id);
                          document
                            .getElementById("my_modal_eliminar")
                            .showModal();
                        }}
                        type="button"
                        className="bg-red-500 py-2 px-4 rounded-md text-white"
                      >
                        Eliminar
                      </button>{" "}
                      <button
                        onClick={() => {
                          handleObtenerId(garita.id);
                          document
                            .getElementById("my_modal_editar_registro")
                            .showModal();
                        }}
                        type="button"
                        className="bg-green-500 py-2 px-4 rounded-md text-white"
                      >
                        Editar
                      </button>
                    </div>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ModalNuevoRegistro />
      <ModalObservarRegistro idObtenida={idObtenida} />
      <ModalEliminar idObtenida={idObtenida} />
      <ModalEditarElRegistro idObtenida={idObtenida} />
    </section>
  );
};

const ModalNuevoRegistro = () => {
  const { register, handleSubmit, reset } = useForm();
  const { setGaritas } = useCargasContext();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
      };

      const res = await client.post("/garitas", ordenData);

      setGaritas(res.data.todasLasGaritas);

      reset();

      document.getElementById("my_modal_nueva_salida").close();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_nueva_salida" className="modal">
      <div className="modal-box rounded-md max-w-7xl">
        <form method="dialog">
          {/* Si hay un botón en el formulario, cerrará el modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Cargar nuevo registro, salida de camion
        </h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras cargar un nuevo registro de salida.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del registro.
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Autirzo</label>
              <input
                {...register("autorizo")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Destino</label>
              <input
                {...register("destino")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribrir ej: Venado tuerto"
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">N° del remito</label>
              <input
                {...register("numero_remito")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribrir el numero ej: 000-00010"
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Vigilador</label>
              <select
                {...register("vigilador")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
              >
                <option>Seleccionar vigilador</option>
                <option value={"javier vallejo"}>Javier Vallejo</option>
              </select>
            </div>
          </div>

          <div className="font-bold mt-4 text-[#FD454D] text-lg">
            Datos del camion.
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">
                Apellido y nombre chofer
              </label>
              <input
                {...register("chofer")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Dominio y chasis</label>
              <input
                {...register("dominio_chasis")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Dominio acoplado</label>
              <input
                {...register("dominio_acoplado")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>
          </div>

          <div className="mt-6">
            <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
              Guardar registro de la salida
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEditarElRegistro = ({ idObtenida }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { setGaritas } = useCargasContext();

  useEffect(() => {
    const loadData = async () => {
      const respuesta = await client.get(`/garitas/${idObtenida}`);

      setValue("autorizo", respuesta.data.autorizo);
      setValue("destino", respuesta.data.destino);
      setValue("numero_remito", respuesta.data.numero_remito);
      setValue("vigilador", respuesta.data.vigilador);
      setValue("chofer", respuesta.data.chofer);
      setValue("dominio_chasis", respuesta.data.dominio_chasis);
      setValue("dominio_acoplado", respuesta.data.dominio_acoplado);
    };
    loadData();
  }, [idObtenida]);

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
      };

      const res = await client.put(`/garitas/${idObtenida}`, ordenData);

      setGaritas(res.data.todasLasGaritas);

      document.getElementById("my_modal_editar_registro").close();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <dialog id="my_modal_editar_registro" className="modal">
      <div className="modal-box rounded-md max-w-7xl">
        <form method="dialog">
          {/* Si hay un botón en el formulario, cerrará el modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Actualizar la salida del registro</h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras actualizar el registro de salida.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del registro.
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Autirzo</label>
              <input
                {...register("autorizo")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Destino</label>
              <input
                {...register("destino")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribrir ej: Venado tuerto"
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">N° del remito</label>
              <input
                {...register("numero_remito")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribrir el numero ej: 000-00010"
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Vigilador</label>
              <select
                {...register("vigilador")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
              >
                <option>Seleccionar vigilador</option>
                <option value={"javier vallejo"}>Javier Vallejo</option>
              </select>
            </div>
          </div>

          <div className="font-bold mt-4 text-[#FD454D] text-lg">
            Datos del camion.
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">
                Apellido y nombre chofer
              </label>
              <input
                {...register("chofer")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Dominio y chasis</label>
              <input
                {...register("dominio_chasis")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>{" "}
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Dominio acoplado</label>
              <input
                {...register("dominio_acoplado")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>
          </div>

          <div className="mt-6">
            <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
              Actualizar registro de la salida
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalObservarRegistro = ({ idObtenida }) => {
  const [carga, setCarga] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const respuesta = await client.get(`/garitas/${idObtenida}`);
        console.log("Carga data:", respuesta.data); // Log full carga data

        setCarga(respuesta.data);
      } catch (error) {
        console.error("Error fetching carga data:", error);
      }
    };

    loadData();
  }, [idObtenida]);

  return (
    <dialog id="my_modal_ver_registro" className="modal">
      <div className="modal-box rounded-md max-w-3xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Registro obtenido <span className="text-[#FD454D]">{idObtenida}</span>
        </h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras observar el registro e imprimir para firmar.
        </p>

        <div className="mb-4">
          <p className="font-bold text-lg underline">Datos del registro.</p>
          <div>
            <p className="font-semibold uppercase text-sm">
              Autorizo:{" "}
              <span className="font-bold text-blue-500">{carga.autorizo}</span>
            </p>{" "}
            <p className="font-semibold uppercase text-sm">
              Numero del remito:{" "}
              <span className="font-bold text-blue-500">
                N° {carga.numero_remito}
              </span>
            </p>{" "}
            <p className="font-semibold uppercase text-sm">
              Destino:{" "}
              <span className="font-bold text-blue-500">
                N° {carga.destino}
              </span>
            </p>{" "}
            <p className="font-semibold uppercase text-sm">
              Chofer:{" "}
              <span className="font-bold text-blue-500">{carga.chofer}</span>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={() => {
              document.getElementById("my_modal_datos").showModal();
            }}
            className="font-bold text-sm bg-blue-500 py-1 px-4 rounded-md text-white shadow"
          >
            Descargar e imprimir registro
          </button>
        </div>

        <ModalImprimirDatos datos={carga} />
      </div>
    </dialog>
  );
};

const ModalImprimirDatos = ({ datos }) => {
  return (
    <dialog id="my_modal_datos" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <PDFViewer className="h-[50vh] w-full mt-4">
          <GaritaPdf datos={datos} />
        </PDFViewer>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setGaritas } = useCargasContext();

  const onSubmit = async (formData) => {
    try {
      const cargasData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(`/garitas/${idObtenida}`, cargasData);

      setGaritas(res.data.todasLasGaritas);

      toast.error("¡Registro eliminado correctamente!", {
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
            Eliminar el registro cargado..
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">
            El registro no podra ser recuperado nunca mas, no recuperaras todo
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
