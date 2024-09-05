import { useAuth } from "../../../context/AuthProvider";
import { useCargasContext } from "../../../context/CargasContext";
import { useContratosContext } from "../../../context/ContratosContext";

export const Home = () => {
  const { user } = useAuth();

  //GARANTIAS
  const { contratos } = useContratosContext();
  const { cargas } = useCargasContext();

  const contratosFiltrados = contratos.filter(
    (contrato) => contrato.estado === "enviado a informes, completo"
  );

  const totalContratos = contratosFiltrados.length;

  const contratosFiltradosConPlateas = contratos.filter(
    (contrato) => contrato.estado === "en sección con platea"
  );

  const totalContratosConPlateas = contratosFiltradosConPlateas.length;

  const contratosFiltradosSinPlateas = contratos.filter(
    (contrato) => contrato.estado === "en sección sin platea"
  );

  const totalContratosSinPlateas = contratosFiltradosSinPlateas.length;

  const contratosEnEspera = contratos.filter(
    (contrato) => contrato.estado === "por garantizar"
  );

  const totalContratosEnEspera = contratosEnEspera.length;

  const horaActual = new Date().getHours();
  let saludo;

  if (horaActual >= 6 && horaActual < 12) {
    saludo = "¡Buenos días";
  } else if (horaActual >= 12 && horaActual < 18) {
    saludo = "¡Buenas tardes";
  } else {
    saludo = "¡Buenas noches";
  }
  //FIN GARANTIAS

  return (
    <section className="w-full h-full min-h-screen max-h-full max-w-full">
      {user?.sector === "garantias" && (
        <div>
          <div className="py-32 px-10 bg-gray-700">
            <div className="w-1/2 mx-auto">
              <p className="font-bold text-white text-xl max-md:text-base">
                {saludo}, {user.username}!
              </p>
              <p className="font-medium text-sm mt-2 text-white">
                Tu camino en Prisma Tecnohouse Gestión no ha hecho más que
                empezar. A partir de ahora, cada acción que resuelvas potenciará
                la gestión de tu sector de {user.sector}. ¡Allá vamos!
              </p>
            </div>
          </div>

          <div className="bg-white py-10 px-10 w-1/2 mx-auto rounded-b-xl shadow-xl h-[50vh]">
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-400 py-5 px-5 rounded-md cursor-pointer hover:shadow-lg transition-all">
                <p className="text-[#FD454D] font-bold">Contratos cargados.</p>
                <p className="font-bold text-xl">{contratos.length}</p>
              </div>
              <div className="border border-gray-400 py-5 px-5 rounded-md cursor-pointer hover:shadow-lg transition-all">
                <p className="text-[#FD454D] font-bold">
                  Contratos finalizados enviado a informes.
                </p>
                <p className="font-bold text-xl">{totalContratos}</p>
              </div>
              <div className="border border-gray-400 py-5 px-5 rounded-md cursor-pointer hover:shadow-lg transition-all">
                <p className="text-gray-800 font-bold">
                  Contratos con plateas por garantizar.
                </p>
                <p className="font-bold text-xl">{totalContratosConPlateas}</p>
              </div>
              <div className="border border-gray-400 py-5 px-5 rounded-md cursor-pointer hover:shadow-lg transition-all">
                <p className="text-gray-800 font-bold">
                  Contratos sin plateas por garantizar.
                </p>
                <p className="font-bold text-xl">{totalContratosSinPlateas}</p>
              </div>
              <div className="border border-gray-400 py-5 px-5 rounded-md cursor-pointer hover:shadow-lg transition-all">
                <p className="text-blue-600 font-bold">
                  Contratos en espera de garantización.
                </p>
                <p className="font-bold text-xl">{totalContratosEnEspera}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.sector === "carga" && (
        <div>
          <div className="py-32 px-10 bg-gray-700">
            <div className="w-1/2 mx-auto">
              <p className="font-bold text-white text-xl max-md:text-base">
                {saludo}, {user.username}!
              </p>
              <p className="font-medium text-sm mt-2 text-white">
                Tu camino en Prisma Tecnohouse Gestión no ha hecho más que
                empezar. A partir de ahora, cada acción que resuelvas potenciará
                la gestión de tu sector de {user.sector}. ¡Allá vamos!
              </p>
            </div>
          </div>

          <div className="bg-white py-10 px-10 w-1/2 mx-auto rounded-b-xl shadow-xl h-[50vh]">
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-400 py-5 px-5 rounded-md cursor-pointer hover:shadow-lg transition-all">
                <p className="text-[#FD454D] font-bold">Registros cargados</p>
                <p className="font-bold text-xl">{cargas.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.sector === "control-garita" && (
        <div>
          <div className="py-32 px-10 bg-gray-700">
            <div className="w-1/2 mx-auto">
              <p className="font-bold text-white text-xl max-md:text-base">
                {saludo}, {user.username}!
              </p>
              <p className="font-medium text-sm mt-2 text-white">
                Tu camino en Prisma Tecnohouse Gestión no ha hecho más que
                empezar. A partir de ahora, cada acción que resuelvas potenciará
                la gestión de tu sector de {user.sector}. ¡Allá vamos!
              </p>
            </div>
          </div>

          {/* <div className="bg-white py-10 px-10 w-1/2 mx-auto rounded-b-xl shadow-xl h-[50vh]">
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-400 py-5 px-5 rounded-md cursor-pointer hover:shadow-lg transition-all">
                <p className="text-[#FD454D] font-bold">Registros cargados</p>
                <p className="font-bold text-xl">{garitas.length}</p>
              </div>
            </div>
          </div> */}
        </div>
      )}

      {user?.sector === "proveedores" && (
        <div>
          <div className="py-32 px-10 bg-gray-700">
            <div className="w-1/2 mx-auto">
              <p className="font-bold text-white text-xl max-md:text-base">
                {saludo}, {user.username}!
              </p>
              <p className="font-medium text-sm mt-2 text-white">
                Tu camino en Prisma Tecnohouse Gestión no ha hecho más que
                empezar. A partir de ahora, cada acción que resuelvas potenciará
                la gestión de tu sector de {user.sector}. ¡Allá vamos!
              </p>
            </div>
          </div>

          <div className="bg-white py-10 px-10 w-1/2 mx-auto rounded-b-xl shadow-xl h-[50vh]">
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-gray-400 py-5 px-5 rounded-md cursor-pointer hover:shadow-lg transition-all">
                <p className="text-[#FD454D] font-bold">
                  Proveedores cargados.
                </p>
                <p className="font-bold text-xl">{contratos.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
