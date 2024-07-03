/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ModalSubcompanyEdit from "./ModalEdit";

function AppBarSubcompany({ drawerWidth, handleDrawerToggle }) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: "white",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: "none" },
            color: "black",
            borderRadius: "50px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {user.balance !== undefined && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "20px",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  color: "black",
                  fontSize: "1.6rem",
                }}
              >
                {user.balance}
              </Typography>
              <Avatar
                src="/rockobit.png"
                sx={{
                  width: 30,
                  height: 30,
                  marginLeft: 1,
                  backgroundColor: "transparent",
                  color: "black",
                }}
              />
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                marginX: { xs: "0px", sm: "10px" },
              }}
            >
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  mr: 1,
                  textAlign: "right",
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  sx={{ color: "black" }}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  color="textSecondary"
                  sx={{
                    fontStyle: "italic",
                    fontSize: "10px",
                  }}
                >
                  {user.type === 22
                    ? t("psrockola_appbar_role_employee")
                    : user.type === 23
                    ? t("psrockola_appbar_role_company")
                    : user.type === 24
                    ? t("psrockola_appbar_role_subcompany")
                    : user.type === 25
                    ? t("psrockola_appbar_role_distributor")
                    : "No Role"}
                </Typography>
              </Box>

              <Avatar
                alt="Andy Avatar"
                src={user.photo}
                sx={{ width: 40, height: 40, cursor: "pointer" }}
                onClick={handleOpenModal}
              />
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {/* Modal para las configuraciones del usuario */}
      <ModalSubcompanyEdit
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        user={user}
      />
    </AppBar>
  );
}

export default AppBarSubcompany;
