"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Menu,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Activity,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface DashboardContentProps {
  setSidebarOpen: (open: boolean) => void;
}

export function DashboardContent({ setSidebarOpen }: DashboardContentProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "increase" as const,
      icon: DollarSign,
      period: "from last month",
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1%",
      changeType: "increase" as const,
      icon: Users,
      period: "from last month",
    },
    {
      title: "Sales",
      value: "12,234",
      change: "+19%",
      changeType: "increase" as const,
      icon: ShoppingCart,
      period: "from last month",
    },
    {
      title: "Products",
      value: "573",
      change: "-2%",
      changeType: "decrease" as const,
      icon: Package,
      period: "from last month",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "order",
      message: "New order #3210 received",
      time: "2 minutes ago",
      badge: { label: "New", variant: "destructive" as const },
    },
    {
      id: 2,
      type: "user",
      message: "User John Smith registered",
      time: "5 minutes ago",
      badge: { label: "User", variant: "secondary" as const },
    },
    {
      id: 3,
      type: "product",
      message: "Product inventory updated",
      time: "10 minutes ago",
      badge: { label: "Update", variant: "outline" as const },
    },
    {
      id: 4,
      type: "payment",
      message: "Payment of $1,234 processed",
      time: "15 minutes ago",
      badge: { label: "Payment", variant: "default" as const },
    },
    {
      id: 5,
      type: "review",
      message: "New review on Product XYZ",
      time: "20 minutes ago",
      badge: { label: "Review", variant: "secondary" as const },
    },
  ];

  const revenueData = [
    { date: "Apr 5", visitors: 2400, pageviews: 4800, revenue: 3200 },
    { date: "Apr 11", visitors: 1800, pageviews: 3600, revenue: 2800 },
    { date: "Apr 17", visitors: 3200, pageviews: 6400, revenue: 4200 },
    { date: "Apr 23", visitors: 2800, pageviews: 5600, revenue: 3800 },
    { date: "Apr 29", visitors: 4200, pageviews: 8400, revenue: 5600 },
    { date: "May 5", visitors: 3800, pageviews: 7600, revenue: 5200 },
    { date: "May 11", visitors: 4800, pageviews: 9600, revenue: 6400 },
    { date: "May 17", visitors: 4200, pageviews: 8400, revenue: 5800 },
    { date: "May 23", visitors: 5200, pageviews: 10400, revenue: 7200 },
    { date: "May 29", visitors: 4600, pageviews: 9200, revenue: 6800 },
    { date: "Jun 4", visitors: 5800, pageviews: 11600, revenue: 8200 },
    { date: "Jun 10", visitors: 5400, pageviews: 10800, revenue: 7800 },
    { date: "Jun 16", visitors: 6200, pageviews: 12400, revenue: 8800 },
    { date: "Jun 22", visitors: 5800, pageviews: 11600, revenue: 8400 },
    { date: "Jun 29", visitors: 6800, pageviews: 13600, revenue: 9600 },
  ];

  const userGrowthData = [
    { month: "Jan", users: 186, active: 80 },
    { month: "Feb", users: 305, active: 200 },
    { month: "Mar", users: 237, active: 120 },
    { month: "Apr", users: 273, active: 190 },
    { month: "May", users: 209, active: 130 },
    { month: "Jun", users: 214, active: 140 },
    { month: "Jul", users: 290, active: 210 },
  ];

  const salesData = [
    { day: "Mon", sales: 120 },
    { day: "Tue", sales: 150 },
    { day: "Wed", sales: 180 },
    { day: "Thu", sales: 200 },
    { day: "Fri", sales: 240 },
    { day: "Sat", sales: 160 },
    { day: "Sun", sales: 140 },
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#3b82f6",
    },
    orders: {
      label: "Orders",
      color: "#10b981",
    },
    users: {
      label: "Users",
      color: "#8b5cf6",
    },
    active: {
      label: "Active",
      color: "#f59e0b",
    },
    sales: {
      label: "Sales",
      color: "#ef4444",
    },
    visitors: {
      label: "Visitors",
      color: "#06b6d4",
    },
    pageviews: {
      label: "Page Views",
      color: "#84cc16",
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
              <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">Dashboard Overview</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Welcome back! Here's what's happening today.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Activity className="mr-2 h-4 w-4" />
              View Reports
            </Button>
            <Button size="sm">
              <Eye className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-500">
                  <div className="flex items-center mr-1">
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span
                      className={
                        stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>
                  </div>
                  <span>{stat.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-3 mb-6 sm:mb-8">
          {/* Revenue Chart */}
          <Card className="xl:col-span-3 bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-white">Total Visitors</CardTitle>
                  <CardDescription className="text-slate-400">
                    Total for the last 3 months
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                    Last 3 months
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-300 hover:bg-slate-800">
                    Last 30 days
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-300 hover:bg-slate-800">
                    Last 7 days
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] sm:h-[400px] w-full">
                <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-visitors)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-visitors)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillPageviews" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-pageviews)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-pageviews)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => value}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <ChartTooltip
                    cursor={{ stroke: '#475569', strokeWidth: 1 }}
                    content={<ChartTooltipContent 
                      indicator="line" 
                      className="bg-slate-800 border-slate-700 text-slate-200"
                    />}
                  />
                  <Area
                    dataKey="visitors"
                    type="natural"
                    fill="url(#fillVisitors)"
                    fillOpacity={0.6}
                    stroke="var(--color-visitors)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-visitors)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "var(--color-visitors)", strokeWidth: 2 }}
                  />
                  <Area
                    dataKey="pageviews"
                    type="natural"
                    fill="url(#fillPageviews)"
                    fillOpacity={0.4}
                    stroke="var(--color-pageviews)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-pageviews)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "var(--color-pageviews)", strokeWidth: 2 }}
                  />
                  <Area
                    dataKey="revenue"
                    type="natural"
                    fill="url(#fillRevenue)"
                    fillOpacity={0.3}
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-revenue)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "var(--color-revenue)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">User Growth</CardTitle>
                  <CardDescription className="text-slate-400">
                    Monthly user acquisition
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={userGrowthData}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                    content={<ChartTooltipContent 
                      indicator="dashed" 
                      className="bg-slate-800 border-slate-700 text-slate-200"
                    />}
                  />
                  <Bar 
                    dataKey="users" 
                    fill="var(--color-users)" 
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                  <Bar 
                    dataKey="active" 
                    fill="var(--color-active)" 
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Sales Chart */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-6 sm:mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Weekly Sales</CardTitle>
                  <CardDescription className="text-slate-400">
                    Daily performance trends
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-400">Live</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <LineChart data={salesData}>
                  <XAxis
                    dataKey="day"
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
                    content={<ChartTooltipContent 
                      hideLabel 
                      className="bg-slate-800 border-slate-700 text-slate-200"
                    />}
                  />
                  <Line
                    dataKey="sales"
                    type="natural"
                    stroke="var(--color-sales)"
                    strokeWidth={3}
                    dot={{
                      fill: "var(--color-sales)",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{
                      r: 8,
                      stroke: "var(--color-sales)",
                      strokeWidth: 2,
                      fill: "white",
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Performance Insights</CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time analytics overview
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Peak Traffic Hour</span>
                    <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">2:00 PM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Conversion Rate</span>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-200">3.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Growth Rate</span>
                    <div className="flex items-center space-x-1">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">+12.5%</Badge>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Revenue Goal</span>
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">85% Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Active Sessions</span>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-200">1,247</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Bounce Rate</span>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">24.3%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 order-2 lg:order-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activity
                <Badge variant="secondary">Live</Badge>
              </CardTitle>
              <CardDescription>
                Latest activities and updates from your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-xs sm:text-sm text-gray-900 flex-1">{activity.message}</span>
                        <Badge variant={activity.badge.variant} className="text-xs shrink-0">
                          {activity.badge.label}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{activity.time}</span>
                    </div>
                    {index < recentActivity.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="order-1 lg:order-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add New User
                <Badge className="ml-auto">Ctrl+N</Badge>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Create Order
                <Badge className="ml-auto">Ctrl+O</Badge>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
                <Badge className="ml-auto">Ctrl+I</Badge>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Messages
                <Badge variant="destructive" className="ml-auto">3</Badge>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mt-4 sm:mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Key performance indicators for this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">3.2%</Badge>
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">4.8/5</Badge>
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">1.2s</Badge>
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current system health and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <Badge variant="default" className="bg-green-600">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge variant="default" className="bg-green-600">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <Badge variant="outline">78% Used</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backup</span>
                  <Badge variant="secondary">Last: 2h ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}