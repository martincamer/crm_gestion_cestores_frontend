import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaList, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useProveedoresContext } from "../../../../context/ProveedoresContext";
import { formatearFecha } from "../../../../helpers/formatearFecha";
import { useObtenerId } from "../../../../helpers/useObtenerId";
import { formatearDinero } from "../../../../helpers/formatearDinero";
import { toast } from "react-toastify";
import { tiposDePagos } from "../../../../helpers/tiposDePago";
import FileDrop from "../../../../components/FileDrop";
import io from "socket.io-client";
import client from "../../../../api/axios";
import axios from "axios";

export const OrdenesCompra = () => {
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
    let ordenes = proveedores.flatMap((proveedor) => {
      return proveedor.ordenes ? JSON.parse(proveedor.ordenes) : [];
    });

    let filteredByProveedor = ordenes.filter((comprobante) => {
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
        <p className="font-bold text-xl">Cargar nuevas ordenes de compra.</p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_nuevo_comprobante").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-blue-600 text-white py-2 rounded-md px-2 hover:bg-blue-700 transition-all"
          >
            Cargar nueva orden de compra
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
                <th>Total de la orden</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-xs font-medium capitalize">
              {filteredData.map((orden) => {
                return (
                  <tr key={orden.id}>
                    <th>{orden.id}</th>
                    <td>{orden.proveedor}</td>
                    <td>{formatearFecha(orden.fecha)}</td>
                    <th className="text-[#FD454D]">
                      {formatearDinero(Number(orden.total))}
                    </th>
                    <td>
                      <div className="flex">
                        <button
                          onClick={() => handleViewImage(orden.comprobante)} // Abre el modal con la imagen
                          type="button"
                          className="bg-blue-600 text-white py-1 px-2 rounded-md"
                        >
                          Ver orden
                        </button>
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

  const [productoSeleccionado, setProductoSeleccionado] = useState([]);

  const total = watch("total");
  const tipo_pago = watch("tipo_pago");
  const proveedor_seleccionado = watch("proveedor");

  const addToProductos = (
    id,
    detalle,
    categoria,
    precio_und,
    cantidad,
    totalFinal,
    totalFinalIva,
    iva,
    cantidadFaltante
  ) => {
    const newProducto = {
      id,
      detalle,
      categoria,
      precio_und,
      cantidad,
      totalFinal,
      totalFinalIva,
      iva,
      cantidadFaltante: 0,
    };

    const productoSeleccionadoItem = productoSeleccionado.find((item) => {
      return item.id === id;
    });

    document
      .getElementById("my_modal_producto_seleccionado_en_actualizar")
      .close();
    document.getElementById("my_modal_producto_compra_en_actualizar").close();

    if (productoSeleccionadoItem) {
      setTimeout(() => {
        // setErrorProducto(false);
      }, 2000);
      setErrorProducto(true);
    } else {
      setProductoSeleccionado([...productoSeleccionado, newProducto]);
      // setErrorProducto(false);
    }
  };

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
        `/proveedores/${proveedor.id}/ordenes`,
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
      <div className="modal-box rounded-md max-w-full scroll-bar">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar nueva factura.</h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras cargar una nueva factura de compra.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="font-bold mb-2 text-[#FD454D] text-lg">
            Datos de la factura.
          </div>

          <div className="flex justify-between items-center">
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
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Numero de la factura</label>
              <div className="flex gap-2">
                <input
                  {...register("numero")}
                  className="border px-2 py-1.5 text-sm text-gray-700 rounded-md focus:border-blue-600 outline-none capitalize"
                />
                {" - "}
                <input
                  {...register("numero")}
                  className="border px-2 py-1.5 text-sm text-gray-700 rounded-md focus:border-blue-600 outline-none capitalize"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 max-md:flex-col mt-4">
            <button
              onClick={() =>
                document
                  .getElementById("my_modal_producto_compra_en_actualizar")
                  .showModal()
              }
              type="button"
              className="bg-primary font-semibold text-white py-1 px-6 rounded text-sm max-md:py-2"
            >
              Cargar nuevo producto
            </button>
            <button
              onClick={() =>
                document.getElementById("my_modal_crear_producto").showModal()
              }
              type="button"
              className="bg-blue-500 font-semibold text-white py-1.5 px-6 rounded text-sm max-md:py-2"
            >
              Crear producto inexistente
            </button>
          </div>

          <div className="max-md:overflow-x-auto pb-6">
            <table className="table">
              <thead className="font-bold text-gray-900 text-sm">
                <tr>
                  <th>Detalle</th>
                  <th>Categoria</th>
                  <th>Precio Und</th>
                  <th>Total</th>
                  <th>Iva Seleccionado</th>
                  <th>Total final con iva</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="text-xs uppercase font-medium">
                {productoSeleccionado.map((p) => (
                  <tr key={p.id}>
                    <td>{p.detalle}</td>
                    <td>{p.categoria}</td>
                    <td className="font-bold text-primary">
                      {Number(p.precio_und).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </td>
                    <td className="font-bold text-gray-900">
                      {Number(p.totalFinal).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </td>
                    <td>
                      {(p.iva === 1.105 && "IVA DEL 10.05") ||
                        (p.iva === 1.21 && "IVA DEL 21.00") ||
                        (p.iva === 0 && "NO TIENE IVA")}
                    </td>
                    <td>
                      <div className="flex">
                        <p className="bg-primary py-1 px-2 rounded-md text-white font-bold">
                          {Number(p.totalFinalIva).toLocaleString("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          })}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <FaEdit
                          onClick={() => {
                            handleObtenerId(p.id),
                              document
                                .getElementById(
                                  "my_modal_actualizar_producto_en_actualizar"
                                )
                                .showModal();
                          }}
                          className="text-xl cursor-pointer text-blue-600"
                        />
                        <FaDeleteLeft
                          onClick={() => deleteProducto(p.id)}
                          className="text-xl cursor-pointer text-red-500"
                        />
                      </div>
                    </td>
                    {/* <td className="hidden">
                      <div className="dropdown dropdown-left z-1">
                        <div
                          tabIndex={0}
                          role="button"
                          className="hover:bg-slate-100 rounded-full px-2 py-2 transition-all"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-7 h-7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                            />
                          </svg>
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content z-[1] menu p-2 shadow-lg border bg-base-100 rounded-box w-52 gap-2"
                        >
                          <li>
                            <span
                              onClick={() => {
                                handleID(p.id), openProductoEditar();
                              }}
                              className="bg-green-500/90 font-semibold text-white py-2 px-6 rounded-full  text-sm flex justify-between hover:bg-green-500"
                            >
                              EDITAR
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </span>
                          </li>
                          <li>
                            <span
                              onClick={() => deleteProducto(p.id)}
                              className="bg-red-500/90 font-semibold text-white py-2 px-6 rounded-full  text-sm flex justify-between hover:bg-red-500"
                            >
                              ELIMINAR
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
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
        <ModalCargarProductoCompra addToProductos={addToProductos} />
        <ModalEditarProductoOrdenCompra
          idObtenida={idObtenida}
          productoSeleccionado={productoSeleccionado}
          setProductoSeleccionado={setProductoSeleccionado}
        />
      </div>
    </dialog>
  );
};

export const ModalEditarProductoOrdenCompra = ({
  idObtenida,
  productoSeleccionado,
  setProductoSeleccionado,
}) => {
  const [precio_und, setPrecio] = useState(0);
  const [categoria, setCategorias] = useState("");
  const [detalle, setDetalle] = useState("");
  const [cantidad, setCantidad] = useState(0);
  const [iva, setIva] = useState(0);

  const { productos, setProductos } = useProductosContext();

  useEffect(() => {
    // Buscar el cliente seleccionado dentro de datosCliente
    const clienteEncontrado = productoSeleccionado.find(
      (cliente) => cliente.id === idObtenida
    );

    // Si se encuentra el cliente, establecer los valores de los campos del formulario
    if (clienteEncontrado) {
      setPrecio(clienteEncontrado.precio_und);
      setCantidad(clienteEncontrado.cantidad);
      setCategorias(clienteEncontrado.categoria);
      setDetalle(clienteEncontrado.detalle);
      setIva(clienteEncontrado.iva);
    }
  }, [idObtenida, productoSeleccionado]);

  const handleCliente = () => {
    const totalFinal = precio_und * cantidad;
    const totalFinalIva =
      Number(iva) === 0
        ? Number(precio_und * cantidad)
        : Number(precio_und * cantidad * iva);

    // Crear un nuevo objeto de cliente con los datos actualizados
    const clienteActualizado = {
      id: idObtenida,
      detalle,
      categoria,
      precio_und,
      cantidad,
      totalFinal,
      totalFinalIva,
      iva,
      cantidadFaltante: 0,
    };

    // Actualizar la lista de clientes con los datos actualizados
    const datosClienteActualizados = productoSeleccionado.map(
      (clienteExistente) => {
        if (clienteExistente.id === idObtenida) {
          return clienteActualizado;
        }
        return clienteExistente;
      }
    );

    // Actualizar el estado con la lista de clientes actualizada
    setProductoSeleccionado(datosClienteActualizados);

    document.getElementById("my_modal_actualizar_producto").close();
  };

  const handleSubmitPrecioUnd = async () => {
    try {
      const res = await client.put(
        `/editar-producto/precio-detalle/${detalle}`,
        {
          precio_und,
        }
      );

      console.log(res);
      const productoEncontrado = productos.find(
        (producto) => producto.detalle === detalle
      );

      if (!productoEncontrado) {
        console.error("Producto no encontrado");
        return;
      }

      // Actualizar solo el campo precio_und del producto encontrado
      const productoActualizado = {
        ...productoEncontrado,
        precio_und: precio_und,
      };

      // Crear un nuevo array de productos con el producto actualizado
      const nuevosProductos = productos.map((producto) =>
        producto.id === productoActualizado.id ? productoActualizado : producto
      );

      // Actualizar el estado de productos con el nuevo array que incluye el producto actualizado
      setProductos(nuevosProductos);
    } catch (error) {
      console.log(error);
    }
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_actualizar_producto" className="modal">
      <div className="modal-box max-w-6xl rounded-md max-md:h-full max-md:max-h-full max-md:rounded-none max-md:w-full max-md:pt-10">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div className="max-md:overflow-x-auto">
          <table className="table">
            <thead className="font-bold text-gray-800 text-sm">
              <tr>
                <th>Precio por und $</th>
                <th>Cantidad</th>
                <th>Seleccionar iva</th>
                <th>Total final</th>
                <th>Total final con iva</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="cursor-pointer" onClick={handleInputClick}>
                  {isEditable ? (
                    <input
                      value={precio_und}
                      onChange={(e) => setPrecio(e.target.value)}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="py-2 px-2 border border-gray-300 rounded-md outline-none"
                    />
                  ) : (
                    <p className="py-2 px-2 border border-gray-300 rounded-md outline-none font-bold">
                      {formatearDinero(Number(precio_und))}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  <input
                    value={cantidad}
                    className="py-2 px-2 border border-gray-300 rounded-md outline-none"
                    type="text"
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  <select
                    value={iva}
                    className="py-2 px-2 border border-gray-300 rounded-md outline-none"
                    type="text"
                    onChange={(e) => setIva(Number(e.target.value))}
                  >
                    <option className="font-bold text-primary" value={0}>
                      NO LLEVA IVA
                    </option>
                    <option className="font-semibold" value={1.105}>
                      10.5
                    </option>
                    <option className="font-semibold" value={1.21}>
                      21.00
                    </option>
                  </select>
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {Number(precio_und * cantidad).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {iva === 0
                    ? Number(precio_und * cantidad).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })
                    : Number(
                        Number(precio_und * cantidad) * iva
                      ).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              handleCliente();
              handleSubmitPrecioUnd();
            }}
            type="button"
            className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
          >
            Actualizar el producto de la orden
          </button>
        </div>
      </div>
    </dialog>
  );
};

export const ModalCargarProductoCompra = ({ addToProductos }) => {
  const { productos, categorias } = useProveedoresContext();

  const { handleObtenerId, idObtenida } = useObtenerId();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filtrar productos antes de la paginación
  const filteredProducts = productos.filter((product) => {
    const searchTermMatches =
      product.detalle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);
    const categoryMatches =
      selectedCategory === "all" || product.categoria === selectedCategory;

    return searchTermMatches && categoryMatches;
  });

  return (
    <dialog id="my_modal_producto_compra" className="modal">
      <div className="modal-box rounded-md max-w-7xl scroll-bar h-[60vh] max-md:w-full max-md:max-h-full max-md:h-full max-md:rounded-none max-md:py-14">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div className="flex gap-2 max-md:flex-col max-md:gap-0">
          <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/3 max-md:w-full mb-3">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              className="outline-none font-medium w-full"
              placeholder="Buscar por nombre del producto.."
            />
            <FaSearch className="text-gray-700" />
          </div>

          <div>
            <select
              className="border border-gray-300 flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md outline-none font-semibold capitalize"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option className="font-bold text-blue-500" value="all">
                Todas las categorías
              </option>
              {categorias.map((c) => (
                <option className="font-semibold capitalize" key={c.id}>
                  {c?.detalle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-md:overflow-x-auto scrollbar-hidden">
          <table className="table">
            <thead className="text-gray-800 text-sm">
              <tr>
                <th>Detalle</th>
                <th>Categoria</th>
                <th>Precio und $</th>
                <th></th>
              </tr>
            </thead>

            <tbody className="text-xs uppercase font-medium">
              {filteredProducts.map((p) => (
                <tr key={p?.id}>
                  <td>{p?.detalle}</td>
                  <td>{p?.categoria}</td>
                  <th>{formatearDinero(Number(p.precio_und))}</th>
                  <td className="md:hidden">
                    <FaEdit
                      className="text-primary text-xl"
                      onClick={() => {
                        handleObtenerId(p?.id),
                          document
                            .getElementById("my_modal_producto_seleccionado")
                            .showModal();
                      }}
                    />
                  </td>
                  <td className="max-md:hidden">
                    <button
                      onClick={() => {
                        handleObtenerId(p?.id),
                          document
                            .getElementById("my_modal_producto_seleccionado")
                            .showModal();
                      }}
                      type="button"
                      className="bg-primary px-2 py-1 rounded-md font-bold text-white hover:shadow-sm transition-all"
                    >
                      Seleccionar producto
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ModalProductoSeleccionado
          addToProductos={addToProductos}
          idObtenida={idObtenida}
        />
      </div>
    </dialog>
  );
};

export const ModalProductoSeleccionado = ({ addToProductos, idObtenida }) => {
  const { productos, setProductos } = useProveedoresContext();

  const [producto, setProducto] = useState([]);
  const [precio_und, setPrecio] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [iva, setIva] = useState(0);

  const handleSubmitPrecioUnd = async () => {
    const res = await client.put(`/editar-producto/precio/${idObtenida}`, {
      precio_und,
    });

    const productoEncontrado = productos.find(
      (producto) => producto.id === idObtenida
    );

    if (!productoEncontrado) {
      console.error("Producto no encontrado");
      return;
    }

    // Actualizar solo el campo precio_und del producto encontrado
    const productoActualizado = {
      ...productoEncontrado,
      precio_und: precio_und,
    };

    // Crear un nuevo array de productos con el producto actualizado
    const nuevosProductos = productos.map((producto) =>
      producto.id === productoActualizado.id ? productoActualizado : producto
    );

    // Actualizar el estado de productos con el nuevo array que incluye el producto actualizado
    setProductos(nuevosProductos);
  };

  useEffect(() => {
    async function laodData() {
      const res = await client.get(`/producto/${idObtenida}`);

      setProducto(res.data);
      setPrecio(res.data.precio_und);
    }

    setCantidad(0);

    laodData();
  }, [idObtenida]);

  // Función para generar un ID numérico aleatorio
  function generarID() {
    return Math.floor(Math.random() * 1000000).toString(); // Genera un número aleatorio de hasta 6 dígitos
  }

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_producto_seleccionado" className="modal">
      <div className="modal-box rounded-md max-w-6xl max-md:w-full max-md:h-full max-md:rounded-none max-md:max-h-full max-md:pt-12">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <div className="max-md:overflow-x-auto scrollbar-hidden">
          <table className="table">
            <thead className="font-bold text-gray-800 text-sm">
              <tr>
                <th>Detalle</th>
                <th>Categoria</th>
                <th>Precio por und $</th>
                <th>Cantidad</th>
                <th>Seleccionar iva</th>
                <th>Total final</th>
                <th>Total final con iva</th>
              </tr>
            </thead>

            <tbody className="uppercase text-xs font-medium">
              <tr key={producto.id}>
                <td>{producto?.detalle}</td>
                <td>{producto?.categoria}</td>
                <td className="cursor-pointer" onClick={handleInputClick}>
                  {isEditable ? (
                    <input
                      value={precio_und}
                      onChange={(e) => setPrecio(e.target.value)}
                      onBlur={() => {
                        setIsEditable(false);
                      }}
                      type="text"
                      className="py-2 px-2 border border-gray-300 rounded-md outline-none"
                    />
                  ) : (
                    <p className="py-2 px-2 border border-gray-300 rounded-md outline-none font-bold">
                      {formatearDinero(Number(precio_und))}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  <input
                    value={cantidad}
                    className="py-2 px-2 border border-gray-300 rounded-md outline-none"
                    type="text"
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 uppercase">
                  <select
                    value={iva}
                    className="py-2 px-2 border border-gray-300 rounded-md outline-none"
                    type="text"
                    onChange={(e) => setIva(Number(e.target.value))}
                  >
                    <option className="font-bold text-primary" value={0}>
                      NO LLEVA IVA
                    </option>
                    <option className="font-semibold" value={1.105}>
                      10.5
                    </option>
                    <option className="font-semibold" value={1.21}>
                      21.00
                    </option>
                  </select>
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {Number(precio_und * cantidad).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900 uppercase">
                  {iva === 0
                    ? Number(precio_und * cantidad).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })
                    : Number(
                        Number(precio_und * cantidad) * iva
                      ).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              const randomID = generarID();
              addToProductos(
                parseInt(`${producto?.id}${randomID}`, 10), // Combina el ID del producto con el ID aleatorio
                producto?.detalle,
                producto?.categoria,
                precio_und,
                cantidad,
                Number(precio_und * cantidad),
                Number(iva) === 0
                  ? Number(precio_und * cantidad)
                  : Number(precio_und * cantidad * iva), // Usar precio_und * cantidad si el IVA es cero
                Number(iva)
              );
              handleSubmitPrecioUnd();
            }}
            type="button"
            className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
          >
            Cargar producto..
          </button>
        </div>
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
