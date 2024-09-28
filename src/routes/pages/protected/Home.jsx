import { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import { useCargasContext } from "../../../context/CargasContext";
import { useContratosContext } from "../../../context/ContratosContext";
import { useInformesContext } from "../../../context/InformesContext";

export const Home = () => {
  const { user } = useAuth();

  //GARANTIAS
  const { contratos } = useContratosContext();
  const { cargas } = useCargasContext();
  const { informes } = useInformesContext();

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

  // State to store selected filters
  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Parse and flatten all contracts with associated fabrica
  const allContratos = informes.reduce((acc, informe) => {
    const contratos = informe?.contratos ? JSON.parse(informe.contratos) : [];
    // Map each contrato and add fabrica from informe
    const contratosWithFabrica = contratos.map((contrato) => ({
      ...contrato,
      fabrica: informe.fabrica, // Associate fabrica with each contrato
    }));
    return [...acc, ...contratosWithFabrica];
  }, []);

  // Filter contracts based on selected filters
  const filteredContratos = allContratos.filter((contrato) => {
    const contractDate = new Date(contrato.fechaCreacion);
    const matchesFactory =
      selectedFactory === "" || contrato.fabrica === selectedFactory;

    console.log(
      "Contrato Fabrica:",
      contrato.fabrica,
      "Selected Factory:",
      selectedFactory
    );

    const matchesMonth =
      selectedMonth === "" ||
      contractDate.getMonth() + 1 === parseInt(selectedMonth);

    const matchesYear =
      selectedYear === "" ||
      contractDate.getFullYear() === parseInt(selectedYear);

    return matchesFactory && matchesMonth && matchesYear;
  });

  // Calculate totals
  const totalContratosInformes = filteredContratos.length;
  const pendientes = filteredContratos.filter(
    (contrato) => contrato.estado === "pendiente"
  ).length;

  const entregados = filteredContratos.filter(
    (contrato) => contrato.estado === "entregado"
  ).length;

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
        </div>
      )}

      {user?.sector === "informes" && (
        <div className="bg-white">
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
          <div className="my-6 grid grid-cols-5 gap-4 px-10">
            <select
              value={selectedFactory}
              onChange={(e) => setSelectedFactory(e.target.value)}
              className="p-2 rounded bg-white border-gray-300 border text-sm font-semibold outline-none capitalize"
            >
              <option className="font-bold capitalize" value="">
                Todas las fábricas
              </option>
              {/* Dynamically generate factory options */}
              {[...new Set(informes.map((informe) => informe.fabrica))].map(
                (fabrica) => (
                  <option
                    className="font-semibold capitalize"
                    key={fabrica}
                    value={fabrica}
                  >
                    {fabrica}
                  </option>
                )
              )}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 rounded bg-white border-gray-300 border text-sm font-semibold outline-none capitalize"
            >
              <option className="font-bold" value="">
                Todos los meses
              </option>
              {[...Array(12).keys()].map((month) => (
                <option
                  className="font-semibold capitalize"
                  key={month + 1}
                  value={month + 1}
                >
                  {new Date(0, month).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="p-2 rounded bg-white border-gray-300 border text-sm font-semibold outline-none"
            >
              <option className="font-bold capitalize" value="">
                Todos los años
              </option>
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                <option
                  className="font-semibold capitalize"
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Totals */}
          <div className="grid grid-cols-3 gap-4 px-10">
            <div className="py-5 px-4 bg-gray-800 rounded-lg border-t-4 border-blue-500">
              <p className="font-bold text-center text-white">
                Total contratos cargados
              </p>
              <p className="font-bold text-center text-xl text-blue-400">
                {totalContratosInformes}
              </p>
            </div>
            <div className="py-5 px-4 bg-gray-800 rounded-lg border-t-4 border-[#FD454D]">
              <p className="font-bold text-center text-white">
                Total contratos pendientes
              </p>
              <p className="font-bold text-center text-xl text-[#FD454D]">
                {pendientes}
              </p>
            </div>
            <div className="py-5 px-4 bg-gray-800 rounded-lg border-t-4 border-green-500">
              <p className="font-bold text-center text-white">
                Total contratos entregados
              </p>
              <p className="font-bold text-center text-xl text-green-500">
                {entregados}
              </p>
            </div>
          </div>
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
