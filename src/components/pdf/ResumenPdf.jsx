import { Document, Text, View, Page, Image, Font } from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import React from "react";
import { formatearDinero } from "../../helpers/formatearDinero";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: normal,
    },
    {
      src: semibold,
      fontWeight: "semibold",
    },
    {
      src: bold,
      fontWeight: "bold",
    },
  ],
});

export const ResumenPdf = ({
  totalOrdenes,
  totalComprobantes,
  totalDeudas,
  fechaInicio,
  fechaFin,
}) => {
  return (
    <Document>
      <Page
        size="A4"
        style={{
          padding: "40px 60px",
          zIndex: "1",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* logo */}
          <Image
            style={{
              width: "100px",
            }}
            src={logo}
          />
        </View>
        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Resumen de la caja proveedores
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "semibold",
              textTransform: "uppercase",
              fontSize: 10,
            }}
          >
            Fecha {fechaInicio} a {fechaFin}
          </Text>
        </View>
        <View
          style={{
            border: "1px solid #000",
            padding: 20,
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "semibold",
              textTransform: "uppercase",
              fontSize: 10,
            }}
          >
            Total deuda proveedores:{" "}
            <Text
              style={{
                fontFamily: "Montserrat",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: 10,
              }}
            >
              - {formatearDinero(totalDeudas)}
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "semibold",
              textTransform: "uppercase",
              fontSize: 10,
            }}
          >
            Total en ordenes:{" "}
            <Text
              style={{
                fontFamily: "Montserrat",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: 10,
              }}
            >
              - {formatearDinero(totalOrdenes)}
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "semibold",
              textTransform: "uppercase",
              fontSize: 10,
            }}
          >
            Total en comprobantes:{" "}
            <Text
              style={{
                fontFamily: "Montserrat",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: 10,
              }}
            >
              + {formatearDinero(totalComprobantes)}
            </Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};
