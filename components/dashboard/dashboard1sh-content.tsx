"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Menu } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface DashboardContentProps {
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardContent({ setSidebarOpen }: DashboardContentProps) {
  const stats = [
    { title: "Avisos", value: "48" },
    { title: "Estado de Solicitud", value: "58" },
    { title: "Órdenes", value: "75" },
    { title: "Documentos", value: "82" },
    { title: "Cierre", value: "110" },
  ];

  const barData = [
    { name: "Type 1", value: 10 },
    { name: "Type 2", value: 20 },
    { name: "Type 3", value: 15 },
    { name: "Type 4", value: 25 },
    { name: "Type 5", value: 30 },
    { name: "Horas Hombre", value: 40 },
  ];

  const lineData = [
    { name: "Jan", value: 10 },
    { name: "Feb", value: 20 },
    { name: "Mar", value: 15 },
    { name: "Apr", value: 25 },
    { name: "May", value: 30 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "#3b82f6",
    },
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">Dashboard 2</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Bienvenido! Aquí está lo que está pasando hoy.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <input
              type="text"
              placeholder="Filtrar por meses"
              className="border p-2 rounded md:w-48"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-6 sm:mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200 bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-3 mb-6 sm:mb-8">
          <Card className="xl:col-span-3 bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-white">Cumplimiento de mantenimiento preventivo</CardTitle>
                  <CardDescription className="text-gray-400">
                    Total para este mes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] sm:h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <ChartTooltip
                      cursor={{ stroke: '#475569', strokeWidth: 1 }}
                      content={<ChartTooltipContent className="bg-gray-800 border-gray-700 text-gray-200" />}
                    />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Cumplimiento de mantenimiento preventivo</CardTitle>
                  <CardDescription className="text-gray-400">
                    Total para este mes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <ChartTooltip
                      cursor={{ stroke: '#475569', strokeWidth: 1 }}
                      content={<ChartTooltipContent className="bg-gray-800 border-gray-700 text-gray-200" />}
                    />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Cumplimiento de mantenimiento preventivo</CardTitle>
                  <CardDescription className="text-gray-400">
                    Total para este mes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <ChartTooltip
                      cursor={{ stroke: '#475569', strokeWidth: 1 }}
                      content={<ChartTooltipContent className="bg-gray-800 border-gray-700 text-gray-200" />}
                    />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Cumplimiento programado</CardTitle>
                  <CardDescription className="text-gray-400">
                    Tendencias mensuales
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <ChartTooltip
                      cursor={{ stroke: '#475569', strokeWidth: 1 }}
                      content={<ChartTooltipContent className="bg-gray-800 border-gray-700 text-gray-200" />}
                    />
                    <Line
                      dataKey="value"
                      type="natural"
                      stroke="var(--color-value)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-value)", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Preventivo vs Correctivo</CardTitle>
                  <CardDescription className="text-gray-400">
                    Total para este mes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <ChartTooltip
                      cursor={{ stroke: '#475569', strokeWidth: 1 }}
                      content={<ChartTooltipContent className="bg-gray-800 border-gray-700 text-gray-200" />}
                    />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 mb-6 sm:mb-8">
          <Badge variant="secondary">Total órdenes este mes: 56</Badge>
          <Badge variant="success">Órdenes en curso: 34</Badge>
          <Badge variant="destructive">Órdenes rechazadas: 12</Badge>
        </div>
      </main>
    </div>
  );
}