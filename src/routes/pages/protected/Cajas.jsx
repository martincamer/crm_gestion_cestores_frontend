import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown, FaList, FaSearch } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useProveedoresContext } from "../../../context/ProveedoresContext";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { toast } from "react-toastify";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { formatearDinero } from "../../../helpers/formatearDinero";
import client from "../../../api/axios";
import XLSX from "xlsx";

export const Cajas = () => {
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
        <p className="font-bold text-xl">
          Cargar nuevas cajas y llevar el control.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_cargar_proveedor").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-blue-600 text-white py-2 rounded-md px-2 hover:bg-blue-700 transition-all"
          >
            Cargar nueva caja
            <FaChevronDown />
          </button>
        </div>
      </div>
      <div className="bg-white w-full min-h-screen max-w-full h-full px-10 py-10">
        <div className="flex items-center">
          <div className="border border-gray-300 px-2 py-1 rounded-md text-sm font-medium flex items-center hover:border-blue-600">
            <select
              value={searchTermCliente}
              onChange={handleSearchClienteChange}
              className="text-sm outline-none w-full px-2"
            >
              <option>Seleccionar caja</option>
            </select>
          </div>
        </div>

        <div className="mt-4 z-0">
          <table className="table">
            <thead>
              <tr className="font-extrabold text-sm text-black">
                <th>Referencia</th>
                <th></th>
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
                        >
                          <li className="hover:bg-gray-600 rounded-md hover:text-white text-black font-medium">
                            <button
                              onClick={() => {
                                handleObtenerId(proveedor.id),
                                  document
                                    .getElementById("my_modal_eliminar")
                                    .showModal();
                              }}
                            >
                              Eliminar caja
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
      <ModalCargarCaja />
    </section>
  );
};

const ModalCargarCaja = () => {
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

  const [excelData, setExcelData] = React.useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Obtener la primera hoja de cálculo del archivo Excel
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convertir la hoja de cálculo a un arreglo de objetos
      const dataArr = XLSX.utils.sheet_to_json(sheet, { header: "0" });

      // Mostrar los datos en la consola para verificación
      console.log(dataArr);

      // Guardar los datos en el estado del componente
      setExcelData(dataArr);
    };

    reader.readAsArrayBuffer(file);
  };

  console.log(excelData);

  return (
    <dialog id="my_modal_cargar_proveedor" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">Cargar nueva caja</h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras cargar una nueva caja
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          {/* <div className="flex flex-col gap-2">
            <label className="font-bold text-sm">Subir archivo excel.</label>
            <input
              {...register("proveedor")}
              type="file"
              className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600"
              placeholder="Escribir el nombre y apellido..."
            />
          </div> */}
          <input type="file" onChange={handleFileUpload} />
          <div>
            <h2>Datos del archivo Excel</h2>
            <table>
              <thead>
                <tr>
                  {/* Mostrar encabezados si están disponibles */}
                  {excelData.length > 0 &&
                    excelData[0].map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {/* Mostrar datos si están disponibles */}
                {excelData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white"
            >
              Guardar proveedor
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
