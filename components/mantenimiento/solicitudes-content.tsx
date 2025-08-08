"use client";

import { Search, RotateCcw, ArrowUpDown, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SolicitudesContentProps {
  setSidebarOpen: (open: boolean) => void;
}

export function SolicitudesContent({ setSidebarOpen }: SolicitudesContentProps) {
  const maintenanceRequests = [
    {
      id: "SM-00001",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0009 Válvula de Corte"
    },
    {
      id: "SM-00002", 
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0009 Válvula de Corte"
    },
    {
      id: "SM-00003",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260", 
      details: "SDV-08003 / VASC0009 Válvula de Corte"
    },
    {
      id: "SM-00004",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0009 Válvula de Corte"
    },
    {
      id: "SM-00005",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0009 Válvula de Corte"
    }
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-slate-700 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-slate-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Solicitudes de Mantenimiento</h1>
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Nueva Solicitud
            </Button>
            <Button variant="outline" className="border-gray-400">
              Agregar Filtros
            </Button>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar órdenes por nombre..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Plataforma</label>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                <span>CDC011</span>
                <button className="ml-2 text-teal-600 hover:text-teal-800">×</button>
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Equipo Padre</label>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                <span>Intercambiador Calor HARSCO</span>
                <button className="ml-2 text-teal-600 hover:text-teal-800">×</button>
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Estado de Aviso</label>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                <span>Mantenimiento</span>
                <button className="ml-2 text-teal-600 hover:text-teal-800">×</button>
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Urgencia</label>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                <span>Urgente + 24h</span>
                <button className="ml-2 text-teal-600 hover:text-teal-800">×</button>
              </Badge>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {maintenanceRequests.map((request, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="font-medium text-gray-900 mb-1">{request.id}</div>
                  <div className="text-sm text-gray-700 mb-1">{request.description}</div>
                  <div className="text-sm text-gray-500">{request.details}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="bg-gray-100">1</Button>
          <Button variant="ghost" size="sm">2</Button>
          <Button variant="ghost" size="sm">3</Button>
          <Button variant="ghost" size="sm">4</Button>
          <Button variant="ghost" size="sm">5</Button>
          <span className="text-gray-500 hidden sm:inline">6 ...</span>
          <Button variant="ghost" size="sm">10</Button>
          <Button variant="ghost" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </>
  );
}
