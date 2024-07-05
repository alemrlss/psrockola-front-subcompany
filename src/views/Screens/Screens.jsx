import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../../api/api";
import msToTime from "../../utils/formatMsToTime";

function ScreenSubcompany() {
  const user = useSelector((state) => state.auth.user);
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoToBan, setVideoToBan] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isBanning, setIsBanning] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [screenToPassword, setScreenToPassword] = useState(null);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await api.get("/screen/subcompany/" + user.id);
        setScreens(response.data.data.screens);
      } catch (error) {
        console.error("Error fetching screens:", error);
      }
    };
    fetchScreens();
  }, [user.id]);

  const handleShowPlaylist = async (screen) => {
    setLoading(true);
    try {
      const response = await api.get(`/play-list-company/${screen.code}`);
      setPlaylist(response.data.data.videos);
      setSelectedScreen(screen);
      setSelectAll(false);
      setSelectedVideos([]);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedScreen(null);
    setPlaylist([]);
  };

  const handleCheckboxChange = (event, video) => {
    if (event.target.checked) {
      setSelectedVideos([...selectedVideos, video]);
    } else {
      setSelectedVideos(selectedVideos.filter((v) => v.id !== video.id));
    }

    setSelectAll(
      selectedVideos.length + 1 === playlist.length && event.target.checked
    );
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedVideos(playlist);
    } else {
      setSelectedVideos([]);
    }
  };

  const handleBanClick = (video) => {
    setVideoToBan(video);
    setIsModalOpen(true);
  };

  const confirmBanVideo = async () => {
    setIsBanning(true);
    try {
      await api.patch(`play-list-company/${videoToBan.id}`, {
        state: 3,
        idCompany: videoToBan.id_company,
        codeScreen: videoToBan.codeScreen,
      });
      const updatedPlaylist = playlist.filter(
        (video) => video.id !== videoToBan.id
      );
      setPlaylist(updatedPlaylist);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error banning video:", error);
    } finally {
      setIsBanning(false);
    }
  };

  const handleBanSelected = async () => {
    if (selectedVideos.length === 0) {
      alert("Please select at least one video to ban");
      return;
    }
    setShowConfirmationModal(true);
  };

  const confirmBanSelected = async () => {
    setIsBanning(true);
    try {
      await Promise.all(
        selectedVideos.map(async (video) => {
          try {
            await api.patch(`play-list-company/${video.id}`, {
              state: 3,
              idCompany: video.id_company,
              codeScreen: video.codeScreen,
            });
          } catch (error) {
            if (
              error.response &&
              error.response.status === 400 &&
              error.response.data.message === "VIDEO_ALREADY_FINISHED"
            ) {
              console.log(`El video ${video.id} ya está completado.`);
              return;
            }
            console.error("Error banning video:", error);
          }
        })
      );
      const updatedPlaylist = playlist.filter(
        (v) =>
          !selectedVideos.some((selectedVideo) => selectedVideo.id === v.id)
      );
      setPlaylist(updatedPlaylist);
      setSelectedVideos([]);
      setSelectAll(false);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error banning videos:", error);
    } finally {
      setIsBanning(false);
    }
  };

  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day} ${monthName} ${year} - ${hours}:${minutes}:${seconds}`;
  };

  const handleOpenChangePasswordModal = (screen) => {
    setIsChangePasswordModalOpen(true);
    setScreenToPassword(screen);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
    setNewPassword("");
    setScreenToPassword(null);
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }

    try {
      await api.patch(`/screen/change-password/${screenToPassword.id}`, {
        newPassword: newPassword,
      });
    } catch (error) {
      console.log(error);
    }

    handleCloseChangePasswordModal();
  };

  return (
    <Container maxWidth="lg">
      {!selectedScreen ? (
        <>
          <Typography variant="h4" className="text-center my-4 font-bold">
            Screens
          </Typography>
          <Divider sx={{ my: 2 }} />
          {screens.length > 0 ? (
            screens.map((screen) => (
              <div
                key={screen.id}
                className="mb-4 p-2 border border-gray-300 bg-gray-200 flex justify-between items-center"
              >
                <Typography variant="h6">
                  {screen.name} - <b>{screen.code}</b>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenChangePasswordModal(screen)}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleShowPlaylist(screen)}
                  >
                    Show Playlist
                  </Button>
                </Box>
              </div>
            ))
          ) : (
            <p>Cargando pantallas...</p>
          )}
        </>
      ) : (
        <>
          <div className="flex space-x-2 mb-6 items-center">
            <IconButton onClick={handleBack} sx={{ color: "black" }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" className="text-xl font-semibold mb-2">
              {selectedScreen.code}
            </Typography>
            <IconButton
              onClick={() => handleShowPlaylist(selectedScreen)}
              sx={{ color: "#ACA6A6", width: "50px", height: "50px" }}
            >
              <RefreshIcon sx={{ width: "30px", height: "30px" }} />
            </IconButton>
          </div>
          <div className="flex space-x-4 mb-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSelectAllChange}
              className="mb-2"
            >
              {selectAll ? "Deselect All" : "Select All"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBanSelected}
              className="mb-2"
            >
              Ban Selected
            </Button>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
                fontSize: "20px",
              }}
            >
              {selectedScreen.name}
            </Typography>
          </div>
          {playlist.length > 0 ? (
            playlist.map((video) => (
              <div
                key={video.id}
                className="mb-4 p-2 border border-gray-300 bg-gray-200 flex justify-between items-center"
              >
                <Checkbox
                  checked={selectedVideos.some((v) => v.id === video.id)}
                  onChange={(event) => handleCheckboxChange(event, video)}
                />
                <Typography variant="subtitle1">
                  {video.title} - <b>{msToTime(video.duration)}</b>
                </Typography>
                <Typography variant="subtitle1">
                  {formatDateTime(video.created_at)}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleBanClick(video)}
                >
                  Ban
                </Button>
              </div>
            ))
          ) : (
            <p>Cargando lista de reproducción...</p>
          )}
        </>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Confirm Ban
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Are you sure you want to ban this video?
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmBanVideo} variant="contained" color="secondary">
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="confirmation-modal-title" variant="h6" component="h2">
            Confirm Ban Selected
          </Typography>
          <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to ban the selected videos?
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={() => setShowConfirmationModal(false)}>Cancel</Button>
            <Button onClick={confirmBanSelected} variant="contained" color="secondary">
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={isChangePasswordModalOpen}
        onClose={handleCloseChangePasswordModal}
        aria-labelledby="change-password-modal-title"
        aria-describedby="change-password-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="change-password-modal-title" variant="h6" component="h2">
            Change Password
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleCloseChangePasswordModal}>Cancel</Button>
            <Button onClick={handleChangePassword} variant="contained" color="primary">
              Change
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}

export default ScreenSubcompany;
