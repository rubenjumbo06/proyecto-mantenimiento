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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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

  const [filters, setFilters] = useState({
    plataforma: '',
    equipoPadre: '',
    estadoAviso: '',
    urgencia: '',
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const [newRequestOpen, setNewRequestOpen] = useState(false);

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

  const estadoAvisoOptions = [
    { value: "pendiente", label: "Pendiente" },
    { value: "aprobado", label: "Aprobado" },
    { value: "rechazado", label: "Rechazado" },
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
    if (key === 'estadoAviso') options = estadoAvisoOptions;
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
            <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Nueva Solicitud
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto [&>button.absolute]:hidden">
                <DialogHeader>
                  <DialogTitle>Solicitud de Mantenimiento</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input id="titulo" />
                  </div>
                  <div>
                    <Label htmlFor="id-solicitud">ID-Solicitud</Label>
                    <Input id="id-solicitud" />
                  </div>
                  <div>
                    <Label htmlFor="fecha-aviso">Fecha de aviso</Label>
                    <Input id="fecha-aviso" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <Input id="ubicacion" />
                  </div>
                  <div>
                    <Label htmlFor="equipo-hijo">Equipo Hijo</Label>
                    <Input id="equipo-hijo" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="descripcion">Descripción del aviso</Label>
                    <Textarea id="descripcion" />
                  </div>
                  <div>
                    <Label htmlFor="autor">Autor del aviso</Label>
                    <Input id="autor" />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input id="estado" />
                  </div>
                  <div>
                    <Label htmlFor="motivo-rechazo">Motivo de rechazo</Label>
                    <Input id="motivo-rechazo" />
                  </div>
                  <div>
                    <Label htmlFor="orden-trabajo">Orden trabajo [OT] asociada</Label>
                    <Input id="orden-trabajo" />
                  </div>
                  <div>
                    <Label htmlFor="estado-ot">Estado OT asociada</Label>
                    <Input id="estado-ot" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="fecha-funcional">¿El equipo dejó de funcionar(paró)?</Label>
                    <Switch id="fecha-funcional" />
                  </div>
                  <div>
                    <Label htmlFor="fecha-fin">Fecha y hora en que el equipo dejó de funcionar</Label>
                    <Input id="fecha-fin" type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setNewRequestOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setNewRequestOpen(false)} // Add actual save logic if needed
                  >
                    Guardar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                    <Label htmlFor="estado-aviso" className="mb-2 block">
                      Filtrar por Estado Aviso
                    </Label>
                    <Select
                      value={tempFilters.estadoAviso}
                      onValueChange={(value) => setTempFilters({ ...tempFilters, estadoAviso: value })}
                    >
                      <SelectTrigger id="estado-aviso">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadoAvisoOptions.map((opt) => (
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
            {filters.plataforma && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Plataforma</label>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                  <span>{getLabel('plataforma', filters.plataforma)}</span>
                  <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('plataforma')}>×</button>
                </Badge>
              </div>
            )}
            {filters.equipoPadre && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Equipo Padre</label>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                  <span>{getLabel('equipoPadre', filters.equipoPadre)}</span>
                  <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('equipoPadre')}>×</button>
                </Badge>
              </div>
            )}
            {filters.estadoAviso && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Estado de Aviso</label>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                  <span>{getLabel('estadoAviso', filters.estadoAviso)}</span>
                  <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('estadoAviso')}>×</button>
                </Badge>
              </div>
            )}
            {filters.urgencia && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Urgencia</label>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                  <span>{getLabel('urgencia', filters.urgencia)}</span>
                  <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('urgencia')}>×</button>
                </Badge>
              </div>
            )}
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