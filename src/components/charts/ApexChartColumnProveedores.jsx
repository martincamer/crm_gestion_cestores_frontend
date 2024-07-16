import React from "react";
import ReactApexChart from "react-apexcharts";
import { formatearDinero } from "../../helpers/formatearDinero";

const ApexChartColumnProveedores = ({ proveedores }) => {
  // Extraer los valores de haber de cada proveedor
  const datosProveedores = proveedores.map((proveedor) => ({
    proveedor: proveedor.proveedor,
    haber: parseFloat(proveedor.haber),
  }));

  // Ordenar proveedores por haber de manera descendente
  datosProveedores.sort((a, b) => b.haber - a.haber);

  // Preparar categorías y datos para el gráfico de columnas
  const categorias = datosProveedores.map((proveedor) =>
    proveedor.proveedor.toUpperCase()
  );
  const data = datosProveedores.map((proveedor) => proveedor.haber);

  // Configuración de ApexChart
  const chartOptions = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categorias,
    },
    yaxis: {
      title: {
        text: "Deudas con proveedores",
      },
      labels: {
        formatter: function (val) {
          return formatearDinero(val); // Formatear valores de haber como dinero
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return formatearDinero(val); // Formatear tooltip como dinero
        },
      },
    },
  };

  // Define la serie con el haber de cada proveedor
  const series = [
    {
      name: "Debemos",
      data: data,
    },
  ];

  return (
    <div className="bg-white py-10 px-10 border border-blue-500">
      <div>
        <p className="font-bold text-red-500">
          Gráfico de deudas con los proveedores
        </p>
      </div>
      <div id="chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default ApexChartColumnProveedores;
