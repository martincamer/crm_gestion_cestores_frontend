import { useEffect, useState } from "react";
import { useCargasContext } from "../../../context/CargasContext";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { FaSearch } from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import client from "../../../api/axios";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

export const Revestimiento = () => {
  const { cargas } = useCargasContext();
  const { handleObtenerId, idObtenida } = useObtenerId();

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
            className="flex gap-2 items-center font-semibold text-sm bg-[#FD454D] hover:bg-[#ef4242] text-white py-2 rounded-md px-2 transition-all"
          >
            Cargar nuevo contrato a revestimiento
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center bg-white px-10 pt-10"></div>
      <div className="bg-white px-10 py-5">
        <table className="table">
          <thead>
            <tr className="font-extrabold text-sm text-black">
              <th>Referencia</th>
              <th>Nombre y apellido</th>
              <th>Destino</th>
              <th>Numero remito</th>
              <th>Fecha de carga</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium capitalize"></tbody>
        </table>
      </div>
      <ModalNuevoRegistro />
      <ModalEliminar idObtenida={idObtenida} />
    </section>
  );
};

const ModalNuevoRegistro = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [items, setItems] = useState([{ detalle: "", cantidad: "" }]);
  const { setCargas } = useCargasContext();
  const [revestida, setRevestida] = useState("En espera"); // Estado inicial "En espera"
  const [canje, setCanje] = useState("En espera"); // Estado inicial "En espera"
  const [mano_de_obra, setManoDeObra] = useState("En espera"); // Estado inicial "En espera"
  const [ladrillos, setLadrillos] = useState("En espera"); // Estado inicial "En espera"

  const monto_total = watch("monto_total");

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
        datos: items,
        revestida: revestida, // Enviar el estado actual
        canje: canje, // Enviar el estado actual
        mano_de_obra: mano_de_obra, // Enviar el estado actual
        ladrillos: ladrillos, // Enviar el estado actual
      };

      const res = await client.post("/cargas", ordenData);

      setCargas(res.data.todasLasCargas);
      reset();
      document.getElementById("my_modal_nueva_carga").close();
      setItems([{ detalle: "", cantidad: "" }]); // Reiniciar el formulario y los items
      setRevestida("En espera"); // Reiniciar revestida
      setCanje("En espera"); // Reiniciar canje
      setManoDeObra("En espera");
      setLadrillos("En espera");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const toggleRevestida = () => {
    // Cambiar entre "Sí", "No", "En espera"
    setRevestida((prev) =>
      prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
    );
  };

  const toggleCanje = () => {
    // Cambiar entre "Sí", "No", "En espera"
    setCanje((prev) =>
      prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
    );
  };

  const toggleManoDeObra = () => {
    // Cambiar entre "Sí", "No", "En espera"
    setManoDeObra((prev) =>
      prev === "En espera" ? "Sí" : prev === "Sí" ? "No" : "En espera"
    );
  };

  const toggleLadrillos = () => {
    // Cambiar entre "Sí" y "No"
    setLadrillos((prev) => (prev === "Sí" ? "No" : "Sí"));
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

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

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
          En esta sección podras cargar un nuevo contrato a revestimiento.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del contrato.
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Nombre y apellido</label>
              <input
                {...register("nombre_apellido")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
                placeholder="Escribir el nombre y apellido..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Numero del contrato</label>
              <input
                {...register("numero_contrato")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
                placeholder="Escribrir el numero ej: 333-444..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Localidad</label>
              <input
                {...register("localidad")}
                className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
                placeholder="Escribrir la localidad..."
              />
            </div>
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Provincia</label>
              <input
                {...register("provincia")}
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
              {/* Revestida */}
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
              {/* Canje */}
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
              </div>{" "}
              {/* <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Ladrillos</label>
                <button
                  type="button"
                  className={`py-2 px-4 text-white text-sm rounded-md ${
                    ladrillos === "Sí" ? "bg-green-500" : "bg-red-500"
                  }`}
                  onClick={toggleLadrillos}
                >
                  {ladrillos}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">Mano de obra</label>
                <button
                  type="button"
                  className={`py-2 px-4 text-white text-sm rounded-md ${
                    mano_de_obra === "Sí"
                      ? "bg-green-500"
                      : mano_de_obra === "No"
                      ? "bg-red-500"
                      : "bg-orange-500"
                  }`}
                  onClick={toggleManoDeObra}
                >
                  {mano_de_obra}
                </button>
              </div> */}
            </div>
            {canje === "Sí" && (
              <div className="flex flex-col gap-2 w-auto mt-4 items-start">
                <label className="font-bold text-sm">
                  Seleccionar el canje
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
          </div>

          <div className="mt-5">
            <div className="font-bold mb-2 text-[#FD454D] text-lg">
              Cargar materiales de revestimiento.
            </div>

            <div className="">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-2">
                  <div className="flex flex-col gap-2 w-auto p-3 border-r">
                    <input
                      value={item.detalle}
                      onChange={(e) =>
                        handleItemChange(index, "detalle", e.target.value)
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
                      placeholder="Descripción..."
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-auto p-3 border-r">
                    <input
                      value={item.cantidad}
                      onChange={(e) =>
                        handleItemChange(index, "cantidad", e.target.value)
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
                      placeholder="Escribir la cantidad..."
                    />
                  </div>

                  <div
                    className="flex flex-col gap-2 w-auto p-3 border-r"
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
                        className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
                        placeholder="Escribir el total del comprobante..."
                      />
                    ) : (
                      <p className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase">
                        {formatearDinero(Number(item.precio) || 0)}
                      </p>
                    )}
                  </div>
                  {/* <div className="flex flex-col gap-2 w-auto p-3 border-r">
                    <input
                      value={item.precio}
                      onChange={(e) =>
                        handleItemChange(index, "precio", e.target.value)
                      }
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
                      placeholder="Escribir el precio..."
                    />
                  </div>{" "} */}
                  <div className="flex flex-col gap-2 w-auto p-3 border-r">
                    <p
                      className="border-b px-2 py-1.5 text-sm text-gray-700 outline-none  w-auto uppercase"
                      placeholder="Escribir el precio..."
                    >
                      {formatearDinero(
                        Number(item.precio * item.cantidad || 0)
                      )}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 border px-4 rounded-md border-red-500 text-sm py-1 hover:bg-red-50 transition-all font-semibold"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-1 font-semibold text-sm text-blue-500 flex gap-1 items-center hover:border hover:border-blue-500 hover:rounded-full border border-transparent transition-all px-3 py-1"
            >
              <span>Añadir</span>{" "}
              <IoMdAdd className=" transition-all text-xl" />
            </button>
          </div>

          <div className="mt-5">
            <div className="font-bold mb-2 text-[#FD454D] text-lg">
              Administración contable.
            </div>

            <div className="grid grid-cols-5">
              <div className="flex flex-col gap-2 w-auto">
                <label className="font-bold text-sm">Dinero</label>
                <input
                  {...register("monto_total")}
                  className="border-b border-gray-300 px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none  w-auto font-normal "
                  placeholder="Escribir el nombre y apellido..."
                />
                <div className="flex">
                  <p className="font-bold bg-blue-500 text-white py-1 px-4 rounded-md">
                    {formatearDinero(Number(monto_total))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="font-semibold text-sm bg-[#FD454D] py-1 px-4 rounded-md text-white">
              Guardar registro
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEditarRegistro = ({ idObtenida }) => {
  const { register, handleSubmit, reset } = useForm();
  const [items, setItems] = useState([{ detalle: "", cantidad: "" }]);

  const { setCargas } = useCargasContext();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
        datos: items, // Añadir los items al objeto que envías
      };

      const res = await client.put("/cargas", ordenData);

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
            <div className="flex flex-col gap-2 w-auto">
              <label className="font-bold text-sm">Destino</label>
              <input
                {...register("destino")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                placeholder="Escribrir el desitino Ej: Burzcaco"
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
            </p>{" "}
            <p className="font-semibold uppercase text-sm">
              Destino:{" "}
              <span className="font-bold text-blue-500">{carga.destino}</span>
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
