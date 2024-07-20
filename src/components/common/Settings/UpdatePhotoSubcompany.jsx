import { useState } from "react";
import { Box, Avatar, Button, Input, Typography } from "@mui/material";
import apiFormData from "../../../api/apiFormData";
import { useDispatch } from "react-redux";
import { updatePhoto } from "../../../features/authSlice";
import { useTranslation } from "react-i18next";

function UpdatePhotoSubcompany({ user }) {
  const { t } = useTranslation();
  const [newPhoto, setNewPhoto] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  const handleChangePhoto = (event) => {
    const file = event.target.files[0];
    setNewPhoto(file);
  };

  const handleUploadPhoto = async () => {
    if (!newPhoto) return;

    try {
      const formData = new FormData();
      formData.append("photo", newPhoto);

      const response = await apiFormData.patch(
        `subcompany/update-photo/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Suponiendo que el backend devuelve el usuario actualizado con la nueva URL de la foto
      const photo = response.data.data.logo;

      dispatch(updatePhoto(photo));
      setSuccessMessage("Photo changed successfully");
      // Actualizar la foto de perfil en la interfaz
      // Puedes manejar esto como prefieras, aquí simplemente lo almacenamos en el estado
      setNewPhoto(null); // Limpiar el input de archivo
    } catch (error) {
      console.error("Error al cambiar la foto de perfil:", error);
      // Manejar el error según sea necesario
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #E0E0E0",
        borderRadius: "8px",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: "16px",
        }}
      >
        <Avatar
          alt="Profile Photo"
          src={newPhoto ? URL.createObjectURL(newPhoto) : user.photo}
          sx={{ width: "100px", height: "100px" }}
        />
      </Box>
      <Box sx={{ mb: "8px" }}>
        <Input type="file" onChange={handleChangePhoto} />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUploadPhoto}
        disabled={!newPhoto}
      >
        {t("settings_photo_upload")}
      </Button>
      {successMessage && (
        <Typography sx={{ mt: 1, color: "green" }}>{successMessage}</Typography>
      )}
    </Box>
  );
}

export default UpdatePhotoSubcompany;
