import { LineChart, type LineChartProps, type LineSeries } from './LineChart';

export type AreaChartProps = LineChartProps;

export function AreaChart({ series, ...rest }: AreaChartProps) {
  const filled: LineSeries[] = series.map(s => ({ ...s, fill: s.fill !== false }));
  return <LineChart {...rest} series={filled} />;
}
