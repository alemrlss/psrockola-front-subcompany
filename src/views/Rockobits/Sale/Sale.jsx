import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../api/api";
import { updateUserBalance } from "../../../features/authSlice";
import apiFormData from "../../../api/apiFormData";
import Sound from "../../../../public/audio/Coin.wav";
import ModalSale from "../../../components/Rockobits/Sale/ModalSale";

import {
  TextField,
  Button,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function Sale() {
  const { t } = useTranslation();
  const audioRef = useRef(null);

  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transferFile, setTransferFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errorModal, setErrorModal] = useState("");

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleEmailChange = (event) => {
    setError("");
    setEmail(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setError("");
    setQuantity(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setError("");
    setPaymentMethod(event.target.value);
  };

  const handletransferFileChange = (event) => {
    setError("");
    setTransferFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (quantity <= 0) {
      setError("The quantity must be greater than 0");
      return;
    }

    if (!paymentMethod) {
      setError("You must select a payment method");
      return;
    }

    if (paymentMethod === "transfer" && !transferFile) {
      setError("You must upload the bank transfer file");
      return;
    }

    if (!user.id) {
      setError("Could not get user id");
      return;
    }
    try {
      const response = await api.get(`user/email/${email}`);
      if (response.status === 200) {
        setUserData(response.data.data);
        setIsModalOpen(true);
      } else {
        console.error("Error obtaining customer data:", response.data);
      }
    } catch (error) {
      console.error("Error", error);

      if (error.response.status === 404) {
        setError("Client not found");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setQuantity(0);
    setPaymentMethod("");
    setTransferFile(null);
    setErrorModal("");
  };

  const transferRockobits = async () => {
    try {
      let formData = new FormData();

      const transferData = {
        client_id: userData.id,
        subcompany_id: user.id,
        amount: parseInt(quantity),
      };

      Object.entries(transferData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (paymentMethod === "transfer") {
        formData.append("paymentMethod", "transfer");
        if (!transferFile) {
          setError("Debes subir el archivo de transferencia bancaria");
          return;
        }

        formData.append("voucher", transferFile);
      }

      const response = await apiFormData.post(
        "rockobits/transferSubcompanyToClient",
        formData
      );

      if (response.status === 201) {
        setSuccess(
          `${quantity} Rockobits transferred successfully to ${userData.email}`
        );
        setIsModalOpen(false);
        setEmail("");
        setQuantity(0);
        setPaymentMethod("");
        setTransferFile(null);
        setErrorModal("");

        const newBalance = user.balance - parseInt(quantity);
        dispatch(updateUserBalance(newBalance));
        playSound();

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (error) {
      if (error.response.data.message === "INSUFFICIENT_FUNDS") {
        setErrorModal("Insufficient funds");
      }
    }
  };

  return (
    <Box maxWidth="md" mx="auto" mt={2} p={6} borderRadius={4} boxShadow={3}>
      <Typography variant="h4" align="center" gutterBottom>
        {t("view_rockobits_sale_title")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="email"
          label={t("view_rockobits_sale_email")}
          type="email"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          required
          variant="outlined"
          margin="normal"
        />
        <TextField
          id="quantity"
          label={t("view_rockobits_sale_quantity")}
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          fullWidth
          required
          variant="outlined"
          margin="normal"
        />
        <FormControl component="fieldset" margin="normal" required>
          <FormLabel component="legend">
            {t("view_rockobits_sale_payment")}:
          </FormLabel>
          <RadioGroup
            aria-label="paymentMethod"
            name="paymentMethod"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <FormControlLabel
              value="cash"
              control={<Radio />}
              label={t("view_rockobits_sale_payment")}
            />
            <FormControlLabel
              value="transfer"
              control={<Radio />}
              label={t("view_rockobits_sale_transfer")}
            />
          </RadioGroup>
        </FormControl>
        {paymentMethod === "transfer" && (
          <TextField
            id="transferFile"
            label={t("view_rockobits_sale_upload")}
            type="file"
            onChange={handletransferFileChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{
              accept: "image/png, image/jpeg, image/webp, image/jpg",
            }} // Limitar a archivos PNG y JPEG
          />
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: "#F79303",
            color: "white",
            "&:hover": {
              backgroundColor: "#E98B05",
            },
          }}
        >
          {t("view_rockobits_sale_next")}
        </Button>
      </form>
      {error && (
        <Typography
          variant="body2"
          color="error"
          mt={2}
          sx={{
            color: "#F44336",
            fontWeight: "bold",
          }}
        >
          {error}
        </Typography>
      )}
      {success && (
        <Typography
          variant="body2"
          color="success"
          mt={2}
          sx={{
            color: "#4CAF50",
            fontWeight: "bold",
          }}
        >
          {success}
        </Typography>
      )}
      <ModalSale
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        userData={userData}
        quantity={quantity}
        transferRockobits={transferRockobits}
        errorModal={errorModal}
      />
      <audio ref={audioRef} src={Sound} />
    </Box>
  );
}

export default Sale;
