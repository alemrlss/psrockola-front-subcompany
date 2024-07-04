import { useState } from "react";
import { Tabs, Tab, Paper } from "@mui/material";
import QrTransactionSubcompany from "../../components/Transactions/QrTransactionSubcompany";
import RockobitsTransactionsSubcompany from "../../components/Transactions/RockobitsTransactionsSubcompany";
function TransactionsSubcompany() {
  // Estado para controlar la pestaña seleccionada
  const [selectedTab, setSelectedTab] = useState(0);

  // Manejador de cambio de pestaña
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      {/* Barra de pestañas */}
      <Paper elevation={0}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          centered
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Rockobits" />
          <Tab label="Qr" />
        </Tabs>
      </Paper>

      {/* Contenido según la pestaña seleccionada */}
      {selectedTab === 0 && <RockobitsTransactionsSubcompany />}
      {selectedTab === 1 && <QrTransactionSubcompany />}
    </div>
  );
}

export default TransactionsSubcompany;
