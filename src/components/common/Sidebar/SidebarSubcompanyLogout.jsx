import { useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/authSlice";

function SidebarEmployeeLogout({ item }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Usar useNavigate en lugar de useHistory

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/login-subcompany");
  };

  return (
    <>
      <ListItemButton
        sx={{
          display: "flex",
          marginLeft: "30px",
          marginRight: "30px",
          "&:hover": {
            backgroundColor: "#8087DF",
            borderRadius: "60px",
          },
          "&:not(:hover)": {
            backgroundColor: "transparent",
            borderRadius: "40px",
          },
        }}
        onClick={() => setOpen(true)}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          className="space-x-4"
        >
          <ListItemIcon sx={{ color: "white", minWidth: 0 }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            sx={{ color: "white", ml: 0 }}
            primary={"Cerrar sesión"}
          />
        </Box>
      </ListItemButton>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            width: 400,
            bgcolor: "white",
            boxShadow: 12,
            p: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <p className="text-xl font-extrabold">
            Are you sure you want to log out?
          </p>
          <Divider
            sx={{
              marginTop: "30px",
              marginBottom: "30px",
            }}
          />
          <div className="flex space-x-4 justify-center">
            <Button
              onClick={handleLogout}
              style={{
                backgroundColor: "#FF0000",
                color: "#FFFFFF",
                fontWeight: "bold",
              }}
            >
              Yes, logout
            </Button>
            <Button
              onClick={() => setOpen(false)}
              style={{ backgroundColor: "#007BFF", color: "#FFFFFF" }}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default SidebarEmployeeLogout;
