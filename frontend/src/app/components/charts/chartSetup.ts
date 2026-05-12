import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  Title,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  Title,
);

Chart.defaults.font.family =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
Chart.defaults.color = '#6b7280';
