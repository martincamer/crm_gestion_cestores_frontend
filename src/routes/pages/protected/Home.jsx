import { useAuth } from "../../../context/AuthProvider";

export const Home = () => {
  const { user } = useAuth();

  return (
    <section className="w-full h-full min-h-screen max-h-full max-w-full">
      {user?.sector === "Garantias" && (
        <div>
          <div className="mx-5 my-10 bg-white py-6 px-6 max-md:py-3 max-md:px-4 flex justify-between items-center">
            <p className="font-bold text-blue-500 text-xl max-md:text-base">
              Observa las garantias por contratos/clientes finalizadas.
            </p>
            <p className="font-bold">Fecha actual </p>
          </div>
        </div>
      )}
    </section>
  );
};
