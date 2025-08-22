"use client"; // Agregado: Esencial para componentes de React que usan hooks como useState.

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Menu, RotateCcw, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface CierreContentProps {
  setSidebarOpen: (open: boolean) => void;
}

// Componente principal para el contenido de Órdenes de Mantenimiento
export default function CierreContent({ setSidebarOpen }: CierreContentProps) {
  // Datos de ejemplo para las órdenes de mantenimiento
  const maintenanceOrders = [
    {
      id: "SM-00001",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0069 Válvula de Corte",
      plataforma: "COCX11",
      equipoPadre: "intercambiador",
      estado: "planeacion",
      urgencia: "urgente",
      empresa: "sabco",
    },
    {
      id: "SM-00002", 
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0069 Válvula de Corte",
      plataforma: "ALBACO",
      equipoPadre: "transmisor",
      estado: "espera",
      urgencia: "diferible",
      empresa: "otra",
    },
    {
      id: "SM-00003",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260", 
      details: "SDV-08003 / VASC0069 Válvula de Corte",
      plataforma: "COCX15",
      equipoPadre: "elemento",
      estado: "programada",
      urgencia: "programable",
      empresa: "sabco",
    },
    {
      id: "SM-00004",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0069 Válvula de Corte",
      plataforma: "MUELLE",
      equipoPadre: "intercambiador",
      estado: "ejecutada",
      urgencia: "urgente",
      empresa: "otra",
    },
    {
      id: "SM-00005",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0069 Válvula de Corte",
      plataforma: "COCX11",
      equipoPadre: "transmisor",
      estado: "notificadap",
      urgencia: "diferible",
      empresa: "sabco",
    }
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-slate-700 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Botón de menú para móviles */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Ordenes de mantenimiento pendientes de cierre</h1>
        </div>
         <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-auto p-6">
        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar Órdenes por nombre..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabla de Datos */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {maintenanceOrders.map((order) => (
                <div 
                  key={order.id} // Cambiado: Usar un ID único como 'key' es una mejor práctica.
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 mb-1">{order.id}</div>
                      <div className="text-sm text-gray-700 mb-1">{order.description}</div>
                      <div className="text-sm text-gray-500">{order.details}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Paginación */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="bg-gray-100">1</Button>
          <Button variant="ghost" size="sm">2</Button>
          <Button variant="ghost" size="sm">3</Button>
          <span className="text-gray-500 hidden sm:inline">...</span>
          <Button variant="ghost" size="sm">10</Button>
          <Button variant="ghost" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </>
  );
}