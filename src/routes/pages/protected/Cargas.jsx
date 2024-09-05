import { useEffect, useState } from "react";
import { useCargasContext } from "../../../context/CargasContext";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { FaSearch } from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { useForm } from "react-hook-form";
import client from "../../../api/axios";
import { toast } from "react-toastify";

export const Cargas = () => {
  const { cargas } = useCargasContext();
  const { handleObtenerId, idObtenida } = useObtenerId();

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Extract unique years and months from cargas
  const years = [
    ...new Set(cargas.map((carga) => new Date(carga.created_at).getFullYear())),
  ].sort((a, b) => b - a);
  const months = [
    ...new Set(
      cargas.map((carga) => new Date(carga.created_at).getMonth() + 1)
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
  let filteredData = cargas.filter((carga) => {
    const createdDate = new Date(carga.created_at);
    const yearMatches = selectedYear
      ? createdDate.getFullYear() === parseInt(selectedYear)
      : true;
    const monthMatches = selectedMonth
      ? createdDate.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const matchesSearchTerm =
      carga.nombre_apellido
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase()) ||
      carga.numero_remito
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase());

    return matchesSearchTerm && yearMatches && monthMatches;
  });

  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">Sector de cargas, registros, etc.</p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_nueva_carga").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-[#FD454D] hover:bg-[#ef4242] text-white py-2 rounded-md px-2 transition-all"
          >
            Cargar nuevo registro de carga
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
              placeholder="Buscar por el nombre, apellido o n° remito"
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
              <th>Nombre y apellido</th>
              <th>Numero remito</th>
              <th>Fecha de carga</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium capitalize">
            {filteredData
              ?.sort((a, b) => b.id - a.id)
              ?.map((carga) => (
                <tr key={carga.id}>
                  <th>{carga.id}</th>
                  <th>{carga.nombre_apellido}</th>
                  <th>{carga.numero_remito}</th>
                  <th>{formatearFecha(carga.created_at)}</th>
                  <th>
                    <div className="flex cursor-pointer gap-2">
                      <button
                        onClick={() => {
                          handleObtenerId(carga.id);
                          document
                            .getElementById("my_modal_ver_registro")
                            .showModal();
                        }}
                        type="button"
                        className="bg-blue-500 py-2 px-4 rounded-md text-white"
                      >
                        Registro completo
                      </button>
                      <button
                        onClick={() => {
                          handleObtenerId(carga.id);
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
    </section>
  );
};

const ModalNuevoRegistro = () => {
  const { register, handleSubmit, reset } = useForm();
  const [items, setItems] = useState([{ detalle: "", cantidad: "" }]);
  const { setCargas } = useCargasContext();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
        datos: items, // Añadir los items al objeto que envías
      };

      const res = await client.post("/cargas", ordenData);

      setCargas(res.data.todasLasCargas);

      reset();

      document.getElementById("my_modal_nueva_carga").close();
      setItems([{ detalle: "", cantidad: "" }]); // Reiniciar el formulario y los items
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { detalle: "", cantidad: "" }]); // Añadir una nueva fila vacía
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value; // Actualizar el valor del campo
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index); // Remover el item correspondiente
    setItems(updatedItems);
  };

  return (
    <dialog id="my_modal_nueva_carga" className="modal">
      <div className="modal-box rounded-md max-w-7xl">
        <form method="dialog">
          {/* Si hay un botón en el formulario, cerrará el modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar nuevo registro</h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras cargar un nuevo registro, de productos, etc.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del registro.
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Nombre y apellido</label>
              <input
                {...register("nombre_apellido")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Numero del remito</label>
              <input
                {...register("numero_remito")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribrir el numero ej: 000-00010"
              />
            </div>
          </div>
          <div className="mt-5">
            <div className="font-bold mb-2 text-[#FD454D] text-lg">
              Cargar nuevos items del registro.
            </div>

            <div className="border">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-2 w-auto p-3 border-r">
                    {/* <label className="font-bold text-sm">
                      Detalle del producto
                    </label> */}
                    <input
                      value={item.detalle}
                      onChange={(e) =>
                        handleItemChange(index, "detalle", e.target.value)
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
                      placeholder="Escribir el detalle del producto..."
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-auto p-3">
                    {/* <label className="font-bold text-sm">Cantidad</label> */}
                    <input
                      value={item.cantidad}
                      onChange={(e) =>
                        handleItemChange(index, "cantidad", e.target.value)
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase font-bold"
                      placeholder="Escribir la cantidad..."
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 border px-4 rounded-md border-red-500 text-sm py-1 hover:bg-red-50 transition-all font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-3 font-semibold text-sm text-blue-500"
            >
              Añadir nuevo item
            </button>
          </div>
          <div className="mt-6">
            <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
              Guardar registro
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalObservarRegistro = ({ idObtenida }) => {
  const [carga, setCarga] = useState({});
  const [parsedDatos, setParsedDatos] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const respuesta = await client.get(`/cargas/${idObtenida}`);
        console.log("Carga data:", respuesta.data); // Log full carga data

        setCarga(respuesta.data);

        // Inspect the raw datos field
        console.log("Raw datos:", respuesta.data.datos);

        // Safely parse the 'datos' field
        try {
          // Attempt to fix the JSON format if needed
          const datosFixed = respuesta.data.datos
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"');
          const datosParsed = JSON.parse(datosFixed || "[]");
          console.log("Parsed datos:", datosParsed); // Log parsed datos
          setParsedDatos(datosParsed);
        } catch (parseError) {
          console.error("Error parsing datos:", parseError);
          setParsedDatos([]); // Set to empty array if parsing fails
        }
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
          En esta sección podras observar el registro.
        </p>

        <div className="mb-4">
          <p className="font-bold text-lg underline">Datos del registro.</p>
          <div>
            <p className="font-semibold uppercase text-sm">
              Nombre y apellido:{" "}
              <span className="font-bold text-blue-500">
                {carga.nombre_apellido}
              </span>
            </p>{" "}
            <p className="font-semibold uppercase text-sm">
              Numero del remito:{" "}
              <span className="font-bold text-blue-500">
                N° {carga.numero_remito}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white">
          <table className="table">
            <thead>
              <tr className="font-extrabold text-sm text-black">
                <th>Detalle del producto</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium capitalize">
              {parsedDatos.map((dato, index) => (
                <tr key={index}>
                  <th>{dato.detalle}</th>
                  <th>{dato.cantidad}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5">
          <button className="font-bold text-sm bg-blue-500 py-1 px-4 rounded-md text-white shadow">
            Descargar e imprimir registro
          </button>
        </div>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setCargas } = useCargasContext();

  const onSubmit = async (formData) => {
    try {
      const cargasData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(`/cargas/${idObtenida}`, cargasData);

      setCargas(res.data.todasLasCargas);

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
