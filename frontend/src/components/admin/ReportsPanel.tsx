import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart3 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart, Line } from "recharts";

type ReportRow = { label: string; bookings: number; revenue: number };

const ReportsPanel: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReportRow[]>([]);
  const [generated, setGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const totals = useMemo(() => {
    const totalBookings = data.reduce((s, d) => s + d.bookings, 0);
    const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
    const avgValue = totalBookings ? Math.round(totalRevenue / totalBookings) : 0;
    return { totalBookings, totalRevenue, avgValue };
  }, [data]);

  const generateReport = async () => {
    if (!dateFrom || !dateTo) return;
    setLoading(true);
    try {
      const start = new Date(dateFrom);
      const end = new Date(dateTo);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        setData([]);
        setGenerated(false);
        setLoading(false);
        return;
      }
      const days = Math.min(120, Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1));
      const rows: ReportRow[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(start.getTime() + i * 86400000);
        const label = d.toISOString().slice(0, 10);
        const bookings = Math.floor(5 + Math.random() * 40);
        const revenue = Math.floor(bookings * (15000 + Math.random() * 120000));
        rows.push({ label, bookings, revenue });
      }
      setData(rows);
      setGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generated || data.length === 0) return;
    setDownloading(true);
    try {
      const header = 'Date,Bookings,Revenue\n';
      const body = data.map(r => `${r.label},${r.bookings},${r.revenue}`).join('\n');
      const footer = `\nTOTALS,${totals.totalBookings},${totals.totalRevenue}`;
      const csv = header + body + footer;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${dateFrom}_${dateTo}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600">Export revenue and bookings reports by date range</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button onClick={generateReport} disabled={loading || !dateFrom || !dateTo} className="w-full md:w-auto">
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
              <Button onClick={handleDownload} disabled={downloading || !generated || data.length===0} variant="outline" className="w-full md:w-auto">
                <BarChart3 className="h-4 w-4 mr-2" />
                {downloading ? 'Preparing...' : 'Download CSV'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {generated && data.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="border rounded p-4">
                <div className="text-xs text-gray-500">Total Bookings</div>
                <div className="text-2xl font-bold">{totals.totalBookings.toLocaleString()}</div>
              </div>
              <div className="border rounded p-4">
                <div className="text-xs text-gray-500">Total Revenue (RWF)</div>
                <div className="text-2xl font-bold">{totals.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="border rounded p-4">
                <div className="text-xs text-gray-500">Avg Booking Value (RWF)</div>
                <div className="text-2xl font-bold">{totals.avgValue.toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">Select a date range and generate the report to see metrics here.</div>
          )}
        </CardContent>
      </Card>

      {generated && data.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ revenue: { label: 'Revenue', color: 'hsl(142, 76%, 36%)' } }}>
                <BarChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" hide={data.length>45} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ bookings: { label: 'Bookings', color: 'hsl(142, 76%, 36%)' } }}>
                <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" hide={data.length>45} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="bookings" stroke="var(--color-bookings)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {generated && data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Date</th>
                    <th className="text-left py-2 px-3">Bookings</th>
                    <th className="text-left py-2 px-3">Revenue (RWF)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.label} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{row.label}</td>
                      <td className="py-2 px-3">{row.bookings.toLocaleString()}</td>
                      <td className="py-2 px-3">{row.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2 px-3 font-medium">Totals</td>
                    <td className="py-2 px-3 font-medium">{totals.totalBookings.toLocaleString()}</td>
                    <td className="py-2 px-3 font-medium">{totals.totalRevenue.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsPanel;


