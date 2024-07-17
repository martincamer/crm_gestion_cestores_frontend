import React from "react";
import { useAuth } from "../../../context/AuthProvider";

export const Perfil = () => {
  const { user } = useAuth();
  console.log(user);
  return (
    <section className="min-h-screen py-10 px-10 flex justify-center mx-auto w-full">
      <div className="bg-white rounded-md py-10 px-10 w-1/2 shadow-2xl">
        <p className="font-bold text-xl mb-6 text-blue-600">
          Perfil del usuario.
        </p>

        <p className="font-bold text-base text-[#FD454D] mb-2">
          Datos de registro
        </p>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col text-sm">
            <p className="font-bold">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div className="flex flex-col text-sm capitalize">
            <p className="font-bold">Usuario</p>
            <p className="font-medium">{user.username}</p>
          </div>
        </div>

        <p className="font-bold text-base text-[#FD454D] mt-4 mb-2">
          Localidad y provincia
        </p>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col text-sm capitalize">
            <p className="font-bold">Localidad</p>
            <p className="font-medium">{user.localidad}</p>
          </div>
          <div className="flex flex-col text-sm capitalize">
            <p className="font-bold">Provincia</p>
            <p className="font-medium">{user.provincia}</p>
          </div>
        </div>

        <p className="font-bold text-base text-[#FD454D] mt-4 mb-2">
          Sector y suc.
        </p>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col text-sm capitalize">
            <p className="font-bold">Sucursal</p>
            <p className="font-medium">{user.sucursal}</p>
          </div>
          <div className="flex flex-col text-sm capitalize">
            <p className="font-bold">Sector</p>
            <p className="font-medium">{user.sector}</p>
          </div>
        </div>

        <div className="mt-10 ">
          <button className="bg-[#FD454D] px-4 py-1 rounded-md text-white font-semibold text-sm">
            Olvide la contraseña
          </button>
        </div>
      </div>
    </section>
  );
};
