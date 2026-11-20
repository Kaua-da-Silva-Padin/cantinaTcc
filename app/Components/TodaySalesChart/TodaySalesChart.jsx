import { useEffect, useState } from "react";
import { CircularProgress, useMediaQuery } from "@mui/material";
import supabase from "../../supabaseClient";
import SalesChart from "../SalesChart/SalesChart";
import "./TodaySalesChart.css";

const PAGE_SIZE = 1000;

function isCanceled(sale) {
  return JSON.stringify(sale.progress ?? "").toLowerCase().includes("cancel");
}

function getTodayBuckets(sales, now) {
  const buckets = Array.from({ length: 12 }, (_, index) => {
    const start = index * 2;
    const end = start + 2;
    return {
      key: String(index),
      label: `h${String(start).padStart(2, "0")}–h${String(end).padStart(2, "0")}`,
      sales: 0,
      revenue: 0,
    };
  });

  sales.forEach((sale) => {
    if (isCanceled(sale)) return;
    const boughtAt = new Date(sale.bought_at);
    if (
      Number.isNaN(boughtAt.getTime())
      || boughtAt.getFullYear() !== now.getFullYear()
      || boughtAt.getMonth() !== now.getMonth()
      || boughtAt.getDate() !== now.getDate()
      || boughtAt > now
    ) return;

    const bucket = buckets[Math.floor(boughtAt.getHours() / 2)];
    bucket.sales += 1;
    bucket.revenue += Number(sale.total_price) || 0;
  });

  return buckets;
}

function getErrorCode(error) {
  return error?.code ?? error?.message ?? "UNKNOWN";
}

export default function TodaySalesChart() {
  const mobileLayout = useMediaQuery("(max-width: 600px)");
  const [chart, setChart] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadSales() {
      setChart(null);
      setLoadError("");
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sales = [];

      try {
        for (let offset = 0; ; offset += PAGE_SIZE) {
          const { data, error } = await supabase
            .from("sales")
            .select("id,bought_at,total_price,progress")
            .gte("bought_at", startOfToday.toISOString())
            .lte("bought_at", now.toISOString())
            .order("bought_at", { ascending: true })
            .range(offset, offset + PAGE_SIZE - 1);
          if (error) throw error;
          sales.push(...(data ?? []));
          if (!data || data.length < PAGE_SIZE) break;
        }

        if (active) setChart(getTodayBuckets(sales, now));
      } catch (error) {
        console.error("Erro ao buscar vendas de hoje:", error);
        if (active) setLoadError(getErrorCode(error));
      }
    }

    loadSales();
    return () => { active = false; };
  }, [refreshKey]);

  return (
    <div className="today-sales-chart-layout">
      <div className="today-sales-chart-actions">
        <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>
          Atualizar dados
        </button>
      </div>
      {loadError ? (
        <div className="today-sales-chart-state" role="alert">
          <b>Não foi possível carregar as vendas de hoje.</b>
          <span>Erro: {loadError}</span>
          <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>Tentar novamente</button>
        </div>
      ) : !chart ? (
        <div className="today-sales-chart-state" role="status">
          <CircularProgress />
          <span>Carregando vendas de hoje...</span>
        </div>
      ) : (
        <SalesChart
          chart={chart}
          chartTitle="Faturamento por horário"
          chartDescription="Hoje"
          mobileExpanded={mobileLayout}
        />
      )}
    </div>
  );
}
