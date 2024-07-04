import { Box, Button, TextField, Divider, Grid, Alert } from "@mui/material";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../../api/api";

function ChangePasswordSubcompany({ user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePassword = async () => {
    if (newPassword === confirmPassword) {
      try {
        setLoading(true);
        setError(null); 

        const response = await api.patch(`/auth/change-password-subcompany/${user.id}`, {
          password: currentPassword,
          newPassword: newPassword,
        });

        console.log(response.data);

        setSuccessMessage(`Password changed successfully`); 
        setConfirmPassword("");
        setCurrentPassword("");
        setNewPassword("");
        setLoading(false);

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (error) {
        console.log(error);
        setLoading(false);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          if (error.response.data.message === "PASSWORD_INCORRECT") {
            setError("Current password is incorrect");
          }
        } else {
          setError("An unexpected error occurred"); // Error genérico
        }

        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } else {
      setError("Passwords do not match!");

      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleCurrentPasswordChange = (event) => {
    setError("");
    setSuccessMessage("");
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setError("");
    setSuccessMessage("");
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setError("");
    setSuccessMessage("");
    setConfirmPassword(event.target.value);
  };

  return (
    <Box
      sx={{
        border: 1,
        padding: 2,
        borderRadius: 2,
        borderColor: "grey.500",
        boxShadow: 1,
        width: "100%",
      }}
    >
      <TextField
        type="password"
        label="Current Password"
        fullWidth
        value={currentPassword}
        onChange={handleCurrentPasswordChange}
        sx={{ mb: 2 }}
        size="small"
      />

      <Divider sx={{ mb: 2, borderColor: "grey.500" }} />

      <TextField
        type="password"
        label="New Password"
        fullWidth
        value={newPassword}
        onChange={handleNewPasswordChange}
        sx={{ mb: 2 }}
        size="small"
      />
      <TextField
        size="small"
        type="password"
        label="Confirm New Password"
        fullWidth
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        sx={{ mb: 2 }}
      />

      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            
          >
            {loading ? <CircularProgress size={20} /> : "Change"}
          </Button>
        </Grid>
        <Grid item>
          {error && (
            <Alert severity="error" sx={{ mb: 0 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 0 }}>
              {successMessage}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChangePasswordSubcompany;
