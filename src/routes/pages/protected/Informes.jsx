import { useEffect, useState } from "react";
import { useInformesContext } from "../../../context/InformesContext";
import { useObtenerId } from "../../../helpers/useObtenerId";
import { FaArrowLeft, FaArrowRight, FaPrint, FaSearch } from "react-icons/fa";
import { formatearFecha } from "../../../helpers/formatearFecha";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import client from "../../../api/axios";
import { MdDelete } from "react-icons/md";

export const Informes = () => {
  const { informes } = useInformesContext();
  const { handleObtenerId, idObtenida } = useObtenerId();

  return (
    <section className="h-full max-h-full w-full max-w-full min-w-full">
      <div className="bg-gray-100 py-10 px-10 flex justify-between items-center">
        <p className="font-bold text-xl">Sector de salidas, registros, etc.</p>
        <div className="flex gap-2">
          <button
            onClick={() =>
              document.getElementById("my_modal_nueva_fabrica").showModal()
            }
            className="flex gap-2 items-center font-semibold text-sm bg-[#FD454D] hover:bg-[#ef4242] text-white py-2 rounded-md px-2 transition-all"
          >
            Cargar nueva fabrica, para entregas
          </button>
        </div>
      </div>

      <div className="bg-white px-10 py-5">
        <table className="table">
          <thead>
            <tr className="font-extrabold text-sm text-black">
              <th>Referencia</th>
              <th>Nombre de la fabrica</th>
            </tr>
          </thead>
          <tbody className="text-xs font-medium capitalize">
            {informes
              ?.sort((a, b) => b.id - a.id)
              ?.map((fabrica) => (
                <tr key={fabrica.id}>
                  <th>{fabrica.id}</th>
                  <th>{fabrica.fabrica}</th>
                  <th>
                    <div className="flex gap-4 items-center">
                      <Link
                        to={`/informes-fabrica/${fabrica.id}`}
                        className="text-xs bg-blue-500 py-2 px-4 rounded-md text-white flex gap-2 items-center hover:shadow-md"
                      >
                        Cargar contratos <FaArrowRight />
                      </Link>

                      <MdDelete
                        onClick={() => {
                          handleObtenerId(fabrica.id);
                          document
                            .getElementById("my_modal_eliminar")
                            .showModal();
                        }}
                        className="text-2xl text-red-500 cursor-pointer"
                      />
                    </div>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ModalNuevoRegistro />
      <ModalEliminar idObtenida={idObtenida} />
    </section>
  );
};

const ModalNuevoRegistro = () => {
  const { setInformes } = useInformesContext();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (formData) => {
    try {
      const ordenData = {
        ...formData,
      };

      const res = await client.post("/informes", ordenData);

      setInformes(res.data.todosLosInformes);

      reset();

      document.getElementById("my_modal_nueva_fabrica").close();

      toast.success("¡Fabrica cargado correctamente!", {
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

  return (
    <dialog id="my_modal_nueva_fabrica" className="modal">
      <div className="modal-box rounded-md max-w-2xl">
        <form method="dialog">
          {/* Si hay un botón en el formulario, cerrará el modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-xl">
          Cargar nueva fabrica, para informes.
        </h3>
        <p className="py-1 text-sm font-medium">
          En esta sección podras cargar una nueva fabrica para hacer informes
          sobre entregas, etc.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div className="">
            <div className="flex flex-col gap-2 w-full">
              <label className="font-bold text-sm">Nombre de la fabrica</label>
              <input
                {...register("fabrica")}
                className="border px-2 py-1.5 text-sm text-gray-700 rounded-md outline-none focus:border-blue-600 w-1/2"
                placeholder="Escribir el nombre de la fabrica..."
              />
            </div>
          </div>

          <div className="mt-6">
            <button className="font-semibold text-sm bg-gray-700 py-1 px-4 rounded-md text-white">
              Guardar la fabrica
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

const ModalEliminar = ({ idObtenida }) => {
  const { handleSubmit } = useForm();

  const { setInformes } = useInformesContext();

  const onSubmit = async (formData) => {
    try {
      const cargasData = {
        datos: {
          ...formData,
        },
      };

      const res = await client.delete(`/informes/${idObtenida}`, cargasData);

      setInformes(res.data.todosLosInformes);

      toast.error("¡Fabrica eliminada correctamente!", {
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
            Eliminar la fabrica cargada..
          </div>
          <div className="text-sm text-gray-400 text-center mt-1">
            La fabrica no podra ser recuperada nunca mas, no recuperaras todo lo
            cargado...
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
