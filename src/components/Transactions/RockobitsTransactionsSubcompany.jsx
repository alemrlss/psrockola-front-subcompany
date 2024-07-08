import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { formatDate } from "../../utils/formatDate";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function RockobitsTransactionsSubcompany() {
  const user = useSelector((state) => state.auth.user);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchTransactions();
  }, [page, take]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `/transactions/rockobits/subcompany/${user.id}`,
        {
          params: {
            skip: page * take,
            take,
          },
        }
      );
      setTransactions(response.data.data.transactions);
      setTotalCount(response.data.data.total);
    } catch (error) {
      console.error("Error fetching Rockobits transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setTake(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTransactionRockobits = (transaction) => {
    if (transaction.type === "transfer_rockobits_distributor_to_subcompany") {
      return (
        <TableRow key={transaction.id}>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {t("view_transactions_distributor")}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              color: "green",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            + {transaction.amount}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.emitterDistributor.name}
          </TableCell>
        </TableRow>
      );
    }
    if (transaction.type === "transfer_rockobits_subcompany_to_client") {
      return (
        <TableRow key={transaction.id}>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {t("view_transactions_client")}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            - {transaction.amount}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.receiver.name}
          </TableCell>
        </TableRow>
      );
    }

    if (transaction.type === "claim_qr_rockobits") {
      return (
        <TableRow key={transaction.id}>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {formatDate(transaction.createdAt)}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {t("view_transactions_qr")}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            - {transaction.amount}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {transaction.receiver.name}
          </TableCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="mt-4">
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size={120} />
          <Typography variant="h6" sx={{ marginTop: "16px", fontSize: "32px" }}>
            {t("view_transactions_loading")}
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table
            aria-label="Rockobits Transactions Table"
            sx={{
              border: "2px solid #e0e0e0",
            }}
          >
            <TableHead
              sx={{
                backgroundColor: "#CFD1D0",
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {t("view_transactions_table_date")}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {t("view_transactions_table_type")}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {t("view_transactions_table_amount")}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {t("view_transactions_table_user")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                    <Typography variant="body1">
                      {t("view_screens_confirm_ban_selected_message")}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) =>
                  renderTransactionRockobits(transaction)
                )
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={take}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[20, 10]}
          />
        </TableContainer>
      )}
    </div>
  );
}

export default RockobitsTransactionsSubcompany;
