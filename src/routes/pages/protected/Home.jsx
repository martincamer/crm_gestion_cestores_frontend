import { useAuth } from "../../../context/AuthProvider";
import { useContratosContext } from "../../../context/ContratosContext";

export const Home = () => {
  const { user } = useAuth();

  const { contratos } = useContratosContext();

  // Filtrar contratos donde el estado sea "enviado a informes, completo"
  const contratosFiltrados = contratos.filter(
    (contrato) => contrato.estado === "enviado a informes, completo"
  );

  // Obtener el número total de contratos filtrados
  const totalContratos = contratosFiltrados.length;

  const horaActual = new Date().getHours();
  let saludo;

  if (horaActual >= 6 && horaActual < 12) {
    saludo = "¡Buenos días";
  } else if (horaActual >= 12 && horaActual < 18) {
    saludo = "¡Buenas tardes";
  } else {
    saludo = "¡Buenas noches";
  }

  return (
    <section className="w-full h-full min-h-screen max-h-full max-w-full">
      {user?.sector === "Garantias" && (
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
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
