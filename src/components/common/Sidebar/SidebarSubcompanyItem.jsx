/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

function SidebarEmployeeItem({
  item,
  handleDrawerToggle,
  handleItemClick,
  activeItem,
  t,
}) {
  const handleClick = () => {
    handleItemClick(item.id);
  };

  return (
    <Link
      to={`${item.id}`}
      key={item.id}
      onClick={item.subItems ? null : handleDrawerToggle}
    >
      <ListItemButton
        selected={item.id === activeItem}
        onClick={handleClick}
        sx={{
          display: "flex",
          marginLeft: "30px",
          marginRight: "30px",
          color: "white",

          "&:hover": {
            backgroundColor: "#8087DF",
            borderRadius: "60px",
            fontWeight: "bold",
          },
          "&:not(:hover)": {
            backgroundColor: "transparent",
            borderRadius: "40px",
            fontWeight: "bold",
          },
          "&.Mui-selected": {
            backgroundColor: "#f0f0f0",
            color: "#555CB3",
            fontWeight: "bold",
            borderRadius: "60px",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#f0f0f0",
            color: "#555CB3",
            fontWeight: "bold",
            borderRadius: "60px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          className="space-x-4"
        >
          <ListItemIcon
            sx={{
              color: item.id === activeItem ? "#555CB3" : "white",
              minWidth: 0,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText sx={{ ml: 0 }} primary={t(item.translationKey)} />
        </Box>
      </ListItemButton>
    </Link>
  );
}

export default SidebarEmployeeItem;
