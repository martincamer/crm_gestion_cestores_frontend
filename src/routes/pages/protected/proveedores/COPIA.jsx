import { useEffect, useState } from "react";
import { useOrdenesContext } from "../../../context/OrdenesProvider";
import { ModalVerProductos } from "../../../components/Modales/ModalVerProductos";
import { ModalEditarOrdenTotal } from "../../../components/Modales/ModalEditarOrdenTotal";
import { ModalActualizarOrdenEstado } from "../../../components/Modales/ModalActualizarOrdenEstado";
import { ModalCompararPrecios } from "../../../components/Modales/ModalCompararPrecios";
import { ModalCompras } from "../../../components/Modales/ModalCompras";
import { Link } from "react-router-dom";
import { CgMenuRightAlt, CgSearch } from "react-icons/cg";
import { useProductosContext } from "../../../context/ProductosProvider";
import { FaEdit, FaSearch } from "react-icons/fa";
import { formatearDinero } from "../../../helpers/formatearDinero";
import { useObtenerId } from "../../../helpers/obtenerId";
import { FaDeleteLeft } from "react-icons/fa6";
import {
  showSuccessToast,
  showSuccessToastError,
} from "../../../helpers/toast";
import client from "../../../api/axios";
import { IoMdAdd } from "react-icons/io";
import { useForm } from "react-hook-form";

export const OrdenDeCompra = () => {
  const [isOpenEliminar, setIsOpenEliminar] = useState(false);
  const [isProductos, setIsProductos] = useState(false);
  const [obtenerId, setObtenerId] = useState(null);

  const openEliminar = () => {
    setIsOpenEliminar(true);
  };

  const closeEliminar = () => {
    setIsOpenEliminar(false);
  };

  const openProductos = () => {
    setIsProductos(true);
  };

  const closeProductos = () => {
    setIsProductos(false);
  };

  const handleID = (id) => setObtenerId(id);

  const { ordenes } = useOrdenesContext();

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Convertir las fechas en formato YYYY-MM-DD para los inputs tipo date
  const fechaInicioPorDefecto = firstDayOfMonth.toISOString().split("T")[0];
  const fechaFinPorDefecto = lastDayOfMonth.toISOString().split("T")[0];

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(fechaInicioPorDefecto);
  const [endDate, setEndDate] = useState(fechaFinPorDefecto);

  // Filtrar por fabrica_sucursal
  const filteredOrdenes = ordenes.filter((orden) =>
    orden.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar pedidos del mes actual
  const currentMonth = new Date().getMonth() + 1;

  const filteredByMonth = ordenes.filter((orden) => {
    const createdAtMonth = new Date(orden.created_at).getMonth() + 1;
    return createdAtMonth === currentMonth;
  });

  const totalPrecioFinal = filteredByMonth.reduce(
    (total, orden) => total + parseFloat(orden.precio_final),
    0
  );

  const filteredByDateRange = filteredOrdenes.filter((orden) => {
    const createdAt = new Date(orden.created_at);
    return (
      (!startDate || createdAt >= new Date(startDate)) &&
      (!endDate || createdAt <= new Date(endDate))
    );
  });

  const totalPrecioFinalFiltradas = filteredByDateRange.reduce(
    (total, orden) => total + parseFloat(orden.precio_final),
    0
  );

  // Filtrar órdenes pendientes y completadas
  const pendingOrders = filteredByDateRange.filter((orden) =>
    orden.datos.productoSeleccionado.some(
      (producto) =>
        parseInt(producto.cantidad) !== parseInt(producto.cantidadFaltante)
    )
  );

  const completedOrders = filteredByDateRange.filter(
    (orden) =>
      !orden.datos.productoSeleccionado.some(
        (producto) =>
          parseInt(producto.cantidad) !== parseInt(producto.cantidadFaltante)
      )
  );

  // Ordenar pendientes por ID descendente
  const sortedPendingOrders = pendingOrders.sort((a, b) => b.id - a.id);

  // Ordenar completadas por ID descendente
  const sortedCompletedOrders = completedOrders.sort((a, b) => b.id - a.id);

  const sortedOrdenes = [...sortedPendingOrders, ...sortedCompletedOrders];

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const [isModalEditarOrden, setOpenModalEditarOrden] = useState(false);

  const openModalEditarOrden = () => setOpenModalEditarOrden(true);

  const closeModalEditarOrden = () => setOpenModalEditarOrden(false);

  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <section className="w-full h-full min-h-screen max-h-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center max-md:flex-col max-md:gap-3">
        <p className="font-bold text-gray-900 text-xl">Sector de compras.</p>
        <button
          onClick={() =>
            document
              .getElementById("my_modal_crear_orden_de_compra")
              .showModal()
          }
          type="button"
          className="bg-primary py-1 px-4 rounded-md text-white font-semibold text-sm"
        >
          Crear nueva orden de compra
        </button>
      </div>
      <div className="bg-white py-5 px-5 mx-0 mt-10 flex gap-3 max-md:my-5 max-md:flex-col max-md:mt-3">
        <div className="dropdown dropdown-bottom dropdown-hover">
          <button className="font-bold text-sm bg-primary py-1 px-4 text-white rounded">
            Ver estadisticas de compras
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 mt-0.5 bg-gray-800 rounded-md w-[800px] max-md:w-80"
          >
            <div className="py-5 px-5 grid grid-cols-3 gap-5 w-full max-md:grid-cols-1">
              <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                <p className="font-medium text-sm">
                  Total en ordenes generadas del mes.
                </p>
                <p className="font-bold text-lg">
                  {totalPrecioFinal.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>

              <div className="flex flex-col gap-1 bg-white rounded-md py-3 px-3">
                <p className="font-medium text-sm">
                  Total en ordenes filtradas del mes/semanal/etc.
                </p>
                <p className="font-bold text-lg text-primary">
                  {totalPrecioFinalFiltradas.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </div>
            </div>
          </ul>
        </div>
        <button
          onClick={() =>
            document.getElementById("my_modal_comparar_precios").showModal()
          }
          className="font-bold text-sm bg-green-500 py-1 px-4 text-white rounded max-md:hidden"
        >
          Ver productos/comparar/proveedores/etc
        </button>
        <button
          onClick={() =>
            document.getElementById("my_modal_compras").showModal()
          }
          className="font-bold text-sm bg-blue-500 py-1 px-4 text-white rounded max-md:hidden"
        >
          Ver ordenes de compra/comparar/filtrar/etc
        </button>
      </div>

      <div className="bg-white  mx-5 max-md:mx-5 my-4 flex max-md:flex-col gap-2">
        <div className="border border-gray-300 flex items-center gap-2 px-2 py-1.5 text-sm rounded-md w-1/5 max-md:w-full">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="outline-none font-medium w-full"
            placeholder="Buscar por el proveedor..."
          />
          <FaSearch className="text-gray-700" />
        </div>

        <div className="flex gap-2 items-center ">
          <input
            className="border border-gray-300 text-sm rounded-md font-medium py-2 max-md:py-1 px-3 outline-none"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            className="border border-gray-300 text-sm rounded-md font-medium py-2 max-md:py-1 px-3 outline-none"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="max-md:overflow-x-auto mx-5 my-10 max-md:h-[100vh] scrollbar-hidden">
          <table className="table">
            <thead className="text-left font-bold text-gray-900 text-sm">
              <tr>
                <th>Numero</th>
                <th>Proveedor</th>
                <th>Numero Factura</th>
                <th>Fecha de la factura</th>
                <th>Fecha de creación</th>
                <th>Total Facturado</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs capitalize font-medium">
              {sortedOrdenes.map((p) => (
                <tr className="" key={p.id}>
                  <td>{p.id}</td>
                  <td className="uppercase">{p.proveedor}</td>
                  <td>N° {p.numero_factura}</td>
                  <td>
                    {new Date(p.fecha_factura).toLocaleDateString("ars")}
                  </td>{" "}
                  <td>{new Date(p.created_at).toLocaleDateString("ars")}</td>
                  <td className="">
                    <div className="flex">
                      <p className="bg-green-100/90 py-1.5 rounded text-green-700 font-bold px-3">
                        {Number(p.precio_final).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-gray-700 uppercase text-xs cursor-pointer">
                    <div className="flex">
                      <p
                        className={`${
                          (p.estado === "pendiente" &&
                            "bg-orange-100 text-orange-600") ||
                          (p.estado === "rechazada" &&
                            "bg-red-50 text-red-600") ||
                          (p.estado === "aceptada" &&
                            "bg-green-50 text-green-600")
                        } py-1 px-2 rounded capitalize text-xs font-semibold`}
                      >
                        {p.estado}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="dropdown dropdown-left z-1">
                      <div
                        tabIndex={0}
                        role="button"
                        className="hover:bg-gray-700 hover:text-white rounded-full px-1 py-1 transition-all"
                      >
                        <CgMenuRightAlt className="text-2xl" />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-1 border border-gray-300 rounded-md bg-white shadow-xl w-52 gap-1"
                      >
                        <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                          <span
                            onClick={() => {
                              handleID(p.id), openProductos();
                            }}
                            className=""
                          >
                            Ver Productos
                          </span>
                        </li>
                        <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                          <button
                            onClick={() => {
                              handleID(p.id),
                                document
                                  .getElementById("my_modal_actualizar_estado")
                                  .showModal();
                            }}
                          >
                            Actualizar estado
                          </button>
                        </li>
                        <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                          <span
                            onClick={() => {
                              handleObtenerId(p.id),
                                document
                                  .getElementById(
                                    "my_modal_actualizar_orden_de_compra"
                                  )
                                  .showModal();
                            }}
                            className=""
                          >
                            Actualizar orden
                          </span>
                        </li>

                        <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                          <Link to={`/orden/${p.id}`}>Ver orden</Link>
                        </li>

                        <li className="text-xs font-semibold hover:bg-gray-800 rounded-md hover:text-white">
                          <button
                            onClick={() => {
                              handleObtenerId(p.id),
                                document
                                  .getElementById("my_modal_eliminar")
                                  .showModal();
                            }}
                          >
                            Eliminar
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
      </div>

      <ModalCrearOrdenDeCompra />

      <ModalVerProductos
        isOpen={isProductos}
        closeModal={closeProductos}
        obtenerId={obtenerId}
      />

      <ModalEditarOrdenTotal
        isOpen={isModalEditarOrden}
        closeModal={closeModalEditarOrden}
        obtenerId={obtenerId}
      />

      <ModalActualizarOrdenEstado idObtenida={obtenerId} />

      <ModalCompararPrecios />

      <ModalCompras />

      <ModalEliminar idObtenida={idObtenida} />

      <ModalActualizarOrdenDeCompra id={idObtenida} />
    </section>
  );
};

export const ModalActualizarOrdenDeCompra = ({ id }) => {
  const { setOrdenes } = useOrdenesContext();

  const { proveedores, setProveedores } = useProductosContext();

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/proveedores");
      setProveedores(respuesta.data);
    }

    loadData();
  }, []);

  const [proveedor, setProveedor] = useState("");
  const [numero_factura, setNumeroFactura] = useState("");
  const [detalle, setDetalle] = useState("");
  const [fecha_factura, setFechaFactura] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [iva, setIva] = useState(1.21);

  const [productoSeleccionado, setProductoSeleccionado] = useState([]);

  const { handleObtenerId, idObtenida, setIdObtenida } = useObtenerId();

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

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get(`/orden/${id}`);

      const fecha = new Date(respuesta.data.fecha_factura);
      const formattedDate = fecha.toISOString().split("T")[0]; // Extracting only the date part

      setIva(respuesta.data.iva);
      setProveedor(respuesta.data.proveedor);
      setLocalidad(respuesta.data.localidad);
      setProvincia(respuesta.data.provincia);
      setDetalle(respuesta.data.detalle);
      setFechaFactura(formattedDate);
      setNumeroFactura(respuesta.data.numero_factura);
      setDetalle(respuesta.data.detalle);
      setProductoSeleccionado(respuesta.data.datos.productoSeleccionado);
      console.log("asdsad", respuesta.data.datos.productoSeleccionado);
    }

    loadData();
  }, [id]);

  const deleteProducto = (id) => {
    const itemIndex = productoSeleccionado.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      const newItem = [...productoSeleccionado];
      newItem.splice(itemIndex, 1); // Corrected line
      setProductoSeleccionado(newItem);
    }
  };

  const totalesFinales = productoSeleccionado.reduce((total, producto) => {
    return total + Number(producto?.totalFinal);
  }, 0);

  const totalFinalSumSinIva = productoSeleccionado.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue.totalFinalIva;
    },
    0
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosOrden = {
      proveedor,
      numero_factura,
      precio_final: Number(totalFinalSumSinIva),
      fecha_factura,
      localidad,
      provincia,
      detalle,
      datos: { productoSeleccionado },
      iva,
    };

    const datos = {
      proveedor,
      total: Number(totalFinalSumSinIva),
    };

    const res = await client.put(`/editar-orden/${id}`, datosOrden);

    setOrdenes(res.data.ordenes);
    setProveedores(res.data.proveedores);

    showSuccessToast("Orden finalizada..");

    handleObtenerId(null);

    document.getElementById("my_modal_actualizar_orden_de_compra").close();
  };

  const handleProveedorChange = (e) => {
    const selectedProveedor = e.target.value;
    setProveedor(selectedProveedor);

    // Buscar la localidad correspondiente al proveedor seleccionado
    const selectedProveedorData = proveedores.find(
      (p) => p.proveedor === selectedProveedor
    );
    if (selectedProveedorData) {
      setLocalidad(selectedProveedorData.localidad);
      setProvincia(selectedProveedorData.provincia);
    } else {
      setLocalidad("");
      setProvincia("");
    }
  };

  return (
    <dialog id="my_modal_actualizar_orden_de_compra" className="modal">
      <div className="modal-box max-w-full h-full scrollbar-hidden rounded-md  max-md:h-full max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl">Actualizar la orden de compra.</h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras cargar una actualizar la orden de compra,
          productos, etc.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-4">
          <div className="grid grid-cols-4 gap-2 max-md:grid-cols-1">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Proveedor de la orden</label>
              <select
                value={proveedor}
                onChange={handleProveedorChange}
                className="capitalize font-semibold text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
                placeholder="PROVEEDOR DE LA ORDEN"
              >
                <option
                  className="font-bold text-primary"
                  value={"seleccionar"}
                >
                  Seleccionar el proveedor
                </option>
                {proveedores.map((p, index) => (
                  <option
                    className="font-semibold text-gray-800 uppercase text-xs"
                    key={index}
                    value={p.proveedor}
                  >
                    {p.proveedor}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Localidad</label>
              <input
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                type="text"
                className="capitalize font-semibold text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
                placeholder="Escribir la localidad."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Provincia</label>
              <input
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                type="text"
                className="capitalize font-semibold text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
                placeholder="Escribe la provincia del proveedor."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Numero del remito o factura de compra
              </label>
              <input
                value={numero_factura}
                onChange={(e) => setNumeroFactura(e.target.value)}
                className="capitalize font-medium text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
                placeholder="Escribe el numero..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Fecha del remito o factura de compra
              </label>
              <input
                value={fecha_factura}
                onChange={(e) => setFechaFactura(e.target.value)}
                type="date"
                className="font-medium text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-1/6 max-md:w-auto">
            <label className="text-sm font-bold">
              Detallar algo mensaje,etc.
            </label>
            <textarea
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              type="text"
              placeholder="Detallar algo de la orden de compra.."
              className="font-medium text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
            />
          </div>
          <div className="flex gap-2 max-md:flex-col">
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

          <div className="max-md:overflow-x-auto">
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
                    <td className="hidden">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 bg-gray-800 py-5 rounded-md mt-4 max-md:flex-col">
            <p className="font-normal py-2 px-5 text-sm rounded-xl text-white flex gap-1 items-center max-md:flex-col max-md:items-start">
              <span className="font-bold">Subtotal</span>
              <span className="py-2 px-4 text-base text-white rounded-xl font-bold">
                {totalesFinales.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>
            </p>
            <p className="font-normal py-2 px-5 text-sm rounded-xl text-white flex gap-1 items-center max-md:flex-col max-md:items-start">
              <span className="font-bold">Total iva agregado</span>
              <span className="py-2 px-4 text-base rounded-xl font-bold">
                {Number(totalFinalSumSinIva - totalesFinales).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                  }
                )}
              </span>
            </p>
            <p className=" font-normal py-2 px-5 text-sm rounded-xl text-white flex gap-2 items-center max-md:flex-col max-md:items-start">
              <span className=" font-bold">
                {" "}
                Total final con <span>ivas</span> seleccionado{" "}
              </span>{" "}
              <span className="bg-primary py-2 px-4 text-base rounded-xl font-bold">
                {Number(totalFinalSumSinIva).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>
            </p>
          </div>
          <div className="pb-4">
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Actualizar la orden de compra
            </button>
          </div>
        </form>

        <ModalCargarProductoCompraEnActualizar
          addToProductos={addToProductos}
        />
        <ModalEditarProductoCompraEnActualizar
          idObtenida={idObtenida}
          productoSeleccionado={productoSeleccionado}
          setProductoSeleccionado={setProductoSeleccionado}
        />
        <ModalCrearProducto />
      </div>
    </dialog>
  );
};

export const ModalEditarProductoCompraEnActualizar = ({
  idObtenida,
  productoSeleccionado,
  setProductoSeleccionado,
}) => {
  const [precio_und, setPrecio] = useState("");
  const [categoria, setCategorias] = useState("");
  const [detalle, setDetalle] = useState("");
  const [cantidad, setCantidad] = useState("");
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

    document
      .getElementById("my_modal_actualizar_producto_en_actualizar")
      .close();
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
    <dialog id="my_modal_actualizar_producto_en_actualizar" className="modal">
      <div className="modal-box max-w-6xl rounded-md">
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
                    value={cantidad || 0}
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

export const ModalCargarProductoCompraEnActualizar = ({ addToProductos }) => {
  const { productos } = useProductosContext();

  const { handleObtenerId, idObtenida } = useObtenerId();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filtrar productos por término de búsqueda y categoría seleccionada
  const filteredProducts = productos?.filter((product) => {
    return (
      product?.detalle?.toLowerCase().includes(searchTerm?.toLowerCase()) &&
      (selectedCategory === "all" || product?.categoria === selectedCategory)
    );
  });

  return (
    <dialog id="my_modal_producto_compra_en_actualizar" className="modal">
      <div className="modal-box rounded-md max-w-7xl scroll-bar h-[60vh]">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

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

        <div className="max-md:overflow-x-auto">
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
                <tr key={p.id}>
                  <td>{p.detalle}</td>
                  <td>{p.categoria}</td>
                  <th>{formatearDinero(Number(p.precio_und))}</th>
                  <td>
                    <button
                      onClick={() => {
                        handleObtenerId(p.id),
                          document
                            .getElementById(
                              "my_modal_producto_seleccionado_en_actualizar"
                            )
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
        <ModalProductoSeleccionadoEnActualizar
          addToProductos={addToProductos}
          idObtenida={idObtenida}
        />
      </div>
    </dialog>
  );
};

export const ModalProductoSeleccionadoEnActualizar = ({
  addToProductos,
  idObtenida,
}) => {
  const { productos, setProductos } = useProductosContext();

  const [producto, setProducto] = useState([]);
  const [precio_und, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
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

    setCantidad("");

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
    <dialog id="my_modal_producto_seleccionado_en_actualizar" className="modal">
      <div className="modal-box rounded-md max-w-6xl">
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
                    value={cantidad || 0}
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

export const ModalCrearOrdenDeCompra = () => {
  const { setOrdenes } = useOrdenesContext();

  const { proveedores, setProveedores } = useProductosContext();

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/proveedores");
      setProveedores(respuesta.data);
    }

    loadData();
  }, []);

  const [isOpenProductoNew, setIsOpenProductoNew] = useState(false);

  const openModalProducto = () => {
    setIsOpenProductoNew(true);
  };

  const closeModalProducto = () => {
    setIsOpenProductoNew(false);
  };

  const [proveedor, setProveedor] = useState("");
  const [numero_factura, setNumeroFactura] = useState("");
  const [detalle, setDetalle] = useState("");
  const [fecha_factura, setFechaFactura] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [socket, setSocket] = useState(null);
  const [iva, setIva] = useState(1.21);

  const [OBTENERID, setObtenerId] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState([]);

  const handleID = (id) => setObtenerId(id);

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

    document.getElementById("my_modal_producto_seleccionado").close();
    document.getElementById("my_modal_producto_compra").close();

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

  const deleteProducto = (id) => {
    const itemIndex = productoSeleccionado.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      const newItem = [...productoSeleccionado];
      newItem.splice(itemIndex, 1); // Corrected line
      setProductoSeleccionado(newItem);
    }
  };

  const totalesFinales = productoSeleccionado.reduce((total, producto) => {
    return total + Number(producto?.totalFinal);
  }, 0);

  const totalFinalSumSinIva = productoSeleccionado.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue.totalFinalIva;
    },
    0
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosOrden = {
      proveedor,
      numero_factura,
      precio_final: Number(totalFinalSumSinIva),
      fecha_factura,
      localidad,
      provincia,
      detalle,
      datos: { productoSeleccionado },
      iva,
    };

    const datos = {
      proveedor,
      total: Number(totalFinalSumSinIva),
    };

    const res = await client.post("/crear-orden-nueva", datosOrden);
    const resProveedor = await client.put(
      `/actualizar-proveedor-compra`,
      datos
    );

    setOrdenes(res.data.ordenes);
    setProveedores(resProveedor.data);

    setProductoSeleccionado([]);
    setProveedor("");
    setNumeroFactura("");
    setDetalle("");
    setFechaFactura("");
    setLocalidad("");
    setProvincia("");

    showSuccessToast("Orden finalizada..");

    document.getElementById("my_modal_crear_orden_de_compra").close();
  };

  const [isOpenProducto, setIsOpenProducto] = useState(false);

  const openProducto = () => {
    setIsOpenProducto(true);
  };

  const closeProducto = () => {
    setIsOpenProducto(false);
  };

  const [isOpenProductoEditar, setIsOpenProductoEditar] = useState(false);

  const openProductoEditar = () => {
    setIsOpenProductoEditar(true);
  };

  const closeProductoEditar = () => {
    setIsOpenProductoEditar(false);
  };

  const handleProveedorChange = (e) => {
    const selectedProveedor = e.target.value;
    setProveedor(selectedProveedor);

    // Buscar la localidad correspondiente al proveedor seleccionado
    const selectedProveedorData = proveedores.find(
      (p) => p.proveedor === selectedProveedor
    );
    if (selectedProveedorData) {
      setLocalidad(selectedProveedorData.localidad);
      setProvincia(selectedProveedorData.provincia);
    } else {
      setLocalidad("");
      setProvincia("");
    }
  };

  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <dialog id="my_modal_crear_orden_de_compra" className="modal">
      <div className="modal-box max-w-full h-full scrollbar-hidden rounded-md  max-md:h-full max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <h3 className="font-bold text-xl">Cargar nueva orden de compra.</h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras cargar una nueva orden de compra, productos,
          etc.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-4">
          <div className="grid grid-cols-4 gap-2 max-md:grid-cols-1">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">Proveedor de la orden</label>
              <select
                value={proveedor}
                onChange={handleProveedorChange}
                className="capitalize font-semibold text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
                placeholder="PROVEEDOR DE LA ORDEN"
              >
                <option
                  className="font-bold text-primary"
                  value={"seleccionar"}
                >
                  Seleccionar el proveedor
                </option>
                {proveedores.map((p, index) => (
                  <option
                    className="font-semibold text-gray-800 uppercase text-xs"
                    key={index}
                    value={p.proveedor}
                  >
                    {p.proveedor}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Localidad</label>
              <input
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                type="text"
                className="capitalize font-semibold text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
                placeholder="Escribir la localidad."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Provincia</label>
              <input
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                type="text"
                className="capitalize font-semibold text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
                placeholder="Escribe la provincia del proveedor."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Numero del remito o factura de compra
              </label>
              <input
                value={numero_factura}
                onChange={(e) => setNumeroFactura(e.target.value)}
                className="capitalize font-medium text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
                placeholder="Escribe el numero..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Fecha del remito o factura de compra
              </label>
              <input
                value={fecha_factura}
                onChange={(e) => setFechaFactura(e.target.value)}
                type="date"
                className="font-medium text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-1/6 max-md:w-auto">
            <label className="text-sm font-bold">
              Detallar algo mensaje,etc.
            </label>
            <textarea
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              type="text"
              placeholder="Detallar algo de la orden de compra.."
              className="font-medium text-sm border border-gray-300 rounded-md py-2 px-2 outline-none focus:shadow-md cursor-pointer transition-all"
            />
          </div>
          <div className="flex gap-2 max-md:flex-col">
            <button
              onClick={() =>
                document.getElementById("my_modal_producto_compra").showModal()
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

          <div className="max-md:overflow-x-auto scrollbar-hidden">
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
                                .getElementById("my_modal_actualizar_producto")
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
                    <td className="hidden">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2 bg-gray-800 py-5 rounded-md mt-4 max-md:flex-col">
            <p className="font-normal py-2 px-5 text-sm rounded-xl text-white flex gap-1 items-center max-md:flex-col max-md:items-start">
              <span className="font-bold">Subtotal</span>
              <span className="py-2 px-4 text-base text-white rounded-xl font-bold">
                {totalesFinales.toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>
            </p>
            <p className="font-normal py-2 px-5 text-sm rounded-xl text-white flex gap-1 items-center max-md:flex-col max-md:items-start">
              <span className="font-bold">Total iva agregado</span>
              <span className="py-2 px-4 text-base rounded-xl font-bold">
                {Number(totalFinalSumSinIva - totalesFinales).toLocaleString(
                  "es-AR",
                  {
                    style: "currency",
                    currency: "ARS",
                  }
                )}
              </span>
            </p>
            <p className=" font-normal py-2 px-5 text-sm rounded-xl text-white flex gap-2 items-center max-md:flex-col max-md:items-start">
              <span className=" font-bold">
                {" "}
                Total final con <span>ivas</span> seleccionado{" "}
              </span>{" "}
              <span className="bg-primary py-2 px-4 text-base rounded-xl font-bold">
                {Number(totalFinalSumSinIva).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </span>
            </p>
          </div>
          <div className="pb-4">
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Guardar la orden de compra
            </button>
          </div>
        </form>

        <ModalCargarProductoCompra addToProductos={addToProductos} />
        <ModalEditarProductoOrdenCompra
          idObtenida={idObtenida}
          productoSeleccionado={productoSeleccionado}
          setProductoSeleccionado={setProductoSeleccionado}
        />
        <ModalCrearProducto />
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
  const { productos, categorias } = useProductosContext();

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
  const { productos, setProductos } = useProductosContext();

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

export const ModalCrearProducto = () => {
  const [precio_und, setPrecio] = useState(0);
  const [detalle, setDetale] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [categoria, setCategoria] = useState("");

  const { categorias, setProductos } = useProductosContext();

  const onSubmit = async (e) => {
    e.preventDefault();

    const datosProducto = { precio_und, detalle, proveedor: "", categoria };

    try {
      const res = await client.post("/crear-producto", datosProducto);

      setProductos(res.data);

      setPrecio(0);
      setDetale("");
      setProveedor("");
      setCategoria("");

      document.getElementById("my_modal_crear_producto").close();

      showSuccessToast("Producto creado correctamente");
    } catch (error) {
      console.error("Error al enviar el producto:", error);
    }
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleInputClick = (index) => {
    setIsEditable(true);
  };

  return (
    <dialog id="my_modal_crear_producto" className="modal">
      <div className="modal-box rounded-md max-md:h-full max-md:w-full max-md:max-h-full max-md:rounded-none">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar producto nuevo.</h3>
        <p className="py-0.5 text-sm font-medium">
          En esta ventana podras cargar nuevos productos, para las ordenes de
          compra, lista de precios, etc.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-3">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Detalle del producto</label>
            <input
              onChange={(e) => setDetale(e.target.value)}
              value={detalle}
              type="text"
              className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium placeholder:normal-case capitalize outline-none focus:shadow-md"
              placeholder="Escribe el nombre del producto.."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm">Seleccionar categoria</label>
            <div className="flex gap-2 items-center">
              <select
                type="text"
                className="rounded-md border border-gray-300 py-2 px-2 text-sm font-medium capitalize outline-none focus:shadow-md"
                onChange={(e) => setCategoria(e.target.value)}
                value={categoria}
              >
                <option className="font-bold text-primary" value="">
                  Seleccionar la categoria
                </option>
                {categorias.map((c) => (
                  <option className="font-semibold capitalize" key={c.id}>
                    {c.detalle}
                  </option>
                ))}
              </select>
              <div
                onClick={() =>
                  document
                    .getElementById("my_modal_crear_categoria")
                    .showModal()
                }
                className="cursor-pointer"
              >
                <IoMdAdd className="text-2xl border border-gray-300 rounded-md py-0.5 px-0.5" />
              </div>
            </div>
          </div>

          <div onClick={handleInputClick}>
            {isEditable ? (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Precio unidad del producto
                </label>
                <input
                  onChange={(e) => setPrecio(e.target.value)}
                  value={precio_und}
                  onBlur={() => {
                    setIsEditable(false);
                  }}
                  type="text"
                  className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">
                  Precio unidad del producto
                </label>

                <p className="rounded-md border border-gray-300 py-2 px-2 text-sm font-bold capitalize outline-none focus:shadow-md">
                  {formatearDinero(Number(precio_und) || 0)}
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="py-1.5 px-6 bg-primary hover:shadow-md text-white transition-all rounded-md font-semibold text-sm"
            >
              Crear nuevo producto
            </button>
          </div>
        </form>

        {/* <ModalCrearCategoria /> */}
      </div>
    </dialog>
  );
};
