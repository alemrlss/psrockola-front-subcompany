/* eslint-disable react/prop-types */
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import LogoutIcon from "@mui/icons-material/Logout";
import SidebarSubcompanyCollapse from "./SidebarSubcompanyCollapse";
import SidebarCompanyItem from "./SidebarSubcompanyItem";
import SidebarSubcompanyLogout from "./SidebarSubcompanyLogout";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import QrCode2Icon from "@mui/icons-material/QrCode2";

function SidebarSubcompany({ handleDrawerToggle }) {
  const { t } = useTranslation();

  const [activeItem, setActiveItem] = useState(location.pathname);

  const user = useSelector((state) => state.auth.user);
  const handleItemClick = (itemId) => {
    localStorage.setItem("test", itemId);
    setActiveItem(itemId);
    handleDrawerToggle();
  };
  useEffect(() => {
    const pathname = location.pathname;
    setActiveItem(pathname);
  }, [location.pathname]);

  const menuItems = [
    {
      id: "/subcompanies/dashboard",
      translationKey: "menu_dashboard",
      name: "Dashboard",
      icon: <DashboardIcon />,
      subItems: null,
    },
    {
      id: "/subcompanies/screens",
      translationKey: "menu_screens",
      name: "Screens",
      icon: <ScreenShareIcon />,
      subItems: null,
    },
    {
      id: "/subcompanies/rockobits",
      translationKey: "menu_rockobits",
      name: "Rockobits",
      icon: <AttachMoneyIcon />,
      subItems: [
        {
          id: "/subcompanies/rockobits/sale",
          translationKey: "menu_sale",
          name: "Sale",
          icon: <MonetizationOnIcon />,
        },
        {
          id: "/subcompanies/rockobits/qr",
          translationKey: "menu_qr",
          name: "QR Code",
          icon: <QrCode2Icon />,
        },
      ],
    },
    {
      id: "/subcompanies/transactions",
      translationKey: "menu_transactions",
      name: "Transactions",
      icon: <DashboardIcon />,
      subItems: null,
    },
  ];

  return (
    <div className="bg-[#555CB3] overflow-y-auto h-full flex flex-col">
      <div className="flex flex-col mx-8 justify-center items-center space-x-2 my-4">
        <h2
          style={{ textShadow: "2px 2px 1px #B45946", color: "white" }}
          className="font-semibold text-white text-xl tracking-widest text-shadow-lg"
        >
          PSROCKOLA
        </h2>
        <h2
          style={{ textShadow: "2px 2px 1px #B45946", color: "white" }}
          className="font-semibold text-white text-xl tracking-widest text-shadow-lg"
        >
          {t("psrockola_subcompany")}
        </h2>
      </div>
      <Divider />
      <List>
        {menuItems
          .filter((item) => {
            //Si
            if (item.allowEmployee === false && user.type === 22) {
              return false;
            }

            // Si el usuario no es una empresa y el acceso no está permitido para empleados, redirige a Unauthorized
            if (
              item.enableCurrentPlaylist === false &&
              user.enableCurrentPlaylist === false
            ) {
              return false;
            }

            return true;
          })
          .map((item, index) => {
            // Renderizar el elemento normalmente si no se cumple la condición anterior
            return item.subItems ? (
              <SidebarSubcompanyCollapse
                item={item}
                key={index}
                handleDrawerToggle={handleDrawerToggle}
                handleItemClick={handleItemClick}
                activeItem={activeItem}
                t={t}
              />
            ) : (
              <SidebarCompanyItem
                item={item}
                key={index}
                handleDrawerToggle={handleDrawerToggle}
                handleItemClick={handleItemClick}
                activeItem={activeItem}
                t={t}
              />
            );
          })}
      </List>

      <div className="mt-auto mb-5">
        <SidebarSubcompanyLogout
          item={{
            id: "logout",
            translationKey: "menu_logout",
            icon: <LogoutIcon />,
            subItems: null,
          }}
        />
      </div>
    </div>
  );
}

export default SidebarSubcompany;
