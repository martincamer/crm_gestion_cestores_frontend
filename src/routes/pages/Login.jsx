// import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Label } from "../../components/formularios/Label";
import { Input } from "../../components/formularios/Input";
import { Button } from "../../components/formularios/Button";
import { InputPassword } from "../../components/formularios/InputPassword";

export const Login = () => {
  const { signin, error } = useAuth();

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);

    if (user) {
      navigate("/");
    }
  });

  return (
    <section className="h-full justify-center flex items-center">
      <div className="w-3/4 min-h-full h-full max-h-full bg-gradient-to-b from-black to-gray-800">
        <div className="flex mt-5 mx-5">
          <p className="text-blue-700 font-bold text-xl py-2 px-5 rounded-xl bg-white">
            Tecnohouse viviendas
          </p>
        </div>
        <div className="min-h-screen flex px-10 justify-center w-2/3 flex-col gap-1 ">
          <p className="text-white text-2xl font-bold">
            Crm de gestión areas tecnohouse.
          </p>
          <p className="text-white">
            En este sistema podras llevar el control de tus garantias,
            revestimiento, logistica y mas secciónes de tecnohouse.
          </p>
        </div>
      </div>
      <div className="w-3/4 flex justify-center">
        <form
          className="w-1/2 flex flex-col gap-3 bg-white rounded-xl px-10 py-10"
          onSubmit={onSubmit}
        >
          <div>
            <div className="flex justify-center">
              <h4 className="font-semibold text-2xl text-blue-500 max-md:text-xl">
                Te damos la bienvenida
              </h4>
            </div>
            <div className="text-base font-medium text-slate-500 text-center max-md:text-sm">
              Ingresa al crm de gestión sectores{" "}
              <span className="font-bold text-slate-600">Tecnohouse</span>.
            </div>
            {
              <div>
                <div className="flex flex-col gap-1 mt-4">
                  {error?.map((e) => (
                    <span
                      key={e}
                      className="bg-red-50 rounded-xl px-2 text-center font-semibold py-2 text-red-900 text-sm"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            }
          </div>
          <div className="flex flex-col gap-2">
            <Label label="Usuario" />
            <Input
              register={register}
              placeholder={"martin011"}
              type={"username"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label label="Contraseña" />
            <InputPassword
              register={register}
              placeholder={"123456"}
              type={"password"}
            />
          </div>

          <div>
            <Button type={"submit"} titulo={"Iniciar Sesión"} />
          </div>

          <div className="text-sm font-medium text-center mt-5 w-1/2 mx-auto max-md:w-full">
            Si, pide a tu administrador que te cree un usuario 👀.
          </div>
        </form>
      </div>
    </section>
  );
};
