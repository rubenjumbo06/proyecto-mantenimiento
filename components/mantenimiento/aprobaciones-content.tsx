
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

interface AprobacionesContentProps {
  setSidebarOpen: (open: boolean) => void;
}

interface Aprobacion {
  id: number;
  titulo: string;
  aviso_id: number;
  fecha_aviso: string | null;
  urgencia_id: number | null;
  autor_id: number;
  ubicacion_id: number | null;
  equipo_padre_id: number;
  equipo_hijo_id: number;
  descripcion: string | null;
  descripcion_modo: string | null;
  descripcion_metodo: string | null;
  documento_adjunto: string | null;
  duracion: string | null;
  equipo_paro: boolean;
  equipo_paro_fechahora: string | null;
  impacto_id: number | null;
  severidad_id: number | null;
  modo_id: number | null;
  deteccion_id: number | null;
  tipointervencion_id: number | null;
  especialidad_id: number | null;
  contratista_id: number | null;
  cantidad_personas_asignadas: number | null;
  codigo_clase: string | null;
  prioridad_ejecucion: string | null;
  fecha_creacion: string;
  usuario_id: number | null;
}

interface Option {
  value: string;
  label: string;
}

export function AprobacionesContent({ setSidebarOpen }: AprobacionesContentProps) {
  const [aprobaciones, setAprobaciones] = useState<Aprobacion[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState({
    plataforma: '',
    equipoPadre: '',
    urgencia: '',
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAprobacion, setSelectedAprobacion] = useState<Aprobacion | null>(null);

  const [ubicacionOptions, setUbicacionOptions] = useState<Option[]>([]);
  const [equipoOptions, setEquipoOptions] = useState<Option[]>([]);
  const [urgenciaOptions, setUrgenciaOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [ubicacionesRes, equiposRes, urgenciasRes] = await Promise.all([
          fetch('/api/filtros?type=ubicaciones'),
          fetch('/api/filtros?type=equipos'),
          fetch('/api/filtros?type=urgencias'),
        ]);

        const ubicacionesData = await ubicacionesRes.json();
        const equiposData = await equiposRes.json();
        const urgenciasData = await urgenciasRes.json();

        setUbicacionOptions(ubicacionesData || []);
        setEquipoOptions(equiposData || []);
        setUrgenciaOptions(urgenciasData || []);
      } catch (error) {
        console.error('Error cargando opciones:', error);
      }
    };

    fetchOptions();
  }, []);

  const fetchAprobaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/aprobaciones?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (filters.urgencia) url += `&urgencia_id=${filters.urgencia}`;
      if (filters.equipoPadre) url += `&equipo_padre_id=${filters.equipoPadre.replace('padre-', '')}`;
      if (filters.plataforma) url += `&ubicacion_id=${filters.plataforma}`;

      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al obtener datos');
      }
      const { data, total } = await res.json();
      setAprobaciones(data || []);
      setTotal(total || 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAprobaciones();
  }, [page, search, filters]);

  const getLabel = (key: keyof typeof filters, value: string) => {
    let options: Option[] = [];
    if (key === 'plataforma') options = ubicacionOptions;
    if (key === 'equipoPadre') options = equipoOptions;
    if (key === 'urgencia') options = urgenciaOptions;
    return options.find(opt => opt.value === value)?.label || value;
  };

  const removeFilter = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: '' });
  };

  const formatSolicitudId = (id: number) => `SM-${id.toString().padStart(5, '0')}`;

  const totalPages = Math.ceil(total / limit);

  return (
    <>
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

      <main className="flex-1 overflow-auto p-6">
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
                        <SelectValue placeholder="Selecciona plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        {ubicacionOptions.map((opt) => (
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
                        <SelectValue placeholder="Selecciona equipo padre" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipoOptions.filter(opt => opt.value.startsWith('padre-')).map((opt) => (
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
              {total}
            </Badge>
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

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {filters.plataforma && (
            <>
              <span className="text-sm font-medium text-gray-700">Plataforma</span>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                <span>{getLabel('plataforma', filters.plataforma)}</span>
                <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('plataforma')}>×</button>
              </Badge>
            </>
          )}
          {filters.equipoPadre && (
            <>
              <span className="text-sm font-medium text-gray-700">Equipo Padre</span>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                <span>{getLabel('equipoPadre', filters.equipoPadre)}</span>
                <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('equipoPadre')}>×</button>
              </Badge>
            </>
          )}
          {filters.urgencia && (
            <>
              <span className="text-sm font-medium text-gray-700">Urgencia</span>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 hover:bg-teal-200">
                <span>{getLabel('urgencia', filters.urgencia)}</span>
                <button className="ml-2 text-teal-600 hover:text-teal-800" onClick={() => removeFilter('urgencia')}>×</button>
              </Badge>
            </>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <p className="p-4">Cargando...</p>
            ) : error ? (
              <p className="p-4 text-red-500">Error: {error}</p>
            ) : aprobaciones.length === 0 ? (
              <p className="p-4">No hay aprobaciones.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {aprobaciones.map((aprobacion) => (
                  <Dialog key={aprobacion.id} open={viewOpen && selectedAprobacion?.id === aprobacion.id} onOpenChange={setViewOpen}>
                    <DialogTrigger asChild>
                      <div 
                        className="p-4 hover:bg-green-200 cursor-pointer bg-green-100"
                        onClick={() => {
                          setSelectedAprobacion(aprobacion);
                          setViewOpen(true);
                        }}
                      >
                        <div className="font-medium text-gray-900 mb-1">{formatSolicitudId(aprobacion.aviso_id)}</div>
                        <div className="text-sm text-gray-700 mb-1">{aprobacion.titulo}</div>
                        <div className="text-sm text-gray-500">
                          {equipoOptions.find(opt => opt.value === `padre-${aprobacion.equipo_padre_id}`)?.label ?? 'Equipo Padre N/A'} / 
                          {equipoOptions.find(opt => opt.value === `hijo-${aprobacion.equipo_hijo_id}`)?.label ?? 'Equipo Hijo N/A'}
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto [&>button.absolute]:hidden">
                      <DialogHeader>
                        <DialogTitle>Detalles de Aprobación</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div>
                          <Label>Título</Label>
                          <p>{selectedAprobacion?.titulo ?? 'N/A'}</p>
                        </div>
                        <div>
                          <Label>ID-Solicitud</Label>
                          <p>{selectedAprobacion ? formatSolicitudId(selectedAprobacion.aviso_id) : 'N/A'}</p>
                        </div>
                        <div>
                          <Label>Fecha de aviso</Label>
                          <p>{selectedAprobacion && selectedAprobacion.fecha_aviso ? new Date(selectedAprobacion.fecha_aviso).toLocaleString('es-ES') : 'N/A'}</p>
                        </div>
                        <div>
                          <Label>Equipo Padre</Label>
                          <p>
                            {selectedAprobacion && selectedAprobacion.equipo_padre_id
                              ? equipoOptions.find(opt => opt.value === `padre-${selectedAprobacion.equipo_padre_id}`)?.label ?? 'N/A'
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <Label>Ubicación</Label>
                          <p>
                            {selectedAprobacion && selectedAprobacion.ubicacion_id != null
                              ? ubicacionOptions.find(opt => opt.value === selectedAprobacion.ubicacion_id!.toString())?.label ?? 'N/A'
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <Label>Equipo Hijo</Label>
                          <p>
                            {selectedAprobacion && selectedAprobacion.equipo_hijo_id
                              ? equipoOptions.find(opt => opt.value === `hijo-${selectedAprobacion.equipo_hijo_id}`)?.label ?? 'N/A'
                              : 'N/A'}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <Label>Descripción</Label>
                          <p>{selectedAprobacion?.descripcion ?? 'N/A'}</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="destructive" onClick={() => setViewOpen(false)}>
                          Cerrar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
