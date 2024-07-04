import { useEffect, useState } from "react";
import api from "../../api/api";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ReproductionsForScreen from "../../components/Dashboard/ReproductionsForScreen";
import LastRockobitsTransactions from "../../components/Dashboard/LastRockobitsTransactions";

const DashboardSubcompany = () => {
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [reproductionsForScreen, setReproductionsForScreen] = useState({});
  const [ownSales, setOwnSales] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/subcompany/" + user.id);
        const info = response.data.data;

        console.log(info);

        setRecentTransactions(info.recentRockobitsTransactions);
        setReproductionsForScreen(info.reproductionsForScreen);
        setOwnSales(info.ownSales);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos del backend:", error);
        setError(
          "Error con la conexión al servidor, por favor intente más tarde..."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [auth]);

  return (
    <section>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <div className="flex justify-center items-center text-red-500 text-center lg:bg-red-100 rounded-md py-6 px-2">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between my-2">
            <h2 className="font-bold text-[#555CB3] text-2xl mb-4">
              {t("view_dashboard_welcome")} {user.name}!
            </h2>

            <div className="bg-[#555CB3] text-white p-2 rounded-md">
              <p className="text-center text-lg font-bold">
                {t("view_dashboard_sales_own")}
              </p>
              <p className="text-xs">
                {t("view_dashboard_sales")}: <b>{ownSales.countSales}</b>
              </p>
              <p className="text-xs">
                <b>{ownSales.totalSales}</b> rockobits
              </p>
            </div>
          </div>

          <ReproductionsForScreen data={reproductionsForScreen} />

          <LastRockobitsTransactions data={recentTransactions} />
        </>
      )}
    </section>
  );
};

export default DashboardSubcompany;
