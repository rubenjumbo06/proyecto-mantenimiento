"use client";

import { useState } from 'react';
import { Search, RotateCcw, ArrowUpDown, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
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

interface SolicitudesContentProps {
  setSidebarOpen: (open: boolean) => void;
}

export function AprobacionesContent({ setSidebarOpen }: SolicitudesContentProps) {
  const maintenanceRequests = [
    {
      id: "SM-00001",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0069 Válvula de Corte"
    },
    {
      id: "SM-00002", 
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0069 Válvula de Corte"
    },
    {
      id: "SM-00003",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260", 
      details: "SDV-08003 / VASC0069 Válvula de Corte"
    },
    {
      id: "SM-00004",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0069 Válvula de Corte"
    },
    {
      id: "SM-00005",
      description: "MERLA DE INYECCION DE GAS OZO AX08-260",
      details: "SDV-08003 / VASC0069 Válvula de Corte"
    }
  ];

  const [filters, setFilters] = useState({
    plataforma: '',
    equipoPadre: '',
    urgencia: '',
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

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

  const urgenciaOptions = [
    { value: "urgente", label: "Urgente +24h" },
    { value: "diferible", label: "Diferible <2d" },
    { value: "programable", label: "Programable +14d" },
  ];

  const getLabel = (key: keyof typeof filters, value: string) => {
    let options: { value: string; label: string }[] = [];
    if (key === 'plataforma') options = plataformaOptions;
    if (key === 'equipoPadre') options = equipoPadreOptions;
    if (key === 'urgencia') options = urgenciaOptions;
    return options.find(opt => opt.value === value)?.label || value;
  };

  const removeFilter = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: '' });
  };

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
          <h1 className="text-xl font-semibold">Avisos de Mantenimiento por Aprobacion</h1>
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
          <div className="flex items-center gap-3">
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
                  <div>
                    <Label htmlFor="plataforma" className="mb-2 block">
                      Filtrar por Plataforma
                    </Label>
                    <Select
                      value={tempFilters.plataforma}
                      onValueChange={(value) => setTempFilters({ ...tempFilters, plataforma: value })}
                    >
                      <SelectTrigger id="plataforma">
                        <SelectValue placeholder="Select" />
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
                  <div>
                    <Label htmlFor="equipo-padre" className="mb-2 block">
                      Filtrar por Equipo Padre
                    </Label>
                    <Select
                      value={tempFilters.equipoPadre}
                      onValueChange={(value) => setTempFilters({ ...tempFilters, equipoPadre: value })}
                    >
                      <SelectTrigger id="equipo-padre">
                        <SelectValue placeholder="Select" />
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
                  <div>
                    <Label htmlFor="urgencia" className="mb-2 block">
                      Filtrar por Urgencia
                    </Label>
                    <Select
                      value={tempFilters.urgencia}
                      onValueChange={(value) => setTempFilters({ ...tempFilters, urgencia: value })}
                    >
                      <SelectTrigger id="urgencia">
                        <SelectValue placeholder="Select" />
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
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setFilterOpen(false)}
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
            <Badge variant="destructive" className="rounded-full px-2 py-1">
              12
            </Badge>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar Solicitudes por nombre..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-4 mb-6">
          {filters.plataforma && (
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
              <span>{getLabel('plataforma', filters.plataforma)}</span>
              <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('plataforma')}>×</button>
            </Badge>
          )}
          {filters.equipoPadre && (
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
              <span>{getLabel('equipoPadre', filters.equipoPadre)}</span>
              <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('equipoPadre')}>×</button>
            </Badge>
          )}
          {filters.urgencia && (
            <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
              <span>{getLabel('urgencia', filters.urgencia)}</span>
              <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('urgencia')}>×</button>
            </Badge>
          )}
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {maintenanceRequests.map((request, index) => (
                <div key={index} className="p-4 hover:bg-green-200 cursor-pointer bg-green-100">
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