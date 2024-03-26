import { useState } from "react";
import { WebVerification } from "vdid-sdk-web";

export const Verify = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //Iniciar la instancia de la verificación
  const vdid = new WebVerification("<-- PUBLIC API KEY -->");

  const createVerification = async () => {
    setLoading(true);
    setError("");

    // Llamada al endpoint para la creación de una nueva verificación
    const response = await fetch("https://veridocid.azure-api.net/api/id/v3/createVerification", {
      method: "POST",
      headers: {
        "x-api-key": "<-- PRIVATE API KEY -->",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "test_sdk_01.26.03.2024", //Identificador de la verificación
        options: {
          checks: {
            selfie: false,
            verifyIp: false,
            onlyVerifyID: false,
          },
          redirect_url: "https://plataforma.sumamexico.com", //Redireccionamiento de la verificación
        },
      }),
    });

    if (response.ok) {
      setLoading(false);
      const uuidIdentifier = await response.text();

      // Obtención e implementación del UUID, para iniciar con el proceso de captura de imagenes
      vdid.verifyIdentity(uuidIdentifier);
    } else {
      setLoading(false);
      const error = await response.json();

      if (error) {
        if (error?.error?.message) {
          const getError = error?.error;
          if (Array.isArray(getError.message)) {
            setError(getError.message[0]);
          } else {
            setError(getError.message);
          }
        } else {
          setError("Hubo un error al crear una verificación. Intente nuevamente más tarde.");
        }
      }
    }
  };

  return (
    <div className="main_content">
      <div className="description">
        <h2>¡Bienvenido a la prueba de verificación!</h2>
        <p>
          Aquí puedes probar nuestra librería npm vdid-sdk-web. Tu retroalimentación sobre su
          funcionamiento es fundamental para nosotros.
        </p>
      </div>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
      <button
        type="button"
        className="btn_start_process"
        onClick={createVerification}
        disabled={loading}
      >
        <span>{loading ? "Cargando..." : "Crear verificación"}</span>
      </button>
    </div>
  );
};
