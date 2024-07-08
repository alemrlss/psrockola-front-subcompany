import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import api from "../api/api";
import { useSelector } from "react-redux";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
];

// Esta función verifica si el idioma actual es válido y devuelve el idioma predeterminado si no es válido.
const getValidLanguage = (currentLanguage) => {
  const validLanguages = languages.map((lang) => lang.code);
  return validLanguages.includes(currentLanguage) ? currentLanguage : "us"; // Por defecto "us" si el idioma no es válido.
};

// Componente de alerta personalizado para usar con Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LanguageSelector() {
  const token = useSelector((state) => state.auth.token);
  const { i18n, t } = useTranslation();

  const user = useSelector((state) => state.auth.user);
  const currentLanguage = getValidLanguage(i18n.language);

  // Estados para notificaciones
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleChangeLanguage = async (event) => {
    const selectedLanguage = event.target.value;

    const isEmployee = user.type === 22;
    const isDistributor = user.type === 25;
    const isCompany = user.type === 23;
    const isSubcompany = user.type === 24;

    if (isEmployee) {
      try {
        const response = await api.post(`employee/change-language/${user.id}`, {
          language: selectedLanguage,
        });

        if (response.status === 201) {
          // Mostrar notificación de éxito
          i18n.changeLanguage(selectedLanguage);
          localStorage.setItem("language", selectedLanguage);
          setSnackbarMessage(t("language_snackbar_message"));
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      } catch (error) {
        // Mostrar notificación de error
        setSnackbarMessage(t("language_snackbar_error"));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else if (isDistributor) {
      try {
        const response = await api.post(
          `distributor/change-language/${user.id}`,
          {
            language: selectedLanguage,
          }
        );

        if (response.status === 201) {
          // Mostrar notificación de éxito
          i18n.changeLanguage(selectedLanguage);
          localStorage.setItem("language", selectedLanguage);
          setSnackbarMessage(t("language_snackbar_message"));
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      } catch (error) {
        // Mostrar notificación de error
        setSnackbarMessage(t("language_snackbar_error"));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else if (isCompany) {
      try {
        const response = await api.post(
          `user/change-language/${user.id}`,
          {
            language: selectedLanguage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          // Mostrar notificación de éxito
          i18n.changeLanguage(selectedLanguage);
          localStorage.setItem("language", selectedLanguage);
          setSnackbarMessage(t("language_snackbar_message"));
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      } catch (error) {
        // Mostrar notificación de error
        setSnackbarMessage(t("language_snackbar_error"));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else if (isSubcompany) {
      try {
        const response = await api.post(
          `subcompany/change-language/${user.id}`,
          {
            language: selectedLanguage,
          }
        );

        if (response.status === 201) {
          // Mostrar notificación de éxito
          i18n.changeLanguage(selectedLanguage);
          localStorage.setItem("language", selectedLanguage);
          setSnackbarMessage(t("language_snackbar_message"));
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        }
      } catch (error) {
        // Mostrar notificación de error
        setSnackbarMessage(t("language_snackbar_error"));
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  // Cerrar la notificación
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <FormControl
        sx={{
          color: "black",
          "& .MuiSelect-select": {
            backgroundColor: "transparent",
          },
          "& .MuiSelect-icon": {
            color: "black",
          },
          "& .MuiSelect-focus": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Select
          label="Language"
          value={currentLanguage}
          onChange={handleChangeLanguage}
          variant="standard"
          sx={{
            "& .MuiSelect-select": {
              backgroundColor: "transparent",
            },
            "& .MuiSelect-icon": {
              color: "black",
            },
            "& .MuiSelect-focus": {
              backgroundColor: "transparent",
            },
          }}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              <p>{lang.name}</p>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Componente Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default LanguageSelector;
