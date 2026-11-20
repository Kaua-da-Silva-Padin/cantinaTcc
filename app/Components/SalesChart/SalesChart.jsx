import { RiBarChart2Line } from "react-icons/ri";
import "./SalesChart.css";

export default function SalesChart({ chart, chartTitle, chartDescription, mobileExpanded = false }) {
  const maxRevenue = Math.max(1, ...chart.map((bucket) => bucket.revenue));
  const verticalScale = mobileExpanded ? 2 : 1;
  const viewBoxHeight = 220 * verticalScale;

  return (
    <article className="sales-chart-card">
      <div className="sales-chart-heading">
        <div>
          <h2><RiBarChart2Line aria-hidden="true" /> {chartTitle}</h2>
          <p>{chartDescription}</p>
        </div>
      </div>
      <div
        className={`sales-chart-scroll${mobileExpanded ? " sales-chart-scroll-mobile" : ""}`}
        tabIndex={mobileExpanded ? 0 : undefined}
        role={mobileExpanded ? "region" : undefined}
        aria-label={mobileExpanded ? "Gráfico rolável horizontalmente com todos os horários." : undefined}
      >
        <svg
          className={`sales-chart${mobileExpanded ? " sales-chart-expanded" : ""}`}
          viewBox={`0 0 700 ${viewBoxHeight}`}
          role="img"
          aria-label={`Gráfico de ${chartTitle.toLowerCase()}`}
        >
          {[0, 1, 2, 3].map((line) => {
            const y = (18 + line * 48) * verticalScale;
            return <line key={line} x1="15" x2="685" y1={y} y2={y} className="sales-chart-gridline" />;
          })}
          {chart.map((bucket, index) => {
            const chartStep = 670 / chart.length;
            const barWidth = Math.min(72, chartStep * 0.82);
            const x = 15 + chartStep * index + (chartStep - barWidth) / 2;
            const height = (bucket.revenue / maxRevenue) * 138 * verticalScale;
            const y = 162 * verticalScale - height;
            return (
              <g key={bucket.key}>
                <title>{`${bucket.date?.toLocaleDateString("pt-BR") ?? bucket.label}: ${Number(bucket.revenue).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}, ${bucket.sales} vendas`}</title>
                <text
                  x={x + barWidth / 2}
                  y={Math.max(14 * verticalScale, y - 8 * verticalScale)}
                  textAnchor="middle"
                  className="sales-chart-count"
                  style={{ fontSize: `${Math.max(8, Math.min(13, chartStep * 0.42))}px` }}
                >
                  {bucket.sales}
                </text>
                <rect x={x} y={y} width={barWidth} height={Math.max(height, 1)} rx="3" className="sales-chart-bar" />
                <text
                  x={x + barWidth / 2}
                  y={190 * verticalScale}
                  textAnchor="middle"
                  className="sales-chart-label"
                  style={{ fontSize: `${Math.max(8, Math.min(13, chartStep * 0.42))}px` }}
                >
                  {bucket.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </article>
  );
}
