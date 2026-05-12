import { Doughnut } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

export interface PieChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
}

const DEFAULT_PALETTE = ['#22c55e', '#059669', '#14b8a6', '#10b981', '#84cc16', '#6b7280'];

export function PieChart({ data, height = 280 }: PieChartProps) {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        data: data.map(d => d.value),
        backgroundColor: data.map((d, i) => d.color || DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: ctx => {
            const value = ctx.parsed as number;
            const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const pct = total ? ((value / total) * 100).toFixed(0) : '0';
            return `${ctx.label}: ${value} (${pct}%)`;
          },
        },
      },
    },
    cutout: '55%',
  };

  return (
    <div style={{ height, width: '100%' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
