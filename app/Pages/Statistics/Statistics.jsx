import { useEffect, useMemo, useState } from "react";
import { Avatar, CircularProgress } from "@mui/material";
import { Link } from "react-router";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCalendar2Line,
  RiCalendarEventLine,
  RiCalendarTodoLine,
  RiCloseLine,
  RiMedalLine,
  RiMenuLine,
  RiRefreshLine,
  RiShoppingBag3Line,
  RiSunLine,
  RiTimeLine,
} from "react-icons/ri";
import AdminRouteGuard from "../../Components/AdminRouteGuard/AdminRouteGuard";
import AdminNotifications from "../../Components/AdminNotifications/AdminNotifications";
import AdmSideBar from "../../Components/AdmSideBar/AdmSideBar";
import SalesChart from "../../Components/SalesChart/SalesChart";
import { stringAvatar } from "../../Components/MenuPageLinks/MenuPageLinks";
import packageJson from "../../../package.json";
import supabase from "../../supabaseClient";
import "../../../index.css";
import "./Statistics.css";

const PAGE_SIZE = 1000;

const adminLinks = [
  { text: "Pedidos", link: "/orders" },
  { text: "Estoque", link: "/stock" },
  { text: "Estatísticas", link: "/statistics" },
];

const navigationGroups = {
  speedDial: [
    { text: "Home", link: "/home" },
    { text: "Cantina", link: "/buy" },
    { text: "Administrar", link: "/adm" },
    { text: "Login", link: "/login" },
    { text: "Registrar", link: "/" },
    { text: "Perfil", link: "/profile" },
  ],
  admin: adminLinks,
};

const weekdays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const periodLabels = {
  today: "hoje",
  week: "esta semana",
  month: "este mês",
  year: "este ano",
};
const hourRanges = Array.from({ length: 12 }, (_, index) => ({
  start: index * 2,
  end: index * 2 + 2,
}));

function getErrorCode(error) {
  return error?.code ?? error?.message ?? "UNKNOWN";
}

function isCanceled(sale) {
  return JSON.stringify(sale.progress ?? "").toLowerCase().includes("cancel");
}

function parseItems(items) {
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch {
      return [];
    }
  }
  return Array.isArray(items) ? items : [];
}

function getWeekStart(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isWithinPeriod(date, period, now) {
  if (date > now) return false;
  if (period === "today") return dateKey(date) === dateKey(now);
  if (period === "week") return date >= getWeekStart(now);
  if (period === "month") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }
  return date.getFullYear() === now.getFullYear();
}

function getChartBuckets(period, now) {
  if (period === "today") {
    return hourRanges.map(({ start, end }, index) => ({
      key: String(index),
      label: `h${String(start).padStart(2, "0")}–h${String(end).padStart(2, "0")}`,
      sales: 0,
      revenue: 0,
    }));
  }

  if (period === "week") {
    const weekStart = getWeekStart(now);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + index);
      return {
        key: dateKey(date),
        label: date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
        sales: 0,
        revenue: 0,
      };
    });
  }

  if (period === "month") {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => ({
      key: String(index + 1),
      label: String(index + 1),
      sales: 0,
      revenue: 0,
    }));
  }

  return Array.from({ length: 12 }, (_, index) => ({
    key: String(index),
    label: new Date(now.getFullYear(), index, 1)
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", ""),
    sales: 0,
    revenue: 0,
  }));
}

function formatCurrency(value) {
  return Number(value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getTopProducts(sales) {
  const products = new Map();
  sales.forEach(({ sale }) => {
    parseItems(sale.items ?? sale.products).forEach((item) => {
      const name = String(item.product_name ?? item.name ?? item.title ?? "").trim();
      const quantity = Number(item.qty ?? item.quantity) || 0;
      if (!name || quantity <= 0) return;
      products.set(name, (products.get(name) ?? 0) + quantity);
    });
  });

  return [...products.entries()]
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name, "pt-BR"))
    .slice(0, 10);
}

function getPeriodAnalytics(statistics, period, now) {
  if (!period) {
    return {
      chart: statistics.dailyChart,
      chartTitle: "Faturamento diário",
      chartDescription: "Últimos 7 dias",
      topProducts: statistics.topProducts,
      rankingTitle: "Mais vendidos do mês",
      traffic: statistics.traffic,
    };
  }

  const filteredSales = statistics.activeSales.filter(({ boughtAt }) =>
    isWithinPeriod(boughtAt, period, now)
  );
  const chart = getChartBuckets(period, now);
  const chartBuckets = new Map(chart.map((bucket) => [bucket.key, bucket]));
  const traffic = Array.from({ length: 7 }, () => Array(12).fill(0));

  filteredSales.forEach(({ boughtAt, revenue }) => {
    const chartKey = period === "today"
      ? String(Math.floor(boughtAt.getHours() / 2))
      : period === "week"
        ? dateKey(boughtAt)
        : period === "month"
          ? String(boughtAt.getDate())
          : String(boughtAt.getMonth());
    const bucket = chartBuckets.get(chartKey);
    if (bucket) {
      bucket.sales += 1;
      bucket.revenue += revenue;
    }

    traffic[(boughtAt.getDay() + 6) % 7][Math.floor(boughtAt.getHours() / 2)] += 1;
  });

  const periodDescription = {
    today: "Hoje",
    week: "Semana atual até hoje",
    month: "Mês atual até hoje",
    year: "Ano atual até hoje",
  }[period];
  const chartTitle = period === "today"
    ? "Faturamento por horário"
    : period === "week"
      ? "Faturamento da semana"
      : period === "month"
        ? "Faturamento do mês"
        : "Faturamento do ano";

  return {
    chart,
    chartTitle,
    chartDescription: periodDescription,
    topProducts: getTopProducts(filteredSales),
    rankingTitle: `Mais vendidos ${periodLabels[period]}`,
    traffic,
  };
}

function getStatistics(sales, now) {
  const periods = {
    today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    week: getWeekStart(now),
    month: new Date(now.getFullYear(), now.getMonth(), 1),
    year: new Date(now.getFullYear(), 0, 1),
  };
  const totals = Object.fromEntries(
    Object.keys(periods).map((period) => [period, { sales: 0, revenue: 0 }])
  );
  const dailyChart = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index));
    return {
      date,
      key: dateKey(date),
      label: date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      sales: 0,
      revenue: 0,
    };
  });
  const traffic = Array.from({ length: 7 }, () => Array(12).fill(0));
  const activeSales = [];
  const monthStart = periods.month;
  const yearStart = periods.year;

  sales.forEach((sale) => {
    if (isCanceled(sale)) return;
    const boughtAt = new Date(sale.bought_at);
    if (Number.isNaN(boughtAt.getTime())) return;
    const revenue = Number(sale.total_price) || 0;
    activeSales.push({ sale, boughtAt, revenue });

    Object.entries(periods).forEach(([period, start]) => {
      if (boughtAt >= start && boughtAt <= now) {
        totals[period].sales += 1;
        totals[period].revenue += revenue;
      }
    });

    const day = dailyChart.find((item) => item.key === dateKey(boughtAt));
    if (day) {
      day.sales += 1;
      day.revenue += revenue;
    }

    if (boughtAt >= yearStart && boughtAt <= now) {
      const weekday = (boughtAt.getDay() + 6) % 7;
      traffic[weekday][Math.floor(boughtAt.getHours() / 2)] += 1;
    }

  });

  return {
    totals,
    dailyChart,
    traffic,
    activeSales,
    topProducts: getTopProducts(activeSales.filter(({ boughtAt }) =>
      boughtAt >= monthStart && boughtAt <= now
    )),
  };
}

function StatisticsContent() {
  const [sales, setSales] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedRanking, setExpandedRanking] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [sideBarOn, setSideBarOn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const loggedInUser = typeof sessionStorage !== "undefined"
    ? sessionStorage.getItem("loggedInUser")
    : null;
  let parsedUser = null;
  try {
    parsedUser = loggedInUser ? JSON.parse(loggedInUser) : null;
  } catch {
    parsedUser = null;
  }
  const loggedInUserName = parsedUser?.name ?? parsedUser?.nome ?? loggedInUser ?? "Funcionário";

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const loadSales = async () => {
      setSales(null);
      setLoadError("");
      const now = new Date();
      const yearStart = new Date(now.getFullYear(), 0, 1).toISOString();
      const allSales = [];

      try {
        for (let offset = 0; ; offset += PAGE_SIZE) {
          const { data, error } = await supabase
            .from("sales")
            .select("id,bought_at,total_price,progress,items")
            .gte("bought_at", yearStart)
            .lte("bought_at", now.toISOString())
            .order("bought_at", { ascending: true })
            .range(offset, offset + PAGE_SIZE - 1);
          if (error) throw error;
          allSales.push(...(data ?? []));
          if (!data || data.length < PAGE_SIZE) break;
        }
        if (active) {
          setSales(allSales);
          setCurrentTime(new Date());
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas de vendas:", error);
        if (active) setLoadError(getErrorCode(error));
      }
    };

    loadSales();
    return () => { active = false; };
  }, [refreshKey]);

  const statistics = useMemo(
    () => sales ? getStatistics(sales, currentTime) : null,
    [sales, currentTime]
  );
  const periodAnalytics = useMemo(
    () => statistics ? getPeriodAnalytics(statistics, selectedPeriod, currentTime) : null,
    [statistics, selectedPeriod, currentTime]
  );
  const maxTraffic = Math.max(1, ...(periodAnalytics?.traffic.flat() ?? []));
  const visibleProducts = periodAnalytics?.topProducts.slice(0, expandedRanking ? 10 : 3) ?? [];
  const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
  const periodCards = [
    { key: "today", label: "Hoje", icon: <RiSunLine aria-hidden="true" /> },
    { key: "week", label: "Esta semana", icon: <RiCalendar2Line aria-hidden="true" /> },
    { key: "month", label: "Este mês", icon: <RiCalendarEventLine aria-hidden="true" /> },
    { key: "year", label: "Este ano", icon: <RiCalendarTodoLine aria-hidden="true" /> },
  ];

  return (
    <div className={`statistics-admin-shell ${sideBarOn ? "sideBarOn" : "sideBarOff"}`}>
      <aside className="statistics-sidebar">
        <AdmSideBar tools={adminLinks} navigationGroups={navigationGroups} />
      </aside>
      <main className="statistics-main">
        <header className="statistics-navbar">
          <button
            type="button"
            className="statistics-menu-button"
            aria-label={sideBarOn ? "Fechar menu" : "Abrir menu"}
            onClick={() => setSideBarOn((current) => !current)}
          >
            {sideBarOn ? <RiCloseLine aria-hidden="true" /> : <RiMenuLine aria-hidden="true" />}
          </button>
          <div className="statistics-navbar-status">
            <span>
              {`${currentTime.getDate()} de ${capitalize(currentTime.toLocaleDateString("pt-BR", { month: "long" }))} de ${currentTime.getFullYear()} ${currentTime.toLocaleTimeString("pt-BR")}`}
            </span>
            <span>Versão: {packageJson.version}</span>
            <span className="statistics-system-status">
              <span className="statistics-status-full">Status do Sistema: Ativo</span>
              <span className="statistics-status-mobile">Ativo</span>
            </span>
            <AdminNotifications />
            <Link to="/profile" className="statistics-user-link">
              <b>{loggedInUserName}</b>
              <Avatar {...stringAvatar(loggedInUserName || "User")} />
            </Link>
          </div>
        </header>

        <section className="statistics-workspace" aria-label="Estatísticas de vendas">
          <div className="statistics-heading">
            <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>
              <RiRefreshLine aria-hidden="true" />
              Atualizar dados
            </button>
          </div>

          {loadError ? (
            <div className="statistics-error" role="alert">
              <b>Não foi possível carregar as estatísticas.</b>
              <span>Erro: {loadError}</span>
              <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>Tentar novamente</button>
            </div>
          ) : !statistics ? (
            <div className="statistics-loading" role="status">
              <CircularProgress />
              <span>Carregando estatísticas...</span>
            </div>
          ) : (
            <>
              <div className="statistics-period-grid">
                {periodCards.map(({ key, label, icon }) => (
                  <button
                    type="button"
                    className="statistics-period-card"
                    data-period={key}
                    data-selected={selectedPeriod === null || selectedPeriod === key}
                    aria-pressed={selectedPeriod === key}
                    aria-label={`${label}: ${formatCurrency(statistics.totals[key].revenue)} de faturamento e ${statistics.totals[key].sales} vendas. Filtrar os gráficos por período.`}
                    key={key}
                    onClick={() => {
                      setSelectedPeriod((current) => current === key ? null : key);
                      setExpandedRanking(false);
                    }}
                  >
                    <div className="statistics-period-heading">
                      {icon}
                      <h2>{label}</h2>
                    </div>
                    <strong>{formatCurrency(statistics.totals[key].revenue)}</strong>
                    <span><RiShoppingBag3Line aria-hidden="true" /> {statistics.totals[key].sales} vendas</span>
                  </button>
                ))}
              </div>

              <div className="statistics-content-grid">
                <SalesChart
                  chart={periodAnalytics.chart}
                  chartTitle={periodAnalytics.chartTitle}
                  chartDescription={periodAnalytics.chartDescription}
                />

                <article className="statistics-card statistics-ranking-card">
                  <div className="statistics-card-heading">
                    <div>
                      <h2><RiMedalLine aria-hidden="true" /> {periodAnalytics.rankingTitle}</h2>
                      <p>Ranking por unidades compradas</p>
                    </div>
                  </div>
                  {visibleProducts.length ? (
                    <ol className="statistics-ranking">
                      {visibleProducts.map((product, index) => (
                        <li key={product.name}>
                          <span className="statistics-rank-number">{index + 1}</span>
                          <strong>{product.name}</strong>
                          <span className="statistics-product-count">
                            <RiShoppingBag3Line aria-hidden="true" />
                            {product.quantity} {product.quantity === 1 ? "unidade" : "unidades"}
                          </span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="statistics-empty">
                      Nenhum produto vendido {selectedPeriod ? periodLabels[selectedPeriod] : "neste mês"}.
                    </p>
                  )}
                  {periodAnalytics.topProducts.length > 3 && (
                    <button
                      type="button"
                      className="statistics-expand-button"
                      onClick={() => setExpandedRanking((expanded) => !expanded)}
                      aria-expanded={expandedRanking}
                    >
                      {expandedRanking ? "Mostrar menos" : `Ver top ${periodAnalytics.topProducts.length}`}
                      {expandedRanking ? <RiArrowUpSLine aria-hidden="true" /> : <RiArrowDownSLine aria-hidden="true" />}
                    </button>
                  )}
                </article>

                <article className="statistics-card statistics-traffic-card">
                  <div className="statistics-card-heading">
                    <div>
                      <h2><RiTimeLine aria-hidden="true" /> Fluxo por dia e horário</h2>
                    </div>
                  </div>
                  <div className="statistics-traffic-scroll">
                    <table className="statistics-traffic-table">
                      <thead>
                        <tr>
                          <th scope="col">Dia</th>
                          {hourRanges.map(({ start, end }) => (
                            <th scope="col" key={start}>{`${String(start).padStart(2, "0")}–${String(end).padStart(2, "0")}h`}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {weekdays.map((weekday, rowIndex) => (
                          <tr key={weekday}>
                            <th scope="row">{weekday}</th>
                            {periodAnalytics.traffic[rowIndex].map((count, columnIndex) => {
                              const intensity = count ? 0.12 + (count / maxTraffic) * 0.76 : 0.04;
                              return (
                                <td
                                  key={`${weekday}-${columnIndex}`}
                                  style={{
                                    backgroundColor: `rgba(48, 132, 190, ${intensity})`,
                                    color: intensity > 0.58 ? "#fff" : "#222",
                                  }}
                                  aria-label={`${weekday}, ${hourRanges[columnIndex].start} às ${hourRanges[columnIndex].end} horas: ${count} atendimentos`}
                                >
                                  {count || "—"}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default function Statistics() {
  return (
    <AdminRouteGuard>
      <StatisticsContent />
    </AdminRouteGuard>
  );
}
