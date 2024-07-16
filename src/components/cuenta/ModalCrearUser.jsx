import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthProvider";
import { Label } from "../formularios/Label";
import { Input } from "../formularios/Input";
import { InputPassword } from "../formularios/InputPassword";
import { Button } from "../formularios/Button";
import { toast } from "react-toastify";
import client from "../../api/axios";

export const ModalCrearUser = ({ isOpen, closeModal }) => {
  const { setError, error } = useAuth();

  const signup = async (data) => {
    try {
      const response = await client.post("/signup-two", data);

      setTimeout(() => {
        location.reload();
      }, 1000);

      toast.success("Usuario creado correctamente!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      closeModal();

      return response.data;
    } catch (error) {}
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signup(data);
  });

  return (
    <Menu as="div" className="z-50">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-[500px] p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="text-lg text-indigo-500 mb-3 border-b-[1px] uppercase">
                  Crear nuevo usuario
                </div>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={onSubmit}
                  action=""
                >
                  <div className="flex flex-col gap-2">
                    <Label label="Email del registro" />
                    <Input
                      register={register}
                      placeholder={"emailregistro@email.com"}
                      type={"email"}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label label="Usuario" />
                    <Input
                      register={register}
                      placeholder={"@Usuario"}
                      type={"username"}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label label="Rol" />
                    <Input
                      register={register}
                      placeholder={"1 admin - 2 user"}
                      type={"role_id"}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label label="Contraseña" />
                    <InputPassword register={register} type={"password"} />
                  </div>

                  <Button type={"submit"} titulo={"Registrar Usuario"} />
                </form>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 cursor-pointer max-md:text-xs"
                    onClick={closeModal}
                  >
                    Cerrar Ventana
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Menu>
  );
};
