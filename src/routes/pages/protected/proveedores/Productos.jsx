import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaList, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useProveedoresContext } from "../../../../context/ProveedoresContext";
import { formatearFecha } from "../../../../helpers/formatearFecha";
import { toast } from "react-toastify";
import { useObtenerId } from "../../../../helpers/useObtenerId";
import io from "socket.io-client";
import client from "../../../../api/axios";
import { formatearDinero } from "../../../../helpers/formatearDinero";

export const Productos = () => {
  const [searchTermCliente, setSearchTermCliente] = useState("");

  const { proveedores } = useProveedoresContext();

  const { handleObtenerId, idObtenida } = useObtenerId();

  const handleSearchClienteChange = (e) => {
    setSearchTermCliente(e.target.value);
  };

  // Filtrar por término de búsqueda, sucursal seleccionada y tipo de plan seleccionado
  let filteredData = proveedores.filter((proveedor) => {
    const matchesSearchTerm = proveedor.proveedor
      .toLowerCase()
      .includes(searchTermCliente.toLowerCase());

    return matchesSearchTerm;
  });

  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">Sector de productos compras.</p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_cargar_proveedor").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-blue-600 text-white py-2 rounded-md px-2 hover:bg-blue-700 transition-all"
          >
            Cargar nuevo producto para compras
            <FaChevronDown />
          </button>
        </div>
      </div>
      <div className="bg-white w-full min-h-screen max-w-full h-full px-10 py-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium flex items-center hover:border-blue-600">
              <FaSearch className="text-gray-400" />
              <input
                value={searchTermCliente}
                onChange={handleSearchClienteChange}
                className="text-sm outline-none w-full px-2"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 z-0">
          <table className="table">
            <thead>
              <tr className="font-extrabold text-sm text-black">
                <th>Codigo</th>
                <th>Detalle</th>
                <th>Categoria</th>
                <th>Precio Und</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium capitalize">
              {filteredData.map((proveedor) => {
                return (
                  <tr key={proveedor.id}>
                    <th>{proveedor.id}</th>

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
                        ></ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ModalCargarProducto />
      </div>
    </section>
  );
};

const ModalCargarProducto = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const { setProductos } = useProveedoresContext();

  const onSubmit = async (formData) => {
    try {
      const productosData = {
        ...formData,
      };

      const res = await client.post("/productos", productosData);

      setProductos(res.data.todosLosProductos);

      toast.success("¡Producto cargado correctamente!", {
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

      document.getElementById("my_modal_cargar_producto").close();

      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  const haber = watch("saldo");

  return (
    <dialog id="my_modal_cargar_proveedor" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar nuevo producto de compra</h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras cargar nuevo producto de compra.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del producto.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Proveedor</label>
              <input
                {...register("proveedor")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el nombre y apellido..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Saldo actual</label>
              <div className="border px-2 py-1.5 text-sm text-gray-700 rounded-md hover:border-blue-600 flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-8 border-r px-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <div onClick={handleInputClick}>
                  {isEditable ? (
                    <input
                      type="text"
                      {...register("saldo")}
                      onBlur={() => setIsEditable(false)}
                      className="outline-none"
                      placeholder="Escribir el haber, lo que debemos..."
                    />
                  ) : (
                    <p className="font-bold">
                      {formatearDinero(Number(haber) || 0)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white"
            >
              Cargar el producto
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
