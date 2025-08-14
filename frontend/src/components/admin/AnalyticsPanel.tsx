import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const AnalyticsPanel: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const bookingsData = useMemo(() => (
    Array.from({ length: period === '7d' ? 7 : period === '30d' ? 30 : 12 }).map((_, i) => ({
      label: period === '90d' ? `M${i + 1}` : `D${i + 1}`,
      bookings: Math.floor(10 + Math.random() * 90),
    }))
  ), [period]);

  const revenueData = useMemo(() => (
    bookingsData.map(d => ({ label: d.label, revenue: d.bookings * (50 + Math.random() * 150) }))
  ), [bookingsData]);

  const serviceSplit = useMemo(() => ([
    { name: 'Accommodations', value: 45 },
    { name: 'Transportation', value: 25 },
    { name: 'Tours', value: 30 },
  ]), []);

  const colors = ['#16a34a', '#0ea5e9', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">KPIs and trends for bookings, revenue and services</p>
        </div>
        <div className="flex gap-2 text-sm">
          {(['7d','30d','90d'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded border ${period===p?'bg-green-600 text-white border-green-600':'border-gray-200 hover:bg-gray-50'}`}>{p.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Bookings Trend</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ bookings: { label: 'Bookings', color: 'hsl(142, 76%, 36%)' } }}>
              <LineChart data={bookingsData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Revenue Split</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ acc: { label: 'Accommodations', color: colors[0] }, trans: { label: 'Transportation', color: colors[1] }, tour: { label: 'Tours', color: colors[2] } }}>
              <PieChart>
                <Pie data={serviceSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} paddingAngle={2}>
                  {serviceSplit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (RWF)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ revenue: { label: 'Revenue', color: 'hsl(142, 76%, 36%)' } }}>
              <BarChart data={revenueData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>Conversion rate estimate: 3.4%</li>
              <li>Average booking value: RWF {Math.round(revenueData.reduce((s,d)=>s+d.revenue,0) / (bookingsData.reduce((s,d)=>s+d.bookings,0) || 1)).toLocaleString()}</li>
              <li>Top service: Accommodations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPanel;


