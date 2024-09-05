import { Document, Text, View, Page, Image, Font } from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import React from "react";
import { formatearFecha } from "../../helpers/formatearFecha";

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

export const GaritaPdf = ({ datos }) => {
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
          <Image
            style={{
              width: "100px",
            }}
            src={logo}
          />
        </View>

        <View
          style={{
            padding: "20px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Text
              style={{
                fontWeight: "medium",
                fontSize: "12px",
                fontFamily: "Montserrat",
              }}
            >
              Fecha y hora de egreso:
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                fontFamily: "Montserrat",
              }}
            >
              {formatearFecha(datos?.created_at)}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Text
              style={{
                fontWeight: "medium",
                fontSize: "12px",
                fontFamily: "Montserrat",
              }}
            >
              Destino:
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                fontFamily: "Montserrat",
                textTransform: "capitalize",
              }}
            >
              {datos?.destino}
            </Text>
          </View>{" "}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Text
              style={{
                fontWeight: "medium",
                fontSize: "12px",
                fontFamily: "Montserrat",
              }}
            >
              Numero del remito:
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                fontFamily: "Montserrat",
                textTransform: "capitalize",
              }}
            >
              {datos?.numero_remito}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <Text
              style={{
                fontWeight: "medium",
                fontSize: "12px",
                fontFamily: "Montserrat",
              }}
            >
              Autorizo:
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: "12px",
                fontFamily: "Montserrat",
                textTransform: "capitalize",
              }}
            >
              {datos?.autorizo}
            </Text>
          </View>{" "}
        </View>
        <View
          style={{
            padding: "10px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              fontFamily: "Montserrat",
              textTransform: "capitalize",
            }}
          >
            Transporte
          </Text>
          <View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontWeight: "medium",
                  fontSize: "12px",
                  fontFamily: "Montserrat",
                }}
              >
                Chofer:
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "Montserrat",
                  textTransform: "capitalize",
                }}
              >
                {datos?.chofer}
              </Text>
            </View>{" "}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontWeight: "medium",
                  fontSize: "12px",
                  fontFamily: "Montserrat",
                }}
              >
                Dominio y chasis:
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "Montserrat",
                  textTransform: "capitalize",
                }}
              >
                {datos?.dominio_chasis}
              </Text>
            </View>{" "}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontWeight: "medium",
                  fontSize: "12px",
                  fontFamily: "Montserrat",
                }}
              >
                Dominio y acoplado:
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  fontFamily: "Montserrat",
                  textTransform: "capitalize",
                }}
              >
                {datos?.dominio_acoplado}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ border: "1px solid #000", marginTop: "20px" }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: "10px",
              fontFamily: "Montserrat",
              textTransform: "capitalize",
              padding: "10px 40px 40px 10px",
            }}
          >
            Firma y aclaración.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
