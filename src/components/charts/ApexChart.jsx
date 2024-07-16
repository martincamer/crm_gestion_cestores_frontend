import React from "react";
import ReactApexChart from "react-apexcharts";
import { formatearDinero } from "../../helpers/formatearDinero";

// Componente funcional para ApexChart
const ApexChart = ({ ordenes, total }) => {
  // Crear un formateador para los valores en pesos
  const numberFormatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  });

  // Generar datos para el gráfico
  const seriesData = ordenes.map((orden) => parseFloat(orden.total));

  const categoriesData = ordenes.map(
    (orden) => orden.proveedor.toUpperCase() // Convertir a mayúsculas
  );

  // Configuración de ApexChart
  const chartOptions = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: categoriesData, // Categorías basadas en proveedores
    },
    tooltip: {
      y: {
        formatter: (value) => numberFormatter.format(value), // Formato de moneda
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => numberFormatter.format(value), // Convertir el eje Y a pesos
      },
    },
  };

  // Define la serie con el precio final
  const series = [
    {
      name: "Total de la orden",
      data: seriesData, // Datos de precio final
    },
  ];

  return (
    <div className="bg-white py-10 px-10 border border-blue-500">
      <div>
        <p className="font-bold text-blue-500">Grafico de ordenes generadas</p>
      </div>
      <div id="chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="area"
          height={350}
        />
      </div>
      <div className="flex">
        <p className="font-bold text-white-500 bg-red-600 py-1 px-3 text-white">
          Total filtrado {formatearDinero(total)}
        </p>
      </div>
    </div>
  );
};

export default ApexChart;
