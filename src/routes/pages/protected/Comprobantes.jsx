import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaList, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useProveedoresContext } from "../../../context/ProveedoresContext";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { toast } from "react-toastify";
import FileDrop from "../../../components/FileDrop"; // Componente para cargar archivos
import io from "socket.io-client";
import client from "../../../api/axios";
import { tiposDePagos } from "../../../helpers/tiposDePago";
import axios from "axios";

export const Comprobantes = () => {
  const { proveedores } = useProveedoresContext();

  const { handleObtenerId, idObtenida } = useObtenerId();
  // Obtener el primer día del mes actual
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  // Estado inicial de las fechas con el rango del mes actual
  const [fechaInicio, setFechaInicio] = useState(fechaInicioPorDefecto);
  const [fechaFin, setFechaFin] = useState(fechaFinPorDefecto);
  const [filteredData, setFilteredData] = useState([]);

  const handleFechaInicioChange = (e) => {
    setFechaInicio(e.target.value);
  };

  const handleFechaFinChange = (e) => {
    setFechaFin(e.target.value);
  };

  const [searchTermCliente, setSearchTermCliente] = useState("");

  const handleSearchClienteChange = (e) => {
    setSearchTermCliente(e.target.value);
  };

  // Efecto para aplicar filtros cuando cambian los proveedores, el término de búsqueda o las fechas
  useEffect(() => {
    let comprobantes = proveedores.flatMap((proveedor) => {
      return proveedor.comprobantes ? JSON.parse(proveedor.comprobantes) : [];
    });

    let filteredByProveedor = comprobantes.filter((comprobante) => {
      return comprobante.proveedor
        .toLowerCase()
        .includes(searchTermCliente.toLowerCase());
    });

    // Ordenar por fecha de mayor a menor
    filteredByProveedor.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaB - fechaA; // Ordena de mayor a menor (fecha más reciente primero)
    });

    // Aplicar filtro por fecha si están definidas
    if (fechaInicio && fechaFin) {
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);

      filteredByProveedor = filteredByProveedor.filter((comprobante) => {
        const fechaOrden = new Date(comprobante.fecha);
        return fechaOrden >= fechaInicioObj && fechaOrden <= fechaFinObj;
      });
    }

    // Actualizar estado con los datos filtrados
    setFilteredData(filteredByProveedor);
  }, [proveedores, searchTermCliente, fechaInicio, fechaFin]);

  const [isModalVisible, setModalVisible] = useState(false); // Estado para la visibilidad del modal
  const [selectedImage, setSelectedImage] = useState(null); // Estado para la imagen seleccionada

  // Abre el modal y establece la imagen seleccionada
  const handleViewImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">Cargar nuevos comprobantes.</p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_nuevo_comprobante").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-blue-600 text-white py-2 rounded-md px-2 hover:bg-blue-700 transition-all"
          >
            Cargar nuevo comprobante de pago
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

          <div className="flex gap-2 items-center font-bold text-blue-500">
            <div className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium flex items-center hover:border-blue-600">
              <input
                value={fechaInicio}
                onChange={handleFechaInicioChange}
                type="date"
                className="outline-none text-slate-600 w-full text-sm font-semibold uppercase bg-white"
                placeholder="Fecha de inicio"
              />
            </div>

            <div className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium flex items-center hover:border-blue-600">
              <input
                value={fechaFin}
                onChange={handleFechaFinChange}
                type="date"
                className="outline-none text-slate-600 w-full text-sm font-semibold uppercase bg-white"
                placeholder="Fecha fin"
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
                <th>Fecha de carga</th>
                <th>Total del comprobante</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium capitalize">
              {filteredData.map((comprobante) => {
                return (
                  <tr key={comprobante.id}>
                    <th>{comprobante.id}</th>
                    <td>{comprobante.proveedor}</td>
                    <td>{formatearFecha(comprobante.fecha)}</td>
                    <th className="text-[#FD454D]">
                      {formatearDinero(Number(comprobante.total))}
                    </th>
                    <td>
                      <div className="flex">
                        <button
                          onClick={() =>
                            handleViewImage(comprobante.comprobante)
                          } // Abre el modal con la imagen
                          type="button"
                          className="bg-blue-600 text-white py-1 px-2 rounded-md"
                        >
                          Ver comprobante
                        </button>
                      </div>
                    </td>
                    {/* <td>
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
                            <button
                              onClick={() => {
                                handleObtenerId(comprobante.id),
                                  document
                                    .getElementById("my_modal_eliminar")
                                    .showModal();
                              }}
                            >
                              Eliminar comprobante
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ModalEliminar idObtenida={idObtenida} />
      <ModalCargarComprobante />
      <ImageModal
        isVisible={isModalVisible}
        onClose={handleCloseModal} // Cierra el modal
        imageUrl={selectedImage} // URL de la imagen seleccionada
      />
      {/* <ModalCargarProveedor />
      <ModalActualizarProveedor idObtenida={idObtenida} /> */}
    </section>
  );
};

const ModalCargarComprobante = () => {
  const { register, handleSubmit, reset, watch } = useForm();

  const total = watch("total");
  const tipo_pago = watch("tipo_pago");
  const proveedor_seleccionado = watch("proveedor");

  const { setProveedores, proveedor, setProveedor, proveedores } =
    useProveedoresContext();

  useEffect(() => {
    const obtenerDatos = async () => {
      const res = await client.get(
        `/proveedores-proveedor/${proveedor_seleccionado}`
      );
      setProveedor(res.data);
    };
    obtenerDatos();
  }, [proveedor_seleccionado]);

  console.log(proveedor);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("nuevo-comprobante", (nuevoComprobante) => {
      setProveedores(nuevoComprobante);
    });

    return () => newSocket.close();
  }, []);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const uploadFile = async (file) => {
    if (!file) {
      return null;
    }

    const data = new FormData();
    data.append("file", file);

    // Set the upload preset based on the file type
    const uploadPreset = file.type.startsWith("image/")
      ? "imagenes"
      : "documentos";
    data.append("upload_preset", uploadPreset);

    try {
      const api = `https://api.cloudinary.com/v1_1/doguyttkd/${
        file.type.startsWith("image/") ? "image" : "raw"
      }/upload`;
      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const onSubmit = async (formData) => {
    try {
      const archivo_imagen = await uploadFile(uploadedFile);

      // Creamos el objeto del producto con todos los datos y la URL de la imagen
      const proveedorData = {
        comprobante: {
          tipo_pago: tipo_pago,
          total: total,
          proveedor: proveedor.proveedor,
          localidad: proveedor.localidad_proveedor,
          provincia: proveedor.localidad_provincia,
          comprobante: archivo_imagen,
        },
        ...formData,
      };

      const res = await client.post(
        `/proveedores/${proveedor.id}/comprobantes`,
        proveedorData
      );

      setProveedor(res.data.proveedorActualizado);

      if (socket) {
        socket.emit("nuevo-comprobante", res?.data?.todosLosProveedores);
      }

      toast.success("¡Comprobante creado correctamente!", {
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

      document.getElementById("my_modal_nuevo_comprobante").close();

      setUploadedFile(null);
      reset();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setDragging(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = () => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_nuevo_comprobante" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar nuevo comprobante</h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras cargar un nuevo comprobante para descontar la
          deuda del proveedor, etc.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos del comprobante.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Total del comprobante</label>
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
                      {...register("total")}
                      onBlur={() => setIsEditable(false)}
                      className="outline-none"
                      placeholder="Escribir el total del comprobante..."
                    />
                  ) : (
                    <p className="font-bold">
                      {formatearDinero(Number(total) || 0)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">
                Seleccionar tipo de pago
              </label>
              <select
                {...register("tipo_pago")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md focus:border-blue-600 outline-none capitalize"
              >
                <option className="font-bold text-blue-600">
                  Seleccionar tipo de pago
                </option>
                {tiposDePagos.map((t) => (
                  <option className="font-semibold" key={t.id} value={t.nombre}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">
                Proveedor del comprobante
              </label>
              <select
                {...register("proveedor")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md focus:border-blue-600 outline-none capitalize"
              >
                <option className="font-bold text-blue-600">
                  Seleccionar el proveedor
                </option>
                {proveedores.map((t) => (
                  <option
                    className="font-semibold"
                    key={t.id}
                    value={t.proveedor}
                  >
                    {t.proveedor}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <FileDrop
            dragging={dragging}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileChange={handleFileChange}
            handleRemoveFile={handleRemoveFile}
            setDragging={setDragging}
            setUploadedFile={setUploadedFile}
            uploadedFile={uploadedFile}
          />

          <div className="mt-6">
            <button
              type="submit"
              className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white"
            >
              Guardar comprobante
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida, proveedorId }) => {
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
        `/proveedores/${proveedorId}/comprobantes/${idObtenida}`,
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

const ImageModal = ({ isVisible, onClose, imageUrl }) => {
  if (!isVisible) return null; // Si el modal no está visible, no renderizar nada

  const handleClickOutside = (event) => {
    // Cierra el modal si haces clic fuera del contenido
    onClose();
  };

  const handleContentClick = (event) => {
    // Evitar la propagación del clic para no cerrar el modal cuando haces clic en el contenido
    event.stopPropagation();
  };

  return (
    <div
      onClick={handleClickOutside} // Cierra el modal al hacer clic fuera
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div onClick={handleContentClick} className="relative p-5">
        {imageUrl && imageUrl.toLowerCase().endsWith(".pdf") ? (
          // Si la URL termina en ".pdf", mostrar el archivo PDF en un iframe
          <iframe
            src={imageUrl}
            title="Archivo PDF"
            className="w-[1220px] h-screen"
          />
        ) : (
          // Si no, mostrar la imagen
          <img src={imageUrl} alt="Comprobante" className="w-full h-auto" />
        )}
      </div>
    </div>
  );
};
