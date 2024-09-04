import { useState } from "react";
import { useForm } from "react-hook-form";

export const Cargas = () => {
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
      <ModalNuevoRegistro />
    </section>
  );
};

const ModalNuevoRegistro = () => {
  const { register, handleSubmit, reset } = useForm();
  const [items, setItems] = useState([{ detalle: "", cantidad: "" }]);

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
        items: items, // Añadir los items al objeto que envías
      };

      const res = await client.post("/contratos", ordenData);

      reset();
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

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                <div className="flex flex-col gap-2 w-auto">
                  <label className="font-bold text-sm">
                    Detalle del producto
                  </label>
                  <input
                    value={item.detalle}
                    onChange={(e) =>
                      handleItemChange(index, "detalle", e.target.value)
                    }
                    className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                    placeholder="Escribir el detalle del producto..."
                  />
                </div>
                <div className="flex flex-col gap-2 w-auto">
                  <label className="font-bold text-sm">Cantidad</label>
                  <input
                    value={item.cantidad}
                    onChange={(e) =>
                      handleItemChange(index, "cantidad", e.target.value)
                    }
                    className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-auto"
                    placeholder="Escribir la cantidad..."
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

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
