import { Document, Text, View, Page, Image, Font } from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import React from "react";
import { formatearDinero } from "../../helpers/formatearDinero";
import { format } from "date-fns"; // Importa format desde date-fns

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

export const ResumenProveedores = ({ proveedores, totalDeudaProveedores }) => {
  const tableStyles = {
    border: "1px solid #000",
    marginTop: 20,
    fontSize: 10,
  };

  const fechaActual = format(new Date(), "dd/MM/yyyy");

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
            Resumen de deudas con proveedores.
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "semibold",
              textTransform: "uppercase",
              fontSize: 10,
            }}
          >
            Fecha {fechaActual}
          </Text>
        </View>
        <View
          style={{
            border: "1px solid #000",
            padding: 10,
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
            Total deuda cargada:{" "}
            <Text
              style={{
                fontFamily: "Montserrat",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: 10,
              }}
            >
              - {formatearDinero(totalDeudaProveedores)}
            </Text>
          </Text>
        </View>

        <View style={tableStyles}>
          <View
            style={{ flexDirection: "row", borderBottom: "1px solid #000" }}
          >
            <View
              style={{
                width: "25%",
                borderRight: "1px solid #000",
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "semibold",
                  fontSize: 10,
                }}
              >
                Proveedor
              </Text>
            </View>
            <View
              style={{
                width: "25%",
                borderRight: "1px solid #000",
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "semibold",
                  fontSize: 10,
                }}
              >
                Localidad
              </Text>
            </View>
            <View
              style={{
                width: "25%",
                borderRight: "1px solid #000",
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "semibold",
                  fontSize: 10,
                }}
              >
                Provincia
              </Text>
            </View>
            <View style={{ width: "25%", padding: 5 }}>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "semibold",
                  fontSize: 10,
                }}
              >
                Haber
              </Text>
            </View>
          </View>

          {proveedores.map((proveedor, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", borderBottom: "1px solid #000" }}
            >
              <View
                style={{
                  width: "25%",
                  borderRight: "1px solid #000",
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 10,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {proveedor.proveedor}
                </Text>
              </View>
              <View
                style={{
                  width: "25%",
                  borderRight: "1px solid #000",
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 10,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {proveedor.localidad}
                </Text>
              </View>
              <View
                style={{
                  width: "25%",
                  borderRight: "1px solid #000",
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 10,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {proveedor.provincia_proveedor}
                </Text>
              </View>
              <View style={{ width: "25%", padding: 5 }}>
                <Text
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: 10,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  - {formatearDinero(Number(proveedor.haber))}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
