// src/components/admin/analytics/NsbsDetailedMetricChart.tsx
// Developed by Luccas A E | 2025
// Purpose: Displays a more detailed chart for a specific metric over time (e.g., bar chart, line chart).
// Features: SVG-based for simplicity (no heavy chart library dependency), customizable data points, labels, basic tooltip.
// UI/UX Focus: Clear visualization of trends and data points for deeper analysis by administrators.
// Adherence to NSBS Principles: Supports data-informed decision making. Note: Complex charting might require a dedicated library.

import React from 'react';
import { cn } from '@/lib/utils';
import { NsbsAccessibleTooltip } from '@/components/ui/NsbsAccessibleTooltip'; // Assuming component

export interface ChartDataPoint {
  label: string; // e.g., Date, Month, Category
  value: number;
  tooltipContent?: string | React.ReactNode;
}

export type ChartType = 'bar' | 'line';

export interface NsbsDetailedMetricChartProps {
  data: ChartDataPoint[];
  chartType?: ChartType;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
  chartHeight?: number; // In pixels
  barColor?: string; // Tailwind color class for bars, e.g., 'fill-blue-500'
  lineColor?: string; // Tailwind color class for lines, e.g., 'stroke-blue-500'
  pointColor?: string; // Tailwind color class for line chart points
}

export const NsbsDetailedMetricChart: React.FC<NsbsDetailedMetricChartProps> = ({
  data,
  chartType = 'bar',
  title,
  xAxisLabel,
  yAxisLabel,
  className,
  chartHeight = 250,
  barColor = 'fill-blue-600 dark:fill-blue-500',
  lineColor = 'stroke-blue-600 dark:stroke-blue-500',
  pointColor = 'fill-blue-600 dark:fill-blue-500',
}) => {
  if (!data || data.length === 0) {
    return <div className={cn("p-4 text-center text-sm text-gray-500 dark:text-gray-400", className)}>No data to display chart.</div>;
  }

  const maxValue = Math.max(...data.map(d => d.value), 0);
  const yAxisTicks = 5; // Number of ticks on Y-axis
  const yAxisStep = maxValue > 0 ? Math.ceil(maxValue / yAxisTicks / 10) * 10 : 10; // Make steps clean
  const effectiveMaxValue = maxValue > 0 ? Math.ceil(maxValue / yAxisStep) * yAxisStep : yAxisStep * yAxisTicks;

  const padding = { top: 20, right: 20, bottom: 50, left: 50 }; // SVG padding
  const svgWidth = 1000; // Intrinsic width, will scale via viewBox
  const svgHeight = chartHeight + padding.top + padding.bottom;
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartInnerHeight = chartHeight;


  // Bar Chart specific calculations
  const barWidth = data.length > 0 ? chartWidth / (data.length * 1.5) : 0; // Adjust 1.5 for spacing

  // Line Chart specific calculations
  const getX = (index: number): number => padding.left + (index / (data.length -1)) * chartWidth;
  const getY = (value: number): number => padding.top + chartInnerHeight - (value / effectiveMaxValue) * chartInnerHeight;


  return (
    <div className={cn("nsbs-detailed-metric-chart bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700", className)}>
      {title && <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">{title}</h4>}
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto" aria-labelledby={title ? 'chart-title' : undefined} role="graphics-document">
        {title && <title id="chart-title">{title}</title>}
        {/* Y-Axis Grid Lines and Labels */}
        {Array.from({ length: yAxisTicks + 1 }).map((_, i) => {
          const yValue = effectiveMaxValue - (i * yAxisStep);
          const yPos = padding.top + ((i * yAxisStep) / effectiveMaxValue) * chartInnerHeight;
          return (
            <g key={`y-tick-${i}`}>
              <line x1={padding.left} y1={yPos} x2={svgWidth - padding.right} y2={yPos} className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="0.5" />
              <text x={padding.left - 8} y={yPos + 4} textAnchor="end" className="text-[10px] fill-current text-gray-500 dark:text-gray-400">
                {yValue.toLocaleString()}
              </text>
            </g>
          );
        })}
        {yAxisLabel && (
             <text x={padding.left/3} y={padding.top + chartInnerHeight / 2} className="text-[10px] fill-current text-gray-600 dark:text-gray-300" transform={`rotate(-90, ${padding.left/3}, ${padding.top + chartInnerHeight / 2})`} textAnchor="middle">
                {yAxisLabel}
            </text>
        )}


        {/* X-Axis Labels */}
        {data.map((d, i) => {
            let xPos:number;
            if (chartType === 'bar') {
                 xPos = padding.left + i * (chartWidth / data.length) + (chartWidth / data.length) / 2;
            } else { // line
                 xPos = getX(i);
            }
            return (
                <text key={`x-label-${i}`} x={xPos} y={svgHeight - padding.bottom + 15} textAnchor="middle" className="text-[10px] fill-current text-gray-500 dark:text-gray-400">
                  {d.label}
                </text>
            )
        })}
         {xAxisLabel && (
             <text x={padding.left + chartWidth / 2} y={svgHeight - padding.bottom/3} className="text-[10px] fill-current text-gray-600 dark:text-gray-300" textAnchor="middle">
                {xAxisLabel}
            </text>
        )}


        {/* Data Representation */}
        {chartType === 'bar' && data.map((d, i) => {
          const barHeightValue = (d.value / effectiveMaxValue) * chartInnerHeight;
          const x = padding.left + i * (chartWidth / data.length) + ((chartWidth / data.length) - barWidth) / 2;
          const y = padding.top + chartInnerHeight - barHeightValue;
          return (
            <NsbsAccessibleTooltip key={`bar-${i}`} content={d.tooltipContent || `${d.label}: ${d.value.toLocaleString()}`}>
                <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeightValue > 0 ? barHeightValue : 0} // Ensure non-negative height
                className={cn(barColor, "transition-all hover:opacity-80")}
                rx="2" // Rounded corners for bars
                aria-label={`${d.label}, value ${d.value}`}
                />
            </NsbsAccessibleTooltip>
          );
        })}

        {chartType === 'line' && data.length > 1 && (
          <g>
            <path
              d={`M ${getX(0)} ${getY(data[0].value)} ${data.slice(1).map((d, i) => `L ${getX(i+1)} ${getY(d.value)}`).join(' ')}`}
              className={cn("fill-none stroke-2", lineColor)}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {data.map((d, i) => (
              <NsbsAccessibleTooltip key={`point-${i}`} content={d.tooltipContent || `${d.label}: ${d.value.toLocaleString()}`}>
                <circle
                  cx={getX(i)}
                  cy={getY(d.value)}
                  r="3" // Point radius
                  className={cn(pointColor, "stroke-white dark:stroke-gray-800 stroke-1 hover:opacity-80")}
                  aria-label={`${d.label}, value ${d.value}`}
                />
              </NsbsAccessibleTooltip>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};

export default NsbsDetailedMetricChart;
