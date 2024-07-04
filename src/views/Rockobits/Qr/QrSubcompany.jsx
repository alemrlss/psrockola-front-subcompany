import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../api/api";
import { updateUserBalance } from "../../../features/authSlice";
import TablePagination from "@mui/material/TablePagination";
import Sound from "../../../../public/audio/Coin.wav";
import { useTranslation } from "react-i18next";
import QrListSubcompany from "../../../components/Rockobits/Qr/QrListSubcompany";

function QrSubcompany() {
  const { t } = useTranslation();

  const audioRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [expirationTime, setExpirationTime] = useState("1h");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [qrList, setQrList] = useState([]);
  const [filterState, setFilterState] = useState("1");
  const [errorQrList, setErrorQrList] = useState(null);

  const [selectedQr, setSelectedQr] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchQrList();
  }, [user.id, filterState, page, rowsPerPage]); // Se vuelve a cargar la lista cuando cambia el estado del filtro

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const fetchQrList = async () => {
    try {
      setErrorQrList(null);
      let url = `qr/rockobits-subcompany?subcompanyId=${user.id}`;

      if (filterState !== null) {
        url += `&state=${filterState}`;
      }

      const response = await api.get(url, {
        params: {
          take: rowsPerPage,
          skip: page * rowsPerPage,
        },
      });

      setQrList(response.data.data.qrs);
      setTotalCount(response.data.data.total);

      const activeExpiredQrs = response.data.data.qrs.filter(
        (qr) => qr.state === 1 && new Date(qr.expiration) < new Date()
      );

      if (activeExpiredQrs.length > 0) {
        fetchExpiredFunds();
      }
    } catch (error) {
      if (
        error.response.data.statusCode === 400 &&
        error.response.data.message === "NO_MEMBERSHIP_ACTIVATED"
      ) {
        setQrList([]);
        setErrorQrList("NO MEMBERSHIP ACTIVATE");
      }
    }
  };

  const fetchExpiredFunds = async () => {
    try {
      console.log(qrList);
      const response = await api.get(
        `/qr/return-expired-funds-subcompany/${user.id}`
      );
      const totalReturnedAmount = response.data.data;
      if (totalReturnedAmount > 0) {
        const newBalance =
          parseInt(user.balance) + parseInt(totalReturnedAmount);
        dispatch(updateUserBalance(newBalance.toString()));
      }

      fetchQrList();
    } catch (error) {
      console.error("Error returning expired funds:", error);
    }
  };

  const handleGenerateQR = async () => {
    try {
      const requestData = {
        amount: parseInt(amount),
        subcompanyId: user.id,
        expiration: expirationTime,
      };

      const response = await api.post(
        "/qr/generate-rockobits-subcompany",
        requestData
      );
      if (response.status === 201) {
        setErrorMessage("");
        setSuccessMessage("QR generated successfully");
        setAmount("");
        setExpirationTime("1h");

        const newBalance = user.balance - parseInt(amount);
        dispatch(updateUserBalance(newBalance));
        playSound();
        fetchQrList();

        handleShowQr(response.data);
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.log(error.response.data);
      if (
        error.response.data.statusCode === 400 &&
        error.response.data.message === "NO_MEMBERSHIP_ACTIVATED"
      ) {
        setErrorMessage("NO MEMBERHSIP ACTIVATE");
        return;
      }

      if (
        error.response.data.statusCode === 400 &&
        error.response.data.message === "INSUFFICIENT_FUNDS"
      ) {
        setErrorMessage("INSUFFICIENT FUNDS");
        return;
      }

      if (
        error.response.data.statusCode === 400 &&
        error.response.data.message === "AMOUNT_MUST_BE_GREATER_THAN_ZERO"
      ) {
        setErrorMessage("Amount must be greater than zero");
        return;
      }

      setErrorMessage("Error generating QR");
      setSuccessMessage("");
    }
  };

  const handleShowQr = (qr) => {
    setSelectedQr(qr);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Box
        maxWidth="md"
        mx="auto"
        mt={2}
        mb={4}
        p={6}
        borderRadius={4}
        boxShadow={3}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {t("view_rockobits_qr_title")}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("view_rockobits_qr_amount")}
              variant="outlined"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                {t("view_rockobits_qr_expire")}
              </FormLabel>
              <RadioGroup
                row
                aria-label="expiration-time"
                name="expiration-time"
                value={expirationTime}
                onChange={(e) => {
                  setExpirationTime(e.target.value);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
              >
                <FormControlLabel
                  value="1m"
                  control={<Radio />}
                  label={t("view_rockobits_qr_1_minute")}
                />
                <FormControlLabel
                  value="1h"
                  control={<Radio />}
                  label={t("view_rockobits_qr_1_hour")}
                />
                <FormControlLabel
                  value="3h"
                  control={<Radio />}
                  label={t("view_rockobits_qr_3_hour")}
                />
                <FormControlLabel
                  value="1d"
                  control={<Radio />}
                  label={t("view_rockobits_qr_1_day")}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleGenerateQR}
              sx={{
                backgroundColor: "#F79303",
                color: "white",
                "&:hover": {
                  backgroundColor: "#E98B05",
                },
              }}
            >
              {t("view_rockobits_qr_button")}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </div>
      <div>
        <Divider />
        <h2 className="text-3xl text-center mt-2">
          {t("view_rockobits_qr_codes")}
        </h2>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="filter-state"
            name="filter-state"
            value={filterState}
            onChange={(e) => {
              setFilterState(
                e.target.value === "null" ? null : parseInt(e.target.value)
              );
            }}
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label={t("view_rockobits_qr_codes_active")}
            />
            <FormControlLabel
              value="0"
              control={<Radio />}
              label={t("view_rockobits_qr_codes_inactive")}
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label={t("view_rockobits_qr_codes_consumed")}
            />
            <FormControlLabel
              value="3"
              control={<Radio />}
              label={t("view_rockobits_qr_codes_expired")}
            />
            <FormControlLabel
              value="null"
              control={<Radio />}
              label={t("view_rockobits_qr_codes_all")}
            />
          </RadioGroup>
        </FormControl>
      </div>
      <QrListSubcompany
        playSound={playSound}
        qrList={qrList}
        setQrList={setQrList}
        fetchQrList={fetchQrList}
        errorQrList={errorQrList}
        user={user}
        dispatch={dispatch}
        selectedQr={selectedQr}
        isModalOpen={isModalOpen}
        handleShowQr={handleShowQr}
        handleCloseModal={handleCloseModal}
      />
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[20]}
        labelRowsPerPage={"Filas por página:"}
      />
      <audio ref={audioRef} src={Sound} />
    </div>
  );
}

export default QrSubcompany;
