"use client";

import { useState, useEffect } from 'react';
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
  const [solicitudes, setSolicitudes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState({
    plataforma: '',
    equipoPadre: '',
    estadoAviso: '',
    urgencia: '',
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    titulo: '',
    codigo: '',
    descripcion: '',
    fecha_aviso: new Date().toISOString().split('T')[0],
    estado_id: null as number | null,
    paro: false,
    fecha_paro: '',
    autor_id: 1,
    equipo_padre_id: null as number | null,
    equipo_hijo_id: null as number | null,
    urgencia_id: null as number | null,
    impacto_id: null as number | null,
    severidad_id: null as number | null,
    modo_id: null as number | null,
    deteccion_id: null as number | null,
    tipo_intervencion_id: null as number | null,
  });

  // Options hardcoded (fetch dinámicos si necesitas)
  const plataformaOptions = [
    { value: "COCX11", label: "COCX11" },
    { value: "ALBACO", label: "ALBACO" },
    { value: "COCX15", label: "COCX15" },
    { value: "MUELLE", label: "MUELLE" },
  ];

  const equipoPadreOptions = [
    { value: "1", label: "Intercambiador Calor HARSCO" }, // Asume values como IDs numéricos
    { value: "2", label: "IPLS0019 Transmisor de Nivel Fisher" },
    { value: "3", label: "FE-08380 / IPFS0025 Elemento de Flujo Hoffer Flow C" },
  ];

  const estadoAvisoOptions = [
    { value: "1", label: "Pendiente" },
    { value: "2", label: "Aprobado" },
    { value: "3", label: "Rechazado" },
  ];

  const urgenciaOptions = [
    { value: "1", label: "Urgente +24h" },
    { value: "2", label: "Diferible <2d" },
    { value: "3", label: "Programable +14d" },
  ];

  // Agrega options para otros IDs (impacto, severidad, etc.)
  const impactoOptions = [
    { value: "1", label: "Bajo" },
    { value: "2", label: "Medio" },
    { value: "3", label: "Alto" },
  ];
  // Repite para severidad_id, modo_id, deteccion_id, tipo_intervencion_id

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
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/solicitudes?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (filters.estadoAviso) url += `&estado_id=${filters.estadoAviso}`;
      if (filters.urgencia) url += `&urgencia_id=${filters.urgencia}`;
      if (filters.equipoPadre) url += `&equipo_padre_id=${filters.equipoPadre}`; // Asume campo directo
      // Agrega &plataforma si es un campo; si es join, ajusta API

      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al fetch');
      const { data, total } = await res.json();
      setSolicitudes(data);
      setTotal(total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, filters]);

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewForm({ ...newForm, [name]: value });
  };

  const handleSaveNew = async () => {
    if (!newForm.titulo) {
      alert('El título es requerido');
      return;
    }
    if (newForm.estado_id === null) {
      alert('El estado es requerido'); // Agrega más validaciones según necesites
      return;
    }
    // Si paro es false, limpia fecha_paro
    if (!newForm.paro) {
      newForm.fecha_paro = '';
    }
    try {
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      setNewRequestOpen(false);
      fetchData();
    } catch (err) {
      alert('Error: ' + (err as Error).message);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {/* Header */}
      <header className="bg-slate-700 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
                    <Input id="titulo" name="titulo" value={newForm.titulo} onChange={handleNewChange} />
                  </div>
                  <div>
                    <Label htmlFor="codigo">Código (opcional)</Label>
                    <Input id="codigo" name="codigo" value={newForm.codigo} onChange={handleNewChange} />
                  </div>
                  <div>
                    <Label htmlFor="fecha-aviso">Fecha de aviso</Label>
                    <Input id="fecha-aviso" name="fecha_aviso" type="date" value={newForm.fecha_aviso} onChange={handleNewChange} />
                  </div>
                  <div>
                    <Label htmlFor="estado_id">Estado</Label>
                    <Select
                      value={newForm.estado_id?.toString() || ''}
                      onValueChange={(value) => setNewForm({ ...newForm, estado_id: value ? parseInt(value) : null })}
                    >
                      <SelectTrigger id="estado_id">
                        <SelectValue placeholder="Selecciona estado" />
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
                    <Label htmlFor="urgencia_id">Urgencia</Label>
                    <Select
                      value={newForm.urgencia_id?.toString() || ''}
                      onValueChange={(value) => setNewForm({ ...newForm, urgencia_id: value ? parseInt(value) : null })}
                    >
                      <SelectTrigger id="urgencia_id">
                        <SelectValue placeholder="Selecciona urgencia" />
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
                  <div>
                    <Label htmlFor="impacto_id">Impacto</Label>
                    <Select
                      value={newForm.impacto_id?.toString() || ''}
                      onValueChange={(value) => setNewForm({ ...newForm, impacto_id: value ? parseInt(value) : null })}
                    >
                      <SelectTrigger id="impacto_id">
                        <SelectValue placeholder="Selecciona impacto" />
                      </SelectTrigger>
                      <SelectContent>
                        {impactoOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Repite Select para severidad_id, modo_id, deteccion_id, tipo_intervencion_id, equipo_padre_id, equipo_hijo_id */}
                  <div className="md:col-span-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea id="descripcion" name="descripcion" value={newForm.descripcion} onChange={handleNewChange} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="paro">¿Paró?</Label>
                    <Switch id="paro" checked={newForm.paro} onCheckedChange={(checked) => setNewForm({ ...newForm, paro: checked })} />
                  </div>
                  {newForm.paro && (
                    <div>
                      <Label htmlFor="fecha-paro">Fecha paro</Label>
                      <Input id="fecha-paro" name="fecha_paro" type="date" value={newForm.fecha_paro} onChange={handleNewChange} />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="destructive" onClick={() => setNewRequestOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveNew}>
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
              placeholder="Buscar por título o descripción..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {filters.plataforma && (
            <>
              <span className="text-sm font-medium text-gray-700">Plataforma</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <span>{getLabel('plataforma', filters.plataforma)}</span>
                <button className="ml-2 text-blue-600 hover:text-blue-800" onClick={() => removeFilter('plataforma')}>×</button>
              </Badge>
            </>
          )}
          {filters.equipoPadre && (
            <>
              <span className="text-sm font-medium text-gray-700">Equipo Padre</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <span>{getLabel('equipoPadre', filters.equipoPadre)}</span>
                <button className="ml-2 text-blue-600 hover:text-blue-800" onClick={() => removeFilter('equipoPadre')}>×</button>
              </Badge>
            </>
          )}
          {filters.estadoAviso && (
            <>
              <span className="text-sm font-medium text-gray-700">Estado de Aviso</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <span>{getLabel('estadoAviso', filters.estadoAviso)}</span>
                <button className="ml-2 text-blue-600 hover:text-blue-800" onClick={() => removeFilter('estadoAviso')}>×</button>
              </Badge>
            </>
          )}
          {filters.urgencia && (
            <>
              <span className="text-sm font-medium text-gray-700">Urgencia</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <span>{getLabel('urgencia', filters.urgencia)}</span>
                <button className="ml-2 text-blue-600 hover:text-blue-800" onClick={() => removeFilter('urgencia')}>×</button>
              </Badge>
            </>
          )}
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <p className="p-4">Cargando...</p>
            ) : error ? (
              <p className="p-4 text-red-500">Error: {error}</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {solicitudes.map((request: any, index: number) => (
                  <div 
                    key={request.solicitud_id} 
                    className={`p-4 cursor-pointer ${index % 2 === 0 ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">{request.codigo}</div>
                        <div className="text-sm text-gray-700 mb-1">{request.titulo}</div>
                        <div className="text-sm text-gray-500">{request.descripcion}</div>
                      </div>
                      <div className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                        Creado: {new Date(request.fecha_aviso).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button key={p} variant="ghost" size="sm" className={p === page ? 'bg-gray-100' : ''} onClick={() => setPage(p)}>
              {p}
            </Button>
          ))}
          <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </>
  );
}