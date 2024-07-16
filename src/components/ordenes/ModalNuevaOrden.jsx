import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useProveedoresContext } from "../../context/ProveedoresContext";
import { FormInput } from "../formularios/FormInput";
import { toast } from "react-toastify";
import { FormSelect } from "../formularios/FormSelect";
import { IoIosAdd } from "react-icons/io";
import { ModalNuevoProveedor } from "../proveedor/ModalNuevoProveedor";
import { Button } from "../formularios/Button";
import client from "../../api/axios";
import io from "socket.io-client";
import FileDrop from "../FileDrop";
import axios from "axios";
import { formatearDinero } from "../../helpers/formatearDinero";

export const ModalNuevaOrden = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const { proveedores, setOrdenes, setProveedores } = useProveedoresContext();

  const total = watch("total");

  const [socket, setSocket] = useState(null);

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

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_URL, {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on("nueva-orden", (crearOrden) => {
      setOrdenes(crearOrden);
    });

    return () => newSocket.close();
  }, []);

  const onSubmit = async (formData) => {
    const comprobante = await uploadFile(uploadedFile);

    try {
      const ordenData = {
        ...formData,
        comprobante,
      };

      const res = await client.post("/ordenes", ordenData);

      if (socket) {
        socket.emit("nueva-orden", res.data.todasLasOrdenes);
      }

      setProveedores(res.data.proveedorActualizados);

      toast.success("¡Orden creado correctamente!", {
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

      document.getElementById("my_modal_nueva_orden").close();

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
    <dialog id="my_modal_nueva_orden" className="modal">
      <div className="modal-box max-w-3xl rounded-none py-10 scroll-bar">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl text-blue-500">Crea un nuevo orden</h3>
        <p className="py-2">En esta sección podras crear nuevas ordenes.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <FormSelect
              labelText={"Proveedor"}
              placeholder={""}
              props={{ ...register("proveedor", { required: true }) }}
              type={"text"}
            >
              <option
                className="font-bold text-blue-500"
                value={"Seleccionar el proveedor"}
              >
                Seleccionar el proveedor
              </option>
              {proveedores.map((p) => (
                <option className="font-semibold text-gray-800" key={p.id}>
                  {p.proveedor}
                </option>
              ))}
            </FormSelect>
            <div
              onClick={() =>
                document.getElementById("my_modal_nuevo_proveedor").showModal()
              }
              type="button"
              className="flex items-end cursor-pointer"
            >
              <IoIosAdd className="border text-3xl border-blue-500 text-blue-500" />
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

          <div className="grid grid-cols-2 gap-2">
            <div onClick={handleInputClick}>
              {isEditable ? (
                <FormInput
                  labelText={"Total del comprobante"}
                  placeholder={"Escribe el total del comprobante ej: $130.0000"}
                  props={{
                    ...register("total", { required: true }),
                    onBlur: () => setIsEditable(false),
                  }}
                  type={"text"}
                />
              ) : (
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-semibold text-gray-700">
                    Total de la orden
                  </label>
                  <p className="border capitalize border-[#E2E8F0] bg-[#F7FAFC] py-[0.90rem] px-[0.75rem] focus:border-blue-500 rounded-none outline-none outline-[1px] text-sm font-semibold">
                    {formatearDinero(Number(total) || 0)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <FormSelect
                labelText={"Tipo de Orden"}
                placeholder={""}
                props={{ ...register("tipo_orden", { required: true }) }}
                type={"text"}
              >
                <option
                  className="font-bold text-blue-500"
                  value={"Seleccionar el tipo de orden"}
                >
                  Seleccionar el tipo de orden
                </option>
                <option value="remito">Remito</option>
                <option value="factura">Factura</option>
                <option value="presupuesto">Presupuesto</option>
                <option value="nota_de_credito">Nota de Crédito</option>
                <option value="nota_de_debito">Nota de Débito</option>
                <option value="ticket">Ticket</option>
                <option value="recibo">Recibo</option>
                <option value="guia_de_despacho">Guía de Despacho</option>
                <option value="orden_de_compra">Orden de Compra</option>
                <option value="vale">Vale</option>
                <option value="orden_de_trabajo">Orden de Trabajo</option>
                {/* Puedes añadir más opciones según tus necesidades */}
              </FormSelect>
            </div>

            {/* <div className="flex gap-2">
              <FormSelect
                labelText={"Tipo de Pago"}
                placeholder={""}
                props={{ ...register("tipo_pago", { required: true }) }}
                type={"text"}
              >
                <option
                  className="font-bold text-blue-500"
                  value={"Seleccionar el tipo de pago"}
                >
                  Seleccionar el tipo de pago
                </option>
                <option value="efectivo">Efectivo</option>
                <option value="cheque">Cheque</option>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="tarjeta_credito">Tarjeta de Crédito</option>
                <option value="tarjeta_debito">Tarjeta de Débito</option>
                <option value="deposito">Depósito Bancario</option>
                <option value="paypal">PayPal</option>
                <option value="giro">Giro</option>
                <option value="bitcoin">Bitcoin u otra criptomoneda</option>
              </FormSelect>
            </div> */}
          </div>

          <div className="flex mt-3">
            <Button type={"submit"} titulo={"Guardar la orden/etc."} />
          </div>
        </form>
      </div>
      <ModalNuevoProveedor />
    </dialog>
  );
};
