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

  const [setscreenToPassword, setSetscreenToPassword] = useState(null);

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
    setSetscreenToPassword(screen);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
    setNewPassword("");
    setSetscreenToPassword(null);
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }

    try {
      await api.patch(`/screen/change-password/${setscreenToPassword.id}`, {
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
                justifyContent: "end",
                alignItems: "end",
                margin: "auto",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {selectedVideos.length} of {playlist.length} selected
            </Typography>
          </div>
          <Grid container spacing={2}>
            {playlist.length > 0 ? (
              playlist.map((video) => (
                <Grid item xs={12} key={video.id}>
                  <Box
                    className="p-4 border border-gray-300 rounded"
                    display="flex"
                    alignItems="center"
                    flexDirection={{ xs: "column", sm: "row" }}
                  >
                    <Checkbox
                      checked={selectedVideos.some((v) => v.id === video.id)}
                      onChange={(event) => handleCheckboxChange(event, video)}
                    />
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: { xs: "100%", sm: "250px" },
                        height: { xs: "auto", sm: "140px" },
                        marginBottom: { xs: 2, sm: 0 },
                        marginRight: { sm: 2 },
                      }}
                      src={`${process.env.REACT_APP_BASE_URL}/uploads/thumbnails/${video.thumbnail}`}
                    />
                    <Box flex={1}>
                      <Typography
                        variant="h6"
                        className="font-bold break-words"
                      >
                        {video.name}
                      </Typography>
                      <Typography className="text-gray-600">
                        {video.owner}
                      </Typography>
                      <Typography className="text-gray-600">
                        {formatDateTime(video.created_at)}
                      </Typography>
                      <Typography className="text-gray-600">
                        {msToTime(video.duration)}
                      </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleBanClick(video)}
                      >
                        Ban
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))
            ) : (
              <p>Cargando playlist...</p>
            )}
          </Grid>
        </>
      )}

      {/* Modal for banning individual video */}
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
            width: { xs: "90%", sm: "400px" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Confirm Ban
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Are you sure you want to ban this video?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmBanVideo}
              disabled={isBanning}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsModalOpen(false)}
              disabled={isBanning}
            >
              No
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Modal for banning selected videos */}
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
            width: { xs: "90%", sm: "400px" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="confirmation-modal-title" variant="h6" component="h2">
            Confirm Ban
          </Typography>
          <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to ban the selected videos?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmBanSelected}
              disabled={isBanning}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              onClick={() => setShowConfirmationModal(false)}
              disabled={isBanning}
            >
              No
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Modal for changing password */}
      <Modal
        open={isChangePasswordModalOpen}
        onClose={handleCloseChangePasswordModal}
      >
        <Box
          className="modal-box bg-white p-8 rounded-md shadow-lg"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "400px" },
            outline: "none",
          }}
        >
          <Typography variant="h6" className="mb-4">
            Change Password
          </Typography>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#E2E8F0",
                },
                "&:hover fieldset": {
                  borderColor: "#CBD5E0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#4A5568",
                },
              },
            }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Change
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseChangePasswordModal}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}

export default ScreenSubcompany;
