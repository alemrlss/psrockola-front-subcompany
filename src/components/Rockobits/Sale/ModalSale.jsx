/* eslint-disable react/prop-types */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function ModalSale({
  isModalOpen,
  handleCloseModal,
  userData,
  quantity,
  transferRockobits,
  errorModal,
}) {
  const { t } = useTranslation();
  return (
    <Dialog open={isModalOpen} onClose={handleCloseModal}>
      <DialogTitle>{t("view_rockobits_modal_title")}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          <strong>{t("view_rockobits_modal_name")}:</strong> {userData && userData.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>{t("view_rockobits_modal_email")}:</strong> {userData && userData.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>{t("view_rockobits_modal_amount")}:</strong> {quantity}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          pt: "16px",
        }}
      >
        <Button
          onClick={transferRockobits}
          variant="contained"
          color="primary"
          sx={{
            bgcolor: "#F79303",
            color: "white",
            "&:hover": {
              bgcolor: "#E98B05",
            },
          }}
        >
          {t("view_rockobits_modal_button_sale")}
        </Button>
        <Button
          onClick={handleCloseModal}
          variant="contained"
          color="error"
          sx={{
            bgcolor: "#D20103",
            color: "white",
            "&:hover": {
              bgcolor: "#B30000",
            },
          }}
        >
          {t("view_rockobits_modal_button_cancel")}
        </Button>
      </DialogActions>

      {errorModal && (
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            color="error"
            sx={{
              color: "#F44336",
              fontWeight: "bold",
              mb: 1,
            }}
          >
            {errorModal}
          </Typography>
          
        </DialogContent>
      )}
    </Dialog>
  );
}

export default ModalSale;
