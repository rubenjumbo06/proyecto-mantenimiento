"use client"; // Agregado: Esencial para componentes de React que usan hooks como useState.

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Menu, RotateCcw, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrdenesContentProps {
  setSidebarOpen: (open: boolean) => void;
}

// Componente principal para el contenido de Órdenes de Mantenimiento
export default function OrdenesContent({ setSidebarOpen }: OrdenesContentProps) {
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

  // Estado para los filtros activos
  const [filters, setFilters] = useState({
    plataforma: '',
    equipoPadre: '',
    estado: '',
    urgencia: '',
    empresa: '',
  });

  // Estado para controlar la visibilidad del diálogo de filtros
  const [filterOpen, setFilterOpen] = useState(false);
  // Estado temporal para los filtros dentro del diálogo
  const [tempFilters, setTempFilters] = useState(filters);

  // Opciones para los select de filtros
  const plataformaOptions = [
    { value: "COCX11", label: "COCX11" },
    { value: "ALBACO", label: "ALBACO" },
    { value: "COCX15", label: "COCX15" },
    { value: "MUELLE", label: "MUELLE" },
  ];

  const equipoPadreOptions = [
    { value: "intercambiador", label: "Intercambiador Calor HARSCO" },
    { value: "transmisor", label: "IPLS0019 Transmisor de Nivel Fisher" },
    { value: "elemento", label: "FE-08380 / IPFS0025 Elemento de Flujo Hoffer Flow C" },
  ];

  const estadoOptions = [
    { value: "planeacion", label: "En Planeacion" },
    { value: "espera", label: "En espera de Recursos" },
    { value: "programada", label: "Programada" },
    { value: "ejecutada", label: "Ejecutada" },
    { value: "notificadap", label: "Notificada Parcialmente" },
    { value: "notificadaf", label: "Notificado Final" },
    { value: "cerrada", label: "Cerrada" },
    { value: "cancelada", label: "Cancelada" },
  ];

  const urgenciaOptions = [
    { value: "urgente", label: "Urgente +24h" },
    { value: "diferible", label: "Diferible <2d" },
    { value: "programable", label: "Programable +14d" },
  ];

  const empresaOptions = [
    { value: "sabco", label: "SABCO" },
    { value: "otra", label: "Otra" },
  ];

  // Función para obtener la etiqueta legible de un valor de filtro
  const getLabel = (key: keyof typeof filters, value: string) => {
    let options: { value: string; label: string }[] = [];
    if (key === 'plataforma') options = plataformaOptions;
    if (key === 'equipoPadre') options = equipoPadreOptions;
    if (key === 'estado') options = estadoOptions;
    if (key === 'urgencia') options = urgenciaOptions;
    if (key === 'empresa') options = empresaOptions;
    return options.find(opt => opt.value === value)?.label || value;
  };

  // Función para remover un filtro específico
  const removeFilter = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: '' });
  };

  // Lógica para filtrar las órdenes de mantenimiento
  const filteredOrders = maintenanceOrders.filter((order) => {
    if (filters.plataforma && order.plataforma !== filters.plataforma) return false;
    if (filters.equipoPadre && order.equipoPadre !== filters.equipoPadre) return false;
    if (filters.estado && order.estado !== filters.estado) return false;
    if (filters.urgencia && order.urgencia !== filters.urgencia) return false;
    if (filters.empresa && order.empresa !== filters.empresa) return false;
    return true;
  });

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
          <h1 className="text-xl font-semibold">Listado general de órdenes de mantenimiento</h1>
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
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-400">
                  Agregar Filtros
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto [&>button.absolute]:hidden">
                <DialogHeader>
                  <DialogTitle>Agregar Filtros:</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Filtro por Plataforma */}
                  <div>
                    <Label htmlFor="plataforma" className="mb-2 block">
                      Plataforma
                    </Label>
                    <Select
                      value={tempFilters.plataforma}
                      onValueChange={(value) => setTempFilters({ ...tempFilters, plataforma: value })}
                    >
                      <SelectTrigger id="plataforma">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {plataformaOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Filtro por Equipo Padre */}
                  <div>
                    <Label htmlFor="equipo-padre" className="mb-2 block">
                      Equipo Padre
                    </Label>
                    <Select
                      value={tempFilters.equipoPadre}
                      onValueChange={(value) => setTempFilters({ ...tempFilters, equipoPadre: value })}
                    >
                      <SelectTrigger id="equipo-padre">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipoPadreOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Filtro por Urgencia */}
                  <div>
                    <Label htmlFor="urgencia" className="mb-2 block">
                      Urgencia
                    </Label>
                    <Select
                      value={tempFilters.urgencia}
                      onValueChange={(value) => setTempFilters({ ...tempFilters, urgencia: value })}
                    >
                      <SelectTrigger id="urgencia">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgenciaOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Filtro por Empresa */}
                  <div>
                    <Label htmlFor="empresa" className="mb-2 block">
                      Empresa
                    </Label>
                    <Select
                      value={tempFilters.empresa}
                      onValueChange={(value) => setTempFilters({ ...tempFilters, empresa: value })}
                    >
                      <SelectTrigger id="empresa">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {empresaOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Filtro por Estado */}
                  <div>
                    <Label htmlFor="estado" className="mb-2 block">
                      Estado
                    </Label>
                    <Select
                      value={tempFilters.estado}
                      onValueChange={(value) => setTempFilters({ ...tempFilters, estado: value })}
                    >
                      <SelectTrigger id="estado">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadoOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                        setTempFilters(filters); // Resetea los filtros temporales a los activos
                        setFilterOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setFilters(tempFilters);
                      setFilterOpen(false);
                    }}
                  >
                    Aceptar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar Órdenes por nombre..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Etiquetas de Filtros Activos */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {Object.entries(filters).map(([key, value]) => {
            if (value) {
              const filterKey = key as keyof typeof filters;
              const labelMap: { [key: string]: string } = {
                plataforma: "Plataforma",
                equipoPadre: "Equipo Padre",
                estado: "Estado",
                urgencia: "Urgencia",
                empresa: "Empresa",
              };
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{labelMap[filterKey]}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    <span>{getLabel(filterKey, value)}</span>
                    <button className="ml-2 text-blue-600 hover:text-blue-800" onClick={() => removeFilter(filterKey)}>×</button>
                  </Badge>
                </div>
              );
            }
            return null;
          })}
        </div>


        {/* Tabla de Datos */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
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
