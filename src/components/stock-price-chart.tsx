import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockTimeSeriesResponse } from "@/lib/api-types";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface StockPriceChartProps {
  data: StockTimeSeriesResponse;
}

export function StockPriceChart({ data }: StockPriceChartProps) {
  const [chartData, setChartData] = useState<Array<{ date: string; price: number; fullDate: Date }>>([]);

  useEffect(() => {
    if (data?.series) {
      // Format the data for the chart
      const formattedData = data.series.map((point) => ({
        date: new Date(point.timestamp).toLocaleDateString(),
        price: point.price,
        fullDate: new Date(point.timestamp),
      }));

      // Sort by date ascending
      formattedData.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
      
      setChartData(formattedData);
    }
  }, [data]);

  if (!data || !data.series || data.series.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate min and max for chart scaling with some padding
  const minPrice = Math.min(...data.series.map(point => point.price)) * 0.95;
  const maxPrice = Math.max(...data.series.map(point => point.price)) * 1.05;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{data.symbol} Price History</span>
          <span className="text-sm text-gray-500">Last 30 days</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  // Show fewer ticks on the x-axis
                  return value;
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[minPrice, maxPrice]} 
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                tick={{ fontSize: 12 }}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}