"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  FileText,
  XCircle,
} from "lucide-react";

// Tipos específicos para ECharts
interface EChartsInstance {
  setOption: (option: EChartsOption) => void;
  resize: () => void;
  dispose: () => void;
}

interface ECharts {
  init: (dom: HTMLElement | null) => EChartsInstance;
}

// Declaración de tipos para ECharts en el objeto window
declare global {
  interface Window {
    echarts?: ECharts;
  }
}

// Tipos para las opciones de ECharts
interface EChartsOption {
  tooltip?: {
    trigger?: string;
    axisPointer?: {
      type?: string;
    };
  };
  legend?: {
    data?: string[];
    top?: number | string;
    textStyle?: {
      fontSize?: number;
    };
  };
  grid?: {
    left?: string;
    right?: string;
    bottom?: string;
    containLabel?: boolean;
  };
  xAxis?: {
    type?: string;
    data?: string[];
  };
  yAxis?: {
    type?: string;
    max?: number;
  };
  series?: Array<{
    name?: string;
    type?: string;
    data?: number[];
    itemStyle?: {
      color?: string;
    };
    lineStyle?: {
      color?: string;
      width?: number;
    };
    symbol?: string;
    symbolSize?: number;
  }>;
}

// Script loader para ECharts
const useEChartsScript = (): boolean => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (window.echarts) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.3/echarts.min.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => console.error('Error loading ECharts');
    document.head.appendChild(script);

    return () => {
      // Cleanup: remover script si el componente se desmonta
      const existingScript = document.querySelector(`script[src="${script.src}"]`);
      if (existingScript && document.head.contains(existingScript)) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return loaded;
};

// Componente para gráficos ECharts
interface EChartProps {
  option: EChartsOption;
  style?: React.CSSProperties;
}

const EChart: React.FC<EChartProps> = ({ option, style = { height: '300px' } }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const isEChartsLoaded = useEChartsScript();
  const chartInstanceRef = useRef<EChartsInstance | null>(null);

  useEffect(() => {
    if (!isEChartsLoaded || !chartRef.current || !window.echarts) return;

    // Limpiar instancia anterior si existe
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
    }

    const chart = window.echarts.init(chartRef.current);
    chartInstanceRef.current = chart;
    chart.setOption(option);

    const handleResize = () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, [isEChartsLoaded, option]);

  if (!isEChartsLoaded) {
    return (
      <div style={style} className="flex items-center justify-center bg-gray-100 rounded">
        <div className="text-gray-500">Cargando gráfico...</div>
      </div>
    );
  }

  return <div ref={chartRef} style={style} />;
};

interface VigoDashboardProps {
  setSidebarOpen?: (open: boolean) => void;
}

export function VigoDashboard({ setSidebarOpen }: VigoDashboardProps = {}) {

  // Datos de estadísticas principales
  const stats = [
    {
      title: "Total",
      subtitle: "órdenes este mes", 
      value: "56",
      color: "bg-blue-100 border-blue-200",
      textColor: "text-blue-800"
    },
    {
      title: "Órdenes en curso",
      value: "34",
      color: "bg-green-100 border-green-200",
      textColor: "text-green-800"
    },
    {
      title: "Órdenes rechazadas", 
      value: "12",
      color: "bg-yellow-100 border-yellow-200",
      textColor: "text-yellow-800"
    }
  ];

  // Configuración del gráfico de barras de mantenimiento preventivo
  const maintenanceOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Meta cumplida'],
      top: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: 'Año 1',
        type: 'bar',
        data: [65, 70, 75, 80, 85, 75, 70, 80],
        itemStyle: { color: '#93C5FD' }
      },
      {
        name: 'Año 2', 
        type: 'bar',
        data: [70, 75, 80, 85, 90, 80, 75, 85],
        itemStyle: { color: '#60A5FA' }
      },
      {
        name: 'Año 3',
        type: 'bar', 
        data: [75, 80, 85, 90, 95, 85, 80, 90],
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: 'Año 4',
        type: 'bar',
        data: [80, 85, 90, 95, 100, 90, 85, 95],
        itemStyle: { color: '#1D4ED8' }
      },
      {
        name: 'Meta cumplida',
        type: 'line',
        data: [85, 85, 85, 85, 85, 85, 85, 85],
        itemStyle: { color: '#EF4444' },
        lineStyle: { color: '#EF4444', width: 2 }
      }
    ]
  };

  // Configuración para el gráfico de línea de programación
  const programmingOption: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Año 4'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%', 
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: 'Año 4',
        type: 'line',
        data: [70, 85, 90, 75, 95, 80, 88, 92],
        itemStyle: { color: '#3B82F6' },
        lineStyle: { color: '#3B82F6', width: 3 },
        symbol: 'circle',
        symbolSize: 6
      }
    ]
  };

  // Configuración para el gráfico Preventivo VS Correctivo
  const preventiveVsCorrectiveOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Año 1', 'Año 2', 'Año 3', 'Año 4', 'Meta cumplida'],
      top: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%', 
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: 'Año 1',
        type: 'bar',
        data: [60, 65, 70, 75, 80, 75, 70],
        itemStyle: { color: '#93C5FD' }
      },
      {
        name: 'Año 2',
        type: 'bar',
        data: [65, 70, 75, 80, 85, 80, 75], 
        itemStyle: { color: '#60A5FA' }
      },
      {
        name: 'Año 3',
        type: 'bar',
        data: [70, 75, 80, 85, 90, 85, 80],
        itemStyle: { color: '#1E40AF' }
      },
      {
        name: 'Año 4',
        type: 'bar',
        data: [75, 80, 85, 90, 95, 90, 85],
        itemStyle: { color: '#1D4ED8' }
      },
      {
        name: 'Meta cumplida',
        type: 'line',
        data: [80, 80, 80, 80, 80, 80, 80],
        itemStyle: { color: '#EF4444' },
        lineStyle: { color: '#EF4444', width: 2 }
      }
    ]
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-blue-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-blue-700"
              onClick={() => setSidebarOpen && setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <input
              placeholder="Filtrar por meses"
              className="w-64 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className={`${stat.color} border-2`}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${stat.textColor}`}>
                      {stat.value}
                    </div>
                    <div className={`text-lg font-medium ${stat.textColor}`}>
                      {stat.title}
                    </div>
                    {stat.subtitle && (
                      <div className={`text-sm ${stat.textColor} opacity-80`}>
                        {stat.subtitle}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
            {/* Cumplimiento de mantenimiento preventivo - Left */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Cumplimiento de mantenimiento preventivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EChart 
                  option={maintenanceOption} 
                  style={{ height: '300px' }}
                />
              </CardContent>
            </Card>

            {/* Cumplimiento de mantenimiento preventivo - Right */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Cumplimiento de mantenimiento preventivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EChart 
                  option={maintenanceOption} 
                  style={{ height: '300px' }}
                />
              </CardContent>
            </Card>

            {/* Cumplimiento de mantenimiento preventivo - Bottom Left */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Cumplimiento de mantenimiento preventivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EChart 
                  option={maintenanceOption} 
                  style={{ height: '300px' }}
                />
              </CardContent>
            </Card>

            {/* Cumplimiento programación - Bottom Right */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Cumplimiento programación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EChart 
                  option={programmingOption} 
                  style={{ height: '300px' }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Bottom Large Chart */}
          <div className="grid gap-6 grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-center">
                  Preventivo VS Correctivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EChart 
                  option={preventiveVsCorrectiveOption} 
                  style={{ height: '400px' }}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  );
}