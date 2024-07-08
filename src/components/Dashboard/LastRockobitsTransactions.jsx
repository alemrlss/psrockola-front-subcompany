import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/formatDate";

function LastRockobitsTransactions({ data }) {
  const { t } = useTranslation();
  const renderTypeTransaction = (transaction) => {
    if (transaction.type === "transfer_rockobits_subcompany_to_client") {
      return (
        <TableRow key={transaction.id}>
          <TableCell sx={{ textAlign: "center" }}>
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            Transferencia a Cliente
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            - {transaction.amount}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {" "}
            {transaction.receiverEmployee?.name}{" "}
          </TableCell>
        </TableRow>
      );
    }
    if (transaction.type === "transfer_rockobits_distributor_to_subcompany") {
      return (
        <TableRow key={transaction.id}>
          <TableCell sx={{ textAlign: "center" }}>
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            Transferencia Recibida de Distribuidor
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              color: "green",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            + {transaction.amount}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {" "}
            {transaction.receiverEmployee?.name}{" "}
          </TableCell>
        </TableRow>
      );
    }
    if (transaction.type === "claim_qr_rockobits") {
      return (
        <TableRow key={transaction.id}>
          <TableCell sx={{ textAlign: "center" }}>
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            Reclamo de codigo QR
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            - {transaction.amount}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {" "}
            {transaction.receiverEmployee?.name}{" "}
          </TableCell>
        </TableRow>
      );
    }
  };
  return (
    <>
      <h2 className="text-xl font-bold mt-3 mb-2">
        Last Rockobits Transactions
      </h2>
      <Box
        className="flex items-center"
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <TableContainer className="max-w-xs lg:max-w-full">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#EFF0F2" }}>
                <TableCell sx={{ textAlign: "center" }}>
                  {" "}
                  {t("view_dashboard_table_date")}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {" "}
                  {t("view_dashboard_table_type")}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {" "}
                  {t("view_dashboard_table_amount")}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {" "}
                  {t("view_dashboard_table_user")}{" "}
                </TableCell>
              </TableRow>
            </TableHead>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{ textAlign: "center", fontSize: 18 }}
                >
                  {t("view_dashboard_subcompany_no_rockobits_transactions")}
                </TableCell>
              </TableRow>
            )}
            <TableBody>
              {data.map((row) => renderTypeTransaction(row))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default LastRockobitsTransactions;
