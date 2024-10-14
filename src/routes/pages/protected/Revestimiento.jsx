import { useEffect, useState } from "react";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMenuAlt2 } from "react-icons/hi";
import { useRevestimientoContext } from "../../../context/RevestimientoContext";
import { formatearFechaMes } from "../../../helpers/formatearFecha";
import client from "../../../api/axios";
import { FaSearch } from "react-icons/fa";

export const Revestimiento = () => {
  const { revestimientos } = useRevestimientoContext();
  const { handleObtenerId, idObtenida } = useObtenerId();

  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Extract unique years and months from cargas
  const years = [
    ...new Set(
      revestimientos.map((carga) => new Date(carga.created_at).getFullYear())
    ),
  ].sort((a, b) => b - a);
  const months = [
    ...new Set(
      revestimientos.map((carga) => new Date(carga.created_at).getMonth() + 1)
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
  let filteredData = revestimientos.filter((carga) => {
    const createdDate = new Date(carga.created_at);
    const yearMatches = selectedYear
      ? createdDate.getFullYear() === parseInt(selectedYear)
      : true;
    const monthMatches = selectedMonth
      ? createdDate.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const matchesSearchTerm =
      carga.nombre_apellido_contrato
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase()) ||
      carga.numero_contrato
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase());
    return matchesSearchTerm && yearMatches && monthMatches;
  });

  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">Sector de revestimiento</p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              document
                .getElementById("my_modal_nuevo_contrato_revestimiento")
                .showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-gradient-to-l from-gray-800/40 to-[#ff0000] text-white py-2 rounded-md px-2 transition-all"
          >
            Cargar nuevo contrato a revestimiento
          </button>
        </div>
      </div>
      <div className="flex px-5 pt-10 bg-white gap-2">
        <div className="bg-gray-800 py-5 px-16 rounded-2xl shadow-md  text-center">
          <p className="text-white font-medium text-lg">Revestidas</p>
          <p className="font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-white to-[#FD454D]">
            {300}
          </p>
        </div>{" "}
        <div className="bg-gray-800 py-5 px-16 rounded-2xl shadow-md  text-center">
          <p className="text-white font-medium text-lg">Sin Revestir</p>
          <p className="font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-white to-[#008b21]">
            {120}
          </p>
        </div>{" "}
        <div className="bg-gray-800 py-5 px-16 rounded-2xl shadow-md  text-center">
          <p className="text-white font-medium text-lg">Canjeadas</p>
          <p className="font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-white to-[#ff0000]">
            {10}
          </p>
        </div>{" "}
        <div className="bg-gray-800 py-5 px-16 rounded-2xl shadow-md  text-center">
          <p className="text-white font-medium text-lg">Sin revestimiento</p>
          <p className="font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-white to-[#bb00d4]">
            {130}
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
              placeholder="Buscar por el contrato o nombre y apellido.."
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
              <th>Nombre y apellido (contrato)</th>
              <th>Loc. y Prov.</th>
              <th>Fecha de carga</th>
              <th>Revestida</th>
              <th>Canjes</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium capitalize">
            {filteredData
              ?.sort((a, b) => b.id - a.id) // Ordenar por id de mayor a menor
              .map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>
                    {r.nombre_apellido_contrato} ({r.numero_contrato})
                  </td>
                  <td>
                    {r.localidad_contrato},{r.provincia_contrato}
                  </td>
                  <td>{formatearFechaMes(r.created_at)}</td>
                  <td>
                    <div className="flex">
                      <p
                        className={`${
                          (r.revestida === "Sí" && "bg-green-500") ||
                          (r.revestida === "No" && "bg-red-500") ||
                          (r.revestida === "En espera" && "bg-orange-500") ||
                          (r.revestida === "Canjeada" && "bg-blue-500")
                        } font-bold py-1.5 px-2 rounded-md text-white`}
                      >
                        {r.revestida}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex">
                      <p
                        className={`${
                          (r.canje === "Sí" && "bg-green-500") ||
                          (r.canje === "No" && "bg-red-500") ||
                          (r.canje === "En espera" && "bg-orange-500")
                        } font-bold py-1.5 px-2 rounded-md text-white`}
                      >
                        {r.canje}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="dropdown dropdown-top dropdown-end">
                      <div
                        tabIndex={0}
                        role="button"
                        className="hover:bg-gray-800 py-1 px-1 rounded-full hover:text-white hover:shadow-md transition-all"
                      >
                        <HiMenuAlt2 className="text-2xl" />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-white border mb-1 border-gray-300 rounded-md z-[1] w-60 p-1"
                      >
                        <li>
                          <button className="font-bold text-xs hover:bg-gray-800 hover:text-white text-center">
                            Ver materiales canjeados.
                          </button>
                        </li>
                        <li>
                          <button className="font-bold text-xs hover:bg-gray-800 hover:text-white text-center">
                            Ver materiales revestimiento.
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              handleObtenerId(r.id),
                                document
                                  .getElementById(
                                    "my_modal_actualizar_contrato_revestimiento"
                                  )
                                  .showModal();
                            }}
                            className="font-bold text-xs hover:bg-gray-800 hover:text-white text-center"
                          >
                            Actualizar el contrato
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ModalNuevoRegistro />
      <ModalEliminar idObtenida={idObtenida} />
      <ModalActualizarRegistro idObtenida={idObtenida} />
    </section>
  );
};

const ModalNuevoRegistro = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [items, setItems] = useState([
    { detalle: "", cantidad: "", precio: "" },
  ]); // Regular materials
  const [itemsCanje, setItemsCanje] = useState([
    { detalleCanje: "", cantidadCanje: "", precioCanje: "" },
  ]); // Canje materials

  const { setRevestimientos } = useRevestimientoContext();
  const [revestida, setRevestida] = useState("En espera");
  const [canje, setCanje] = useState("En espera");

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
        datos: items, // Regular materials
        datosCanje: itemsCanje, // Canje materials
        revestida,
        canje,
      };

      const res = await client.post("/revestimientos", ordenData);
      setRevestimientos(res.data.todosLosRevestimientos);
      // Reset regular materials
      setItems([{ detalle: "", cantidad: "", precio: "" }]);
      setItemsCanje([{ detalleCanje: "", cantidadCanje: "", precioCanje: "" }]);
      setRevestida("En espera");
      setCanje("En espera");

      document.getElementById("my_modal_nuevo_contrato_revestimiento").close();

      toast.success("¡Contrato cargado a revestimiento correctamente!", {
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
      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const toggleRevestida = () => {
    setRevestida((prev) =>
      prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
    );
  };

  const toggleCanje = () => {
    setCanje((prev) =>
      prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
    );
  };

  // Handle regular material items
  const handleAddItem = () => {
    setItems([...items, { detalle: "", cantidad: "", precio: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Handle canje material items
  const handleAddItemCanje = () => {
    setItemsCanje([
      ...itemsCanje,
      { detalleCanje: "", cantidadCanje: "", precioCanje: "" },
    ]);
  };

  const handleItemChangeCanje = (index, field, value) => {
    const updatedItems = [...itemsCanje];
    updatedItems[index][field] = value;
    setItemsCanje(updatedItems);
  };

  const handleRemoveItemCanje = (index) => {
    const updatedItems = itemsCanje.filter((_, i) => i !== index);
    setItemsCanje(updatedItems);
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const totalCanje = itemsCanje.reduce((acc, item) => {
    const cantidad = parseFloat(item.cantidadCanje) || 0;
    const precio = parseFloat(item.precioCanje) || 0;
    return acc + cantidad * precio;
  }, 0);

  return (
    <dialog id="my_modal_nuevo_contrato_revestimiento" className="modal">
      <div className="modal-box rounded-md max-w-full">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Cargar nuevo contrato a revestimiento
        </h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podrás cargar un nuevo contrato a revestimiento.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del contrato.
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Nombre y apellido</label>
              <input
                {...register("nombre_apellido_contrato")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Numero del contrato</label>
              <input
                {...register("numero_contrato")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal"
                placeholder="Escribir el número ej: 333-444..."
              />
            </div>

            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Localidad</label>
              <input
                {...register("localidad_contrato")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
                placeholder="Escribrir la localidad..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Provincia</label>
              <input
                {...register("provincia_contrato")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
                placeholder="Escribrir la provincia..."
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="font-bold mb-2 text-[#FD454D] text-lg">
              Administración datos.
            </div>
            <div className="grid grid-cols-11 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Revestida</label>
                <button
                  type="button"
                  className={`py-2 px-4 text-white text-sm rounded-md ${
                    revestida === "Sí"
                      ? "bg-green-500"
                      : revestida === "No"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                  onClick={toggleRevestida}
                >
                  {revestida}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Canje</label>
                <button
                  type="button"
                  className={`py-2 px-4 text-white text-sm rounded-md ${
                    canje === "Sí"
                      ? "bg-green-500"
                      : canje === "No"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                  onClick={toggleCanje}
                >
                  {canje}
                </button>
              </div>
            </div>

            {/* Regular Materials Section */}
            {revestida === "Sí" && (
              <div className="mt-5">
                <div className="font-bold mb-2 text-[] text-sm">
                  Cargar materiales regulares.
                </div>
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-2 mb-2 items-center"
                  >
                    <input
                      value={item.detalle}
                      onChange={(e) =>
                        handleItemChange(index, "detalle", e.target.value)
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Descripción..."
                    />
                    <input
                      value={item.cantidad}
                      onChange={(e) =>
                        handleItemChange(index, "cantidad", e.target.value)
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Cantidad..."
                    />
                    <div
                      className="w-full items-stretch flex"
                      onClick={handleInputClick}
                    >
                      {isEditable ? (
                        <input
                          value={item.precio}
                          onChange={(e) =>
                            handleItemChange(index, "precio", e.target.value)
                          }
                          type="text"
                          onBlur={() => setIsEditable(false)}
                          className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold w-full"
                          placeholder="Escribir el precio..."
                        />
                      ) : (
                        <p className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold w-full">
                          {formatearDinero(Number(item.precio) || 0)}
                        </p>
                      )}
                    </div>
                    <p
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Escribir el precio..."
                    >
                      {formatearDinero(
                        Number(item.precio * item.cantidad || 0)
                      )}
                    </p>
                    <div>
                      <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-2  hover:bg-red-700 transition-all ease-linear rounded-full"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <AiOutlineDelete className="text-2xl" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="border border-blue-500 px-3 rounded-full text-sm py-1.5 font-semibold hover:bg-blue-100 transition-all flex gap-1 items-center"
                  onClick={handleAddItem}
                >
                  Añadir material regular <IoMdAdd className="text-lg" />
                </button>
              </div>
            )}

            {canje === "Sí" && (
              <div className="font-bold mb-2 text-[#FD454D] text-lg mt-4">
                Cargar materiales en canje y el tipo .
              </div>
            )}

            {canje === "Sí" && (
              <div className="flex flex-col gap-2 w-auto mt-4 items-start">
                <label className="font-bold text-sm">
                  Seleccionar el tipo de canje.
                </label>
                <select
                  {...register("tipo_de_canje")}
                  className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-semibold"
                  placeholder="Escribir el nombre y apellido..."
                >
                  <option className="font-bold text-blue-500" value="">
                    Seleccionar el tipo de canje
                  </option>
                  <option value="contra entrega" className="font-semibold">
                    Contra entrega
                  </option>{" "}
                  <option value="cuotas" className="font-semibold">
                    Cuotas
                  </option>{" "}
                  <option value="cuotas" className="font-semibold">
                    Anexo
                  </option>{" "}
                </select>
              </div>
            )}

            {canje === "Sí" && (
              <div className="mt-5">
                <div className="font-bold mb-2 text-black text-sm">
                  Cargar materiales del canje.
                </div>
                {itemsCanje.map((itemCanje, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <input
                      value={itemCanje.detalleCanje}
                      onChange={(e) =>
                        handleItemChangeCanje(
                          index,
                          "detalleCanje",
                          e.target.value
                        )
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Descripción..."
                    />
                    <input
                      value={itemCanje.cantidadCanje}
                      onChange={(e) =>
                        handleItemChangeCanje(
                          index,
                          "cantidadCanje",
                          e.target.value
                        )
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Cantidad..."
                    />
                    <div
                      className="w-full items-stretch flex"
                      onClick={handleInputClick}
                    >
                      {isEditable ? (
                        <input
                          value={itemCanje.precioCanje}
                          onChange={(e) =>
                            handleItemChangeCanje(
                              index,
                              "precioCanje",
                              e.target.value
                            )
                          }
                          type="text"
                          onBlur={() => setIsEditable(false)}
                          className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold w-full"
                          placeholder="Escribir el total del comprobante..."
                        />
                      ) : (
                        <p className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold w-full">
                          {formatearDinero(Number(itemCanje.precioCanje) || 0)}
                        </p>
                      )}
                    </div>
                    <p
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Escribir el precio..."
                    >
                      {formatearDinero(
                        Number(
                          itemCanje.precioCanje * itemCanje.cantidadCanje || 0
                        )
                      )}
                    </p>
                    <div>
                      <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-2  hover:bg-red-700 transition-all ease-linear rounded-full"
                        onClick={() => handleRemoveItemCanje(index)}
                      >
                        <AiOutlineDelete className="text-2xl" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="border border-blue-500 px-3 rounded-full text-sm py-1.5 font-semibold hover:bg-blue-100 transition-all flex gap-1 items-center"
                  onClick={handleAddItemCanje}
                >
                  Añadir material canje <IoMdAdd className="text-lg" />
                </button>{" "}
                <div className="mt-5">
                  <h3 className="font-bold">
                    Total Canje{" "}
                    <span className="bg-red-700/80 px-3 py-1 rounded-full text-white shadow-md">
                      {formatearDinero(totalCanje)}
                    </span>
                  </h3>
                </div>
              </div>
            )}

            <div className="mt-10">
              <button className="bg-blue-500 text-white text-sm font-bold py-2 px-6 rounded-md">
                Cargar el contrato a revestir
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalActualizarRegistro = ({ idObtenida }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [revestimiento, setRevestimiento] = useState([]);
  const [revestida, setRevestida] = useState("En espera");
  const [canje, setCanje] = useState("En espera");

  const [items, setItems] = useState([
    { detalle: "", cantidad: "", precio: "" },
  ]);
  const [itemsCanje, setItemsCanje] = useState([
    { detalleCanje: "", cantidadCanje: "", precioCanje: "" },
  ]);

  useEffect(() => {
    const loadData = async () => {
      const res = await client.get(`/revestimientos/${idObtenida}`);

      setRevestimiento(res.data);
      console.log(res.data);

      // Asignar datos a los campos del formulario
      setValue("nombre_apellido_contrato", res.data.nombre_apellido_contrato);
      setValue("localidad_contrato", res.data.localidad_contrato);
      setValue("provincia_contrato", res.data.provincia_contrato);
      setValue("numero_contrato", res.data.numero_contrato);
      setRevestida(res.data.revestida);
      setCanje(res.data.canje);

      // Parsear 'datos' y 'datoscanje' (de texto a objeto)
      const parsedDatos = JSON.parse(res.data.datos);
      const parsedDatosCanje = JSON.parse(res.data.datoscanje);

      // Asignar los datos parseados a los estados correspondientes
      setItems(parsedDatos);
      setItemsCanje(parsedDatosCanje);
    };

    loadData();
  }, [idObtenida]);

  const { setRevestimientos } = useRevestimientoContext();

  const onSubmit = async (formData) => {
    try {
      //ORDEN DATA
      const ordenData = {
        ...formData,
        datos: items,
        datosCanje: itemsCanje,
        revestida,
        canje,
      };

      const res = await client.put(`/revestimientos/${idObtenida}`, ordenData);

      setRevestimientos(res.data.todosLosRevestimientos);

      document
        .getElementById("my_modal_actualizar_contrato_revestimiento")
        .close();

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

  const toggleRevestida = () => {
    setRevestida((prev) =>
      prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
    );
  };

  const toggleCanje = () => {
    setCanje((prev) =>
      prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
    );
  };

  // Handle regular material items
  const handleAddItem = () => {
    setItems([...items, { detalle: "", cantidad: "", precio: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Handle canje material items
  const handleAddItemCanje = () => {
    setItemsCanje([
      ...itemsCanje,
      { detalleCanje: "", cantidadCanje: "", precioCanje: "" },
    ]);
  };

  const handleItemChangeCanje = (index, field, value) => {
    const updatedItems = [...itemsCanje];
    updatedItems[index][field] = value;
    setItemsCanje(updatedItems);
  };

  const handleRemoveItemCanje = (index) => {
    const updatedItems = itemsCanje.filter((_, i) => i !== index);
    setItemsCanje(updatedItems);
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const totalCanje = itemsCanje.reduce((acc, item) => {
    const cantidad = parseFloat(item.cantidadCanje) || 0;
    const precio = parseFloat(item.precioCanje) || 0;
    return acc + cantidad * precio;
  }, 0);

  return (
    <dialog id="my_modal_actualizar_contrato_revestimiento" className="modal">
      <div className="modal-box rounded-md max-w-full">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Cargar nuevo contrato a revestimiento
        </h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podrás cargar un nuevo contrato a revestimiento.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del contrato.
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Nombre y apellido</label>
              <input
                {...register("nombre_apellido_contrato")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Numero del contrato</label>
              <input
                {...register("numero_contrato")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal"
                placeholder="Escribir el número ej: 333-444..."
              />
            </div>

            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Localidad</label>
              <input
                {...register("localidad_contrato")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
                placeholder="Escribrir la localidad..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Provincia</label>
              <input
                {...register("provincia_contrato")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
                placeholder="Escribrir la provincia..."
              />
            </div>
          </div>

          <div className="mt-5">
            <div className="font-bold mb-2 text-[#FD454D] text-lg">
              Administración datos.
            </div>
            <div className="grid grid-cols-11 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Revestida</label>
                <button
                  type="button"
                  className={`py-2 px-4 text-white text-sm rounded-md ${
                    revestida === "Sí"
                      ? "bg-green-500"
                      : revestida === "No"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                  onClick={toggleRevestida}
                >
                  {revestida}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Canje</label>
                <button
                  type="button"
                  className={`py-2 px-4 text-white text-sm rounded-md ${
                    canje === "Sí"
                      ? "bg-green-500"
                      : canje === "No"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                  onClick={toggleCanje}
                >
                  {canje}
                </button>
              </div>
            </div>

            {/* Regular Materials Section */}
            {revestida === "Sí" && (
              <div className="mt-5">
                <div className="font-bold mb-2 text-[] text-sm">
                  Cargar materiales regulares.
                </div>
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-2 mb-2 items-center"
                  >
                    <input
                      value={item.detalle}
                      onChange={(e) =>
                        handleItemChange(index, "detalle", e.target.value)
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Descripción..."
                    />
                    <input
                      value={item.cantidad}
                      onChange={(e) =>
                        handleItemChange(index, "cantidad", e.target.value)
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Cantidad..."
                    />
                    <div
                      className="w-full items-stretch flex"
                      onClick={handleInputClick}
                    >
                      {isEditable ? (
                        <input
                          value={item.precio}
                          onChange={(e) =>
                            handleItemChange(index, "precio", e.target.value)
                          }
                          type="text"
                          onBlur={() => setIsEditable(false)}
                          className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold w-full"
                          placeholder="Escribir el precio..."
                        />
                      ) : (
                        <p className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold w-full">
                          {formatearDinero(Number(item.precio) || 0)}
                        </p>
                      )}
                    </div>
                    <p
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Escribir el precio..."
                    >
                      {formatearDinero(
                        Number(item.precio * item.cantidad || 0)
                      )}
                    </p>
                    <div>
                      <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-2  hover:bg-red-700 transition-all ease-linear rounded-full"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <AiOutlineDelete className="text-2xl" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="border border-blue-500 px-3 rounded-full text-sm py-1.5 font-semibold hover:bg-blue-100 transition-all flex gap-1 items-center"
                  onClick={handleAddItem}
                >
                  Añadir material regular <IoMdAdd className="text-lg" />
                </button>
              </div>
            )}

            {canje === "Sí" && (
              <div className="font-bold mb-2 text-[#FD454D] text-lg mt-4">
                Cargar materiales en canje y el tipo .
              </div>
            )}

            {canje === "Sí" && (
              <div className="flex flex-col gap-2 w-auto mt-4 items-start">
                <label className="font-bold text-sm">
                  Seleccionar el tipo de canje.
                </label>
                <select
                  {...register("tipo_de_canje")}
                  className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-semibold"
                  placeholder="Escribir el nombre y apellido..."
                >
                  <option className="font-bold text-blue-500" value="">
                    Seleccionar el tipo de canje
                  </option>
                  <option value="contra entrega" className="font-semibold">
                    Contra entrega
                  </option>{" "}
                  <option value="cuotas" className="font-semibold">
                    Cuotas
                  </option>{" "}
                  <option value="cuotas" className="font-semibold">
                    Anexo
                  </option>{" "}
                </select>
              </div>
            )}

            {canje === "Sí" && (
              <div className="mt-5">
                <div className="font-bold mb-2 text-black text-sm">
                  Cargar materiales del canje.
                </div>
                {itemsCanje.map((itemCanje, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <input
                      value={itemCanje.detalleCanje}
                      onChange={(e) =>
                        handleItemChangeCanje(
                          index,
                          "detalleCanje",
                          e.target.value
                        )
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Descripción..."
                    />
                    <input
                      value={itemCanje.cantidadCanje}
                      onChange={(e) =>
                        handleItemChangeCanje(
                          index,
                          "cantidadCanje",
                          e.target.value
                        )
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Cantidad..."
                    />
                    <div
                      className="w-full items-stretch flex"
                      onClick={handleInputClick}
                    >
                      {isEditable ? (
                        <input
                          value={itemCanje.precioCanje}
                          onChange={(e) =>
                            handleItemChangeCanje(
                              index,
                              "precioCanje",
                              e.target.value
                            )
                          }
                          type="text"
                          onBlur={() => setIsEditable(false)}
                          className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold w-full"
                          placeholder="Escribir el total del comprobante..."
                        />
                      ) : (
                        <p className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold w-full">
                          {formatearDinero(Number(itemCanje.precioCanje) || 0)}
                        </p>
                      )}
                    </div>
                    <p
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none uppercase font-semibold placeholder:font-normal"
                      placeholder="Escribir el precio..."
                    >
                      {formatearDinero(
                        Number(
                          itemCanje.precioCanje * itemCanje.cantidadCanje || 0
                        )
                      )}
                    </p>
                    <div>
                      <button
                        type="button"
                        className="bg-red-500 text-white py-2 px-2  hover:bg-red-700 transition-all ease-linear rounded-full"
                        onClick={() => handleRemoveItemCanje(index)}
                      >
                        <AiOutlineDelete className="text-2xl" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="border border-blue-500 px-3 rounded-full text-sm py-1.5 font-semibold hover:bg-blue-100 transition-all flex gap-1 items-center"
                  onClick={handleAddItemCanje}
                >
                  Añadir material canje <IoMdAdd className="text-lg" />
                </button>{" "}
                <div className="mt-5">
                  <h3 className="font-bold">
                    Total Canje{" "}
                    <span className="bg-red-700/80 px-3 py-1 rounded-full text-white shadow-md">
                      {formatearDinero(totalCanje)}
                    </span>
                  </h3>
                </div>
              </div>
            )}

            <div className="mt-10">
              <button className="bg-blue-500 text-white text-sm font-bold py-2 px-6 rounded-md">
                Actualizar el contrato
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};

// const ModalNuevoRegistro = () => {
//   const { register, handleSubmit, reset, watch } = useForm();
//   const [items, setItems] = useState([
//     { detalle: "", cantidad: "", precio: "" },
//   ]);
//   const [itemsCanje, setItemsCanje] = useState([
//     { detalleCanje: "", cantidadCanje: "", precioCanje: "" },
//   ]);

//   const { setCargas } = useCargasContext();
//   const [revestida, setRevestida] = useState("En espera"); // Estado inicial "En espera"
//   const [canje, setCanje] = useState("En espera"); // Estado inicial "En espera"
//   const [mano_de_obra, setManoDeObra] = useState("En espera"); // Estado inicial "En espera"
//   const [ladrillos, setLadrillos] = useState("En espera"); // Estado inicial "En espera"

//   const monto_total = watch("monto_total");

//   const onSubmit = async (formData) => {
//     try {
//       const ordenData = {
//         ...formData,
//         datos: items,
//         revestida: revestida, // Enviar el estado actual
//         canje: canje, // Enviar el estado actual
//         mano_de_obra: mano_de_obra, // Enviar el estado actual
//         ladrillos: ladrillos, // Enviar el estado actual
//       };

//       const res = await client.post("/cargas", ordenData);

//       setCargas(res.data.todasLasCargas);
//       reset();
//       document.getElementById("my_modal_nueva_carga").close();
//       setItems([{ detalle: "", cantidad: "" }]); // Reiniciar el formulario y los items
//       setRevestida("En espera"); // Reiniciar revestida
//       setCanje("En espera"); // Reiniciar canje
//       setManoDeObra("En espera");
//       setLadrillos("En espera");
//     } catch (error) {
//       console.error("Error creating product:", error);
//     }
//   };

//   const toggleRevestida = () => {
//     // Cambiar entre "Sí", "No", "En espera"
//     setRevestida((prev) =>
//       prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
//     );
//   };

//   const toggleCanje = () => {
//     // Cambiar entre "Sí", "No", "En espera"
//     setCanje((prev) =>
//       prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
//     );
//   };

//   // const toggleManoDeObra = () => {
//   //   // Cambiar entre "Sí", "No", "En espera"
//   //   setManoDeObra((prev) =>
//   //     prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
//   //   );
//   // };

//   // const toggleLadrillos = () => {
//   //   // Cambiar entre "Sí" y "No"
//   //   setLadrillos((prev) => (prev === "Sí" ? "No" : "Sí"));
//   // };

//   //AGREGAR MATERIAL SIN CANJE
//   const handleAddItem = () => {
//     setItems([...items, { detalle: "", cantidad: "", precio: "" }]); // Añadir una nueva fila vacía
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...items];
//     updatedItems[index][field] = value; // Actualizar el valor del campo
//     setItems(updatedItems);
//   };

//   const handleRemoveItem = (index) => {
//     const updatedItems = items.filter((_, i) => i !== index); // Remover el item correspondiente
//     setItems(updatedItems);
//   };

//   //CANJE ITEMS
//   const handleAddItemCanje = () => {
//     setItemsCanje([
//       ...items,
//       { detalleCanje: "", cantidadCanje: "", precioCanje: "" },
//     ]); // Añadir una nueva fila vacía
//   };

//   const handleItemChangeCanje = (index, field, value) => {
//     const updatedItems = [...items];
//     updatedItems[index][field] = value; // Actualizar el valor del campo
//     setItemsCanje(updatedItems);
//   };

//   const handleRemoveItemCanje = (index) => {
//     const updatedItems = items.filter((_, i) => i !== index); // Remover el item correspondiente
//     setItemsCanje(updatedItems);
//   };

//   const [isEditable, setIsEditable] = useState(false);

//   const handleInputClick = () => {
//     setIsEditable(true);
//   };

//   return (
//     <dialog id="my_modal_nuevo_contrato_revestimiento" className="modal">
//       <div className="modal-box rounded-md max-w-full">
//         <form method="dialog">
//           <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
//             ✕
//           </button>
//         </form>
//         <h3 className="font-bold text-xl">
//           Cargar nuevo contrato a revestimiento
//         </h3>
//         <p className="py-1 text-sm font-medium">
//           En esta sección podras cargar un nuevo contrato a revestimiento.
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
//           <div className="font-bold mb-2 text-[#FD454D] text-lg">
//             Datos del contrato.
//           </div>
//           <div className="grid grid-cols-4 gap-2">
//             <div className="flex flex-col gap-2 w-auto">
//               <label className="font-bold text-sm">Nombre y apellido</label>
//               <input
//                 {...register("nombre_apellido")}
//                 className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
//                 placeholder="Escribir el nombre y apellido..."
//               />
//             </div>
//             <div className="flex flex-col gap-2 w-auto">
//               <label className="font-bold text-sm">Numero del contrato</label>
//               <input
//                 {...register("numero_contrato")}
//                 className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
//                 placeholder="Escribrir el numero ej: 333-444..."
//               />
//             </div>
//             <div className="flex flex-col gap-2 w-auto">
//               <label className="font-bold text-sm">Localidad</label>
//               <input
//                 {...register("localidad")}
//                 className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
//                 placeholder="Escribrir la localidad..."
//               />
//             </div>
//             <div className="flex flex-col gap-2 w-auto">
//               <label className="font-bold text-sm">Provincia</label>
//               <input
//                 {...register("provincia")}
//                 className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
//                 placeholder="Escribrir la provincia..."
//               />
//             </div>
//           </div>

//           <div className="mt-5">
//             <div className="font-bold mb-2 text-[#FD454D] text-lg">
//               Administración datos.
//             </div>

//             <div className="grid grid-cols-11 gap-4">
//               {/* Revestida */}
//               <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">Revestida</label>
//                 <button
//                   type="button"
//                   className={`py-2 px-4 text-white text-sm rounded-md ${
//                     revestida === "Sí"
//                       ? "bg-green-500"
//                       : revestida === "No"
//                       ? "bg-red-500"
//                       : "bg-orange-500"
//                   }`}
//                   onClick={toggleRevestida}
//                 >
//                   {revestida}
//                 </button>
//               </div>
//               {/* Canje */}
//               <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">Canje</label>
//                 <button
//                   type="button"
//                   className={`py-2 px-4 text-white text-sm rounded-md ${
//                     canje === "Sí"
//                       ? "bg-green-500"
//                       : canje === "No"
//                       ? "bg-red-500"
//                       : "bg-orange-500"
//                   }`}
//                   onClick={toggleCanje}
//                 >
//                   {canje}
//                 </button>
//               </div>{" "}
//               {/* <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">Ladrillos</label>
//                 <button
//                   type="button"
//                   className={`py-2 px-4 text-white text-sm rounded-md ${
//                     ladrillos === "Sí" ? "bg-green-500" : "bg-red-500"
//                   }`}
//                   onClick={toggleLadrillos}
//                 >
//                   {ladrillos}
//                 </button>
//               </div>
//               <div className="flex flex-col gap-2">
//                 <label className="font-bold text-sm">Mano de obra</label>
//                 <button
//                   type="button"
//                   className={`py-2 px-4 text-white text-sm rounded-md ${
//                     mano_de_obra === "Sí"
//                       ? "bg-green-500"
//                       : mano_de_obra === "No"
//                       ? "bg-red-500"
//                       : "bg-orange-500"
//                   }`}
//                   onClick={toggleManoDeObra}
//                 >
//                   {mano_de_obra}
//                 </button>
//               </div> */}
//             </div>
//             {canje === "Sí" && (
//               <div className="flex flex-col gap-2 w-auto mt-4 items-start">
//                 <label className="font-bold text-sm">
//                   Seleccionar el canje
//                 </label>
//                 <select
//                   {...register("tipo_de_canje")}
//                   className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-semibold"
//                   placeholder="Escribir el nombre y apellido..."
//                 >
//                   <option className="font-bold text-blue-500" value="">
//                     Seleccionar el tipo de canje
//                   </option>
//                   <option value="contra entrega" className="font-semibold">
//                     Contra entrega
//                   </option>{" "}
//                   <option value="cuotas" className="font-semibold">
//                     Cuotas
//                   </option>{" "}
//                   <option value="cuotas" className="font-semibold">
//                     Anexo
//                   </option>{" "}
//                 </select>
//               </div>
//             )}
//           </div>

//           {canje === "Sí" && (
//             <div className="mt-5">
//               <div className="font-bold mb-2 text-black text-sm">
//                 Cargar materiales del canje.
//               </div>

//               <div className="">
//                 {itemsCanje.map((itemCanje, index) => (
//                   <div key={index} className="grid grid-cols-5 gap-2">
//                     <div className="flex flex-col gap-2 w-auto p-3 border-r">
//                       <input
//                         value={itemCanje.detalleCanje}
//                         onChange={(e) =>
//                           handleItemChangeCanje(
//                             index,
//                             "detalleCanje",
//                             e.target.value
//                           )
//                         }
//                         className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                         placeholder="Descripción..."
//                       />
//                     </div>
//                     <div className="flex flex-col gap-2 w-auto p-3 border-r">
//                       <input
//                         value={itemCanje.cantidadCanje}
//                         onChange={(e) =>
//                           handleItemChangeCanje(
//                             index,
//                             "cantidadCanje",
//                             e.target.value
//                           )
//                         }
//                         className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                         placeholder="Escribir la cantidad..."
//                       />
//                     </div>

//                     <div
//                       className="flex flex-col gap-2 w-auto p-3 border-r"
//                       onClick={handleInputClick}
//                     >
//                       {isEditable ? (
//                         <input
//                           value={itemCanje.precioCanje}
//                           onChange={(e) =>
//                             handleItemChangeCanje(
//                               index,
//                               "precioCanje",
//                               e.target.value
//                             )
//                           }
//                           type="text"
//                           onBlur={() => setIsEditable(false)}
//                           className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                           placeholder="Escribir el total del comprobante..."
//                         />
//                       ) : (
//                         <p className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase">
//                           {formatearDinero(Number(itemCanje.precioCanje) || 0)}
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex flex-col gap-2 w-auto p-3 border-r">
//                       <p
//                         className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                         placeholder="Escribir el precio..."
//                       >
//                         {formatearDinero(
//                           Number(
//                             itemCanje.precioCanje * itemCanje.cantidadCanje || 0
//                           )
//                         )}
//                       </p>
//                     </div>
//                     <div className="flex items-center">
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveItemCanje(index)}
//                         className="text-red-500 border px-4 rounded-md border-red-500 text-sm py-1 hover:bg-red-50 transition-all font-semibold"
//                       >
//                         <MdDelete className="text-xl" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 type="button"
//                 onClick={handleAddItemCanje}
//                 className="mt-1 font-semibold text-sm text-blue-500 flex gap-1 items-center hover:border hover:border-blue-500 hover:rounded-full border border-transparent transition-all px-3 py-1"
//               >
//                 <span>Añadir</span>{" "}
//                 <IoMdAdd className=" transition-all text-xl" />
//               </button>
//             </div>
//           )}

//           <div className="mt-5">
//             <div className="font-bold mb-2 text-[#FD454D] text-lg">
//               Cargar materiales de revestimiento.
//             </div>

//             <div className="">
//               {items.map((item, index) => (
//                 <div key={index} className="grid grid-cols-5 gap-2">
//                   <div className="flex flex-col gap-2 w-auto p-3 border-r">
//                     <input
//                       value={item.detalle}
//                       onChange={(e) =>
//                         handleItemChange(index, "detalle", e.target.value)
//                       }
//                       className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                       placeholder="Descripción..."
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2 w-auto p-3 border-r">
//                     <input
//                       value={item.cantidad}
//                       onChange={(e) =>
//                         handleItemChange(index, "cantidad", e.target.value)
//                       }
//                       className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                       placeholder="Escribir la cantidad..."
//                     />
//                   </div>

//                   <div
//                     className="flex flex-col gap-2 w-auto p-3 border-r"
//                     onClick={handleInputClick}
//                   >
//                     {isEditable ? (
//                       <input
//                         value={item.precio}
//                         onChange={(e) =>
//                           handleItemChange(index, "precio", e.target.value)
//                         }
//                         type="text"
//                         onBlur={() => setIsEditable(false)}
//                         className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                         placeholder="Escribir el total del comprobante..."
//                       />
//                     ) : (
//                       <p className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase">
//                         {formatearDinero(Number(item.precio) || 0)}
//                       </p>
//                     )}
//                   </div>
//                   {/* <div className="flex flex-col gap-2 w-auto p-3 border-r">
//                     <input
//                       value={item.precio}
//                       onChange={(e) =>
//                         handleItemChange(index, "precio", e.target.value)
//                       }
//                       className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                       placeholder="Escribir el precio..."
//                     />
//                   </div>{" "} */}
//                   <div className="flex flex-col gap-2 w-auto p-3 border-r">
//                     <p
//                       className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                       placeholder="Escribir el precio..."
//                     >
//                       {formatearDinero(
//                         Number(item.precio * item.cantidad || 0)
//                       )}
//                     </p>
//                   </div>
//                   <div className="flex items-center">
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveItem(index)}
//                       className="text-red-500 border px-4 rounded-md border-red-500 text-sm py-1 hover:bg-red-50 transition-all font-semibold"
//                     >
//                       <MdDelete className="text-xl" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button
//               type="button"
//               onClick={handleAddItem}
//               className="mt-1 font-semibold text-sm text-blue-500 flex gap-1 items-center hover:border hover:border-blue-500 hover:rounded-full border border-transparent transition-all px-3 py-1"
//             >
//               <span>Añadir</span>{" "}
//               <IoMdAdd className=" transition-all text-xl" />
//             </button>
//           </div>

//           <div className="mt-5">
//             <div className="font-bold mb-2 text-[#FD454D] text-lg">
//               Contabilidad final.
//             </div>

//             <div className="grid grid-cols-5">
//               <div className="flex flex-col gap-2 w-auto items-start">
//                 <label className="font-bold text-sm">Dinero acumulado</label>
//                 <p className="font-bold text-xl bg-green-500 py-1 px-2 rounded-md text-white">
//                   $125.550
//                 </p>
//                 {/* <input
//                   {...register("monto_total")}
//                   className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
//                   placeholder="Escribir el nombre y apellido..."
//                 />
//                 <div className="flex">
//                   <p className="font-bold bg-blue-500 text-white py-1 px-4 rounded-md">
//                     {formatearDinero(Number(monto_total))}
//                   </p>
//                 </div> */}
//               </div>
//             </div>
//           </div>

//           <div className="mt-6">
//             <button className="font-semibold text-sm bg-[#FD454D] py-1 px-4 rounded-md text-white">
//               Guardar registro
//             </button>
//           </div>
//         </form>
//       </div>
//     </dialog>
//   );
// };

// const ModalEditarRegistro = ({ idObtenida }) => {
//   const { register, handleSubmit, reset } = useForm();
//   const [items, setItems] = useState([{ detalle: "", cantidad: "" }]);

//   const { setCargas } = useCargasContext();

//   const onSubmit = async (formData) => {
//     try {
//       const ordenData = {
//         ...formData,
//         datos: items, // Añadir los items al objeto que envías
//       };

//       const res = await client.put("/cargas", ordenData);

//       setCargas(res.data.todasLasCargas);

//       reset();

//       document.getElementById("my_modal_nueva_carga").close();
//       setItems([{ detalle: "", cantidad: "" }]); // Reiniciar el formulario y los items
//     } catch (error) {
//       console.error("Error creating product:", error);
//     }
//   };

//   const handleAddItem = () => {
//     setItems([...items, { detalle: "", cantidad: "" }]); // Añadir una nueva fila vacía
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...items];
//     updatedItems[index][field] = value; // Actualizar el valor del campo
//     setItems(updatedItems);
//   };

//   const handleRemoveItem = (index) => {
//     const updatedItems = items.filter((_, i) => i !== index); // Remover el item correspondiente
//     setItems(updatedItems);
//   };

//   return (
//     <dialog id="my_modal_nueva_carga" className="modal">
//       <div className="modal-box rounded-md max-w-7xl">
//         <form method="dialog">
//           {/* Si hay un botón en el formulario, cerrará el modal */}
//           <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
//             ✕
//           </button>
//         </form>
//         <h3 className="font-bold text-xl">Cargar nuevo registro</h3>
//         <p className="py-1 text-sm font-medium">
//           En esta sección podras cargar un nuevo registro, de productos, etc.
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
//           <div className="font-bold mb-2 text-[#FD454D] text-lg">
//             Datos del registro.
//           </div>
//           <div className="grid grid-cols-4 gap-2">
//             <div className="flex flex-col gap-2 w-auto">
//               <label className="font-bold text-sm">Nombre y apellido</label>
//               <input
//                 {...register("nombre_apellido")}
//                 className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
//                 placeholder="Escribir el nombre y apellido..."
//               />
//             </div>
//             <div className="flex flex-col gap-2 w-auto">
//               <label className="font-bold text-sm">Numero del remito</label>
//               <input
//                 {...register("numero_remito")}
//                 className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
//                 placeholder="Escribrir el numero ej: 000-00010"
//               />
//             </div>
//             <div className="flex flex-col gap-2 w-auto">
//               <label className="font-bold text-sm">Destino</label>
//               <input
//                 {...register("destino")}
//                 className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
//                 placeholder="Escribrir el desitino Ej: Burzcaco"
//               />
//             </div>
//           </div>
//           <div className="mt-5">
//             <div className="font-bold mb-2 text-[#FD454D] text-lg">
//               Cargar nuevos items del registro.
//             </div>

//             <div className="border">
//               {items.map((item, index) => (
//                 <div key={index} className="grid grid-cols-3 gap-2">
//                   <div className="flex flex-col gap-2 w-auto p-3 border-r">
//                     <input
//                       value={item.detalle}
//                       onChange={(e) =>
//                         handleItemChange(index, "detalle", e.target.value)
//                       }
//                       className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
//                       placeholder="Escribir el detalle del producto..."
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2 w-auto p-3">
//                     {/* <label className="font-bold text-sm">Cantidad</label> */}
//                     <input
//                       value={item.cantidad}
//                       onChange={(e) =>
//                         handleItemChange(index, "cantidad", e.target.value)
//                       }
//                       className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase font-bold"
//                       placeholder="Escribir la cantidad..."
//                     />
//                   </div>
//                   <div className="flex items-center">
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveItem(index)}
//                       className="text-red-500 border px-4 rounded-md border-red-500 text-sm py-1 hover:bg-red-50 transition-all font-semibold"
//                     >
//                       Eliminar
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button
//               type="button"
//               onClick={handleAddItem}
//               className="mt-3 font-semibold text-sm text-blue-500"
//             >
//               Añadir nuevo item
//             </button>
//           </div>
//           <div className="mt-6">
//             <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
//               Guardar registro
//             </button>
//           </div>
//         </form>
//       </div>
//     </dialog>
//   );
// };

// const ModalObservarRegistro = ({ idObtenida }) => {
//   const [carga, setCarga] = useState({});
//   const [parsedDatos, setParsedDatos] = useState([]);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const respuesta = await client.get(`/cargas/${idObtenida}`);
//         console.log("Carga data:", respuesta.data); // Log full carga data

//         setCarga(respuesta.data);

//         // Inspect the raw datos field
//         console.log("Raw datos:", respuesta.data.datos);

//         // Safely parse the 'datos' field
//         try {
//           // Attempt to fix the JSON format if needed
//           const datosFixed = respuesta.data.datos
//             .replace(/\\'/g, "'")
//             .replace(/\\"/g, '"');
//           const datosParsed = JSON.parse(datosFixed || "[]");
//           console.log("Parsed datos:", datosParsed); // Log parsed datos
//           setParsedDatos(datosParsed);
//         } catch (parseError) {
//           console.error("Error parsing datos:", parseError);
//           setParsedDatos([]); // Set to empty array if parsing fails
//         }
//       } catch (error) {
//         console.error("Error fetching carga data:", error);
//       }
//     };

//     loadData();
//   }, [idObtenida]);

//   return (
//     <dialog id="my_modal_ver_registro" className="modal">
//       <div className="modal-box rounded-md max-w-3xl">
//         <form method="dialog">
//           <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
//             ✕
//           </button>
//         </form>
//         <h3 className="font-bold text-xl">
//           Registro obtenido <span className="text-[#FD454D]">{idObtenida}</span>
//         </h3>
//         <p className="py-1 text-sm font-medium">
//           En esta sección podras observar el registro.
//         </p>

//         <div className="mb-4">
//           <p className="font-bold text-lg underline">Datos del registro.</p>
//           <div>
//             <p className="font-semibold uppercase text-sm">
//               Nombre y apellido:{" "}
//               <span className="font-bold text-blue-500">
//                 {carga.nombre_apellido}
//               </span>
//             </p>{" "}
//             <p className="font-semibold uppercase text-sm">
//               Numero del remito:{" "}
//               <span className="font-bold text-blue-500">
//                 N° {carga.numero_remito}
//               </span>
//             </p>{" "}
//             <p className="font-semibold uppercase text-sm">
//               Destino:{" "}
//               <span className="font-bold text-blue-500">{carga.destino}</span>
//             </p>
//           </div>
//         </div>

//         <div className="bg-white">
//           <table className="table">
//             <thead>
//               <tr className="font-extrabold text-sm text-black">
//                 <th>Detalle del producto</th>
//                 <th>Cantidad</th>
//               </tr>
//             </thead>
//             <tbody className="text-xs font-medium capitalize">
//               {parsedDatos.map((dato, index) => (
//                 <tr key={index}>
//                   <th>{dato.detalle}</th>
//                   <th>{dato.cantidad}</th>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-5">
//           <button className="font-bold text-sm bg-blue-500 py-1 px-4 rounded-md text-white shadow">
//             Descargar e imprimir registro
//           </button>
//         </div>
//       </div>
//     </dialog>
//   );
// };

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setRevestimientos } = useRevestimientoContext();

  const onSubmit = async (formData) => {
    try {
      const cargasData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(`/cargas/${idObtenida}`, cargasData);

      setRevestimientos(res.data.todosLosRevestimientos);

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
