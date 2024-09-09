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
                <th>Referencia</th>
                <th>Proveedor</th>
                <th>Localidad/Provincia</th>
                <th>Saldo/Deuda</th>
                <th>Fecha de carga</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium capitalize">
              {filteredData.map((proveedor) => {
                return (
                  <tr key={proveedor.id}>
                    <th>{proveedor.id}</th>
                    <td>{proveedor.proveedor}</td>
                    <td>
                      {proveedor.localidad_proveedor}{" "}
                      {proveedor.provincia_proveedor}
                    </td>
                    <th className="text-[#FD454D]">
                      {formatearDinero(Number(proveedor.saldo))}{" "}
                    </th>
                    <td>{formatearFecha(proveedor.created_at)} </td>
                    <td>
                      <div className="flex">
                        <p
                          className={` ${
                            (proveedor.saldo > 0 &&
                              "bg-[#FD454D] text-white rounded-md") ||
                            (proveedor.saldo <= 0 &&
                              "bg-blue-600 text-white rounded-md")
                          }  py-1 px-2`}
                        >
                          {(proveedor.saldo > 0 && "Con deuda") ||
                            (proveedor.saldo <= 0 && "Sin deuda")}
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
                          <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                            <Link to={`/proveedor/${proveedor.id}`}>
                              Observar proveedor
                            </Link>
                          </li>
                          <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                            <button
                              onClick={() => {
                                handleObtenerId(proveedor.id),
                                  document
                                    .getElementById(
                                      "my_modal_actualizar_proveedor"
                                    )
                                    .showModal();
                              }}
                            >
                              Actualizar proveedor
                            </button>
                          </li>
                          <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                            <button
                              onClick={() => {
                                handleObtenerId(proveedor.id),
                                  document
                                    .getElementById("my_modal_eliminar")
                                    .showModal();
                              }}
                            >
                              Eliminar proveedor
                            </button>
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

      <ModalEliminar idObtenida={idObtenida} />
      <ModalCargarProveedor />
      <ModalActualizarProveedor idObtenida={idObtenida} />
    </section>
  );
};

const ModalCargarProveedor = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const { setProveedores } = useProveedoresContext();

  const onSubmit = async (formData) => {
    try {
      const proveedoresData = {
        ...formData,
      };

      const res = await client.post("/proveedores", proveedoresData);

      setProveedores(res.data.todosLosProveedores);

      toast.success("¡Proveedor cargado correctamente!", {
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

      document.getElementById("my_modal_cargar_proveedor").close();

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

//actualizar proveedor
const ModalActualizarProveedor = ({ idObtenida }) => {
  const { register, handleSubmit, setValue, watch } = useForm();

  useEffect(() => {
    const obtenerContrato = async () => {
      const res = await client.get(`/proveedores/${idObtenida}`);
      setValue("proveedor", res.data.proveedor);
      setValue("localidad_proveedor", res.data.localidad_proveedor);
      setValue("provincia_proveedor", res.data.provincia_proveedor);
      setValue("telefono", res.data.telefono);
      setValue("email", res.data.email);
      setValue("saldo", res.data.saldo);
    };
    obtenerContrato();
  }, [idObtenida]);

  const { setProveedores } = useProveedoresContext();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
      };

      const res = await client.put(`/proveedores/${idObtenida}`, ordenData);

      setProveedores(res.data.todosLosProveedores);

      toast.success("¡Proveedor actualizado correctamente!", {
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

      document.getElementById("my_modal_actualizar_proveedor").close();
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
    <dialog id="my_modal_actualizar_proveedor" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Actualizar el proveedor con referencia {idObtenida}{" "}
        </h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras actualizar el proveedor.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del proveedor.
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
              <label className="font-bold text-sm">Localidad</label>
              <input
                {...register("localidad_proveedor")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir la localidad..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Provincia</label>
              <input
                {...register("provincia_proveedor")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir la provincia..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Telefono</label>
              <input
                {...register("telefono")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el telefono..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Email</label>
              <input
                {...register("email")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
                placeholder="Escribir el email..."
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
              Actualizar proveedor
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setProveedores } = useProveedoresContext();

  const onSubmit = async (formData) => {
    try {
      const proveedoresData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(
        `/proveedores/${idObtenida}`,
        proveedoresData
      );

      setProveedores(res.data.todosLosProveedores);

      toast.error("¡Proveedor eliminado correctamente!", {
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
            Eliminar el proveedor cargado..
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">
            El proveedor no podra ser recuperado nunca mas y perderas ordenes,
            todo lo cargado...
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
