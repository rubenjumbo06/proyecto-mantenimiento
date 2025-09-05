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
  solicitudaprobada_id: number;
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
  documento_adjunto?: string | null;
  duracion: string | null;
  impacto_id: number | null;
  severidad_id: number | null;
  modo_id: number | null;
  deteccion_id: number | null;
  tipointervencion_id: number | null;
  especialidad_id: number | null;
  contratista_id: number | null;
  cantidad_personas_asignadas: number | null;
  codigo_clase: string | null;
  prioridad_ejecucion?: string | null;
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
  const [formData, setFormData] = useState<Partial<Aprobacion> | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleInputChange = (field: keyof Aprobacion, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData || !selectedAprobacion) return;

    // Validate required fields
    const requiredFields: (keyof Aprobacion)[] = ['titulo', 'aviso_id', 'autor_id', 'equipo_padre_id', 'equipo_hijo_id'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setFormError(`El campo ${field} es obligatorio`);
        return;
      }
    }

    try {
      const response = await fetch(`/api/aprobaciones`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ solicitudaprobada_id: selectedAprobacion.solicitudaprobada_id, ...formData }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al actualizar la aprobación');
      }

      setFormError(null);
      setViewOpen(false);
      fetchAprobaciones(); // Refresh the list
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  useEffect(() => {
    if (selectedAprobacion) {
      setFormData({
        titulo: selectedAprobacion.titulo,
        fecha_aviso: selectedAprobacion.fecha_aviso,
        urgencia_id: selectedAprobacion.urgencia_id,
        autor_id: selectedAprobacion.autor_id,
        ubicacion_id: selectedAprobacion.ubicacion_id,
        equipo_padre_id: selectedAprobacion.equipo_padre_id,
        equipo_hijo_id: selectedAprobacion.equipo_hijo_id,
        descripcion: selectedAprobacion.descripcion,
        descripcion_modo: selectedAprobacion.descripcion_modo,
        descripcion_metodo: selectedAprobacion.descripcion_metodo,
        documento_adjunto: selectedAprobacion.documento_adjunto,
        duracion: selectedAprobacion.duracion,
        impacto_id: selectedAprobacion.impacto_id,
        severidad_id: selectedAprobacion.severidad_id,
        modo_id: selectedAprobacion.modo_id,
        deteccion_id: selectedAprobacion.deteccion_id,
        tipointervencion_id: selectedAprobacion.tipointervencion_id,
        especialidad_id: selectedAprobacion.especialidad_id,
        contratista_id: selectedAprobacion.contratista_id,
        cantidad_personas_asignadas: selectedAprobacion.cantidad_personas_asignadas,
        codigo_clase: selectedAprobacion.codigo_clase,
        prioridad_ejecucion: selectedAprobacion.prioridad_ejecucion,
        usuario_id: selectedAprobacion.usuario_id,
      });
    }
  }, [selectedAprobacion]);

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
          <h1 className="text-xl font-semibold">Avisos de Mantenimiento Aprobados</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600" onClick={fetchAprobaciones}>
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

        {formError && (
          <p className="text-red-500 mb-4">{formError}</p>
        )}

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
                  <Dialog key={aprobacion.solicitudaprobada_id} open={viewOpen && selectedAprobacion?.solicitudaprobada_id === aprobacion.solicitudaprobada_id} onOpenChange={setViewOpen}>
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
                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto [&>button.absolute]:hidden">
                      <DialogHeader>
                        <DialogTitle>Editar Solicitud Aprobada de Mantenimiento</DialogTitle>
                      </DialogHeader>

                      {selectedAprobacion && formData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-sm">
                          {/* Campo: Título */}
                          <div>
                            <Label htmlFor="titulo">Título</Label>
                            <Input 
                              id="titulo" 
                              value={formData.titulo || ''} 
                              onChange={(e) => handleInputChange('titulo', e.target.value)}
                            />
                          </div>

                          {/* Campo: ID-Solicitud */}
                          <div>
                            <Label>ID-Solicitud</Label>
                            <Input value={formatSolicitudId(selectedAprobacion.aviso_id)} disabled />
                          </div>

                          {/* Campo: Fecha de aviso */}
                          <div>
                            <Label>Fecha de aviso</Label>
                            <Input
                              type="datetime-local"
                              value={formData.fecha_aviso ? new Date(formData.fecha_aviso).toISOString().slice(0, 16) : ''}
                              onChange={(e) => handleInputChange('fecha_aviso', e.target.value)}
                            />
                          </div>

                          {/* Campo: Estado */}
                          <div>
                            <Label>Estado</Label>
                            <Input value="Aprobado" disabled />
                          </div>

                          {/* Campo: Equipo Padre */}
                          <div>
                            <Label>Equipo Padre</Label>
                            <Select 
                              value={String(formData.equipo_padre_id)} 
                              onValueChange={(value) => handleInputChange('equipo_padre_id', parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar equipo padre" />
                              </SelectTrigger>
                              <SelectContent>
                                {equipoOptions
                                  .filter((opt) => opt.value.startsWith("padre-"))
                                  .map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value.replace("padre-", "")}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Campo: Equipo Hijo */}
                          <div>
                            <Label>Equipo Hijo</Label>
                            <Select 
                              value={String(formData.equipo_hijo_id)} 
                              onValueChange={(value) => handleInputChange('equipo_hijo_id', parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar equipo hijo" />
                              </SelectTrigger>
                              <SelectContent>
                                {equipoOptions
                                  .filter((opt) => opt.value.startsWith("hijo-"))
                                  .map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value.replace("hijo-", "")}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Campo: Autor */}
                          <div>
                            <Label>Autor del aviso</Label>
                            <Input value="Elmer Boulangger" disabled />
                          </div>

                          {/* Campo: Ubicación */}
                          <div>
                            <Label>Ubicación</Label>
                            <Select 
                              value={String(formData.ubicacion_id)} 
                              onValueChange={(value) => handleInputChange('ubicacion_id', parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar ubicación" />
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

                          {/* Campo: Descripción */}
                          <div className="md:col-span-2">
                            <Label>Descripción del aviso</Label>
                            <textarea
                              className="w-full border rounded-md p-2"
                              rows={5}
                              value={formData.descripcion ?? ""}
                              onChange={(e) => handleInputChange('descripcion', e.target.value)}
                            />
                          </div>

                          {/* Campo: ¿Equipo dejó de funcionar? */}
                          <div>
                            <Label>¿El equipo dejó de funcionar?</Label>
                            <Select
                              value={formData.modo_id ? 'sí' : 'no'}
                              onValueChange={(value) => handleInputChange('modo_id', value === 'sí' ? 1 : null)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sí">Sí</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Campo: Duración */}
                          <div>
                            <Label>Duración (h)</Label>
                            <Input 
                              type="text" 
                              value={formData.duracion ?? ""} 
                              onChange={(e) => handleInputChange('duracion', e.target.value)}
                            />
                          </div>

                          {/* Campo: Impacto */}
                          <div>
                            <Label>Impacto de falla</Label>
                            <Input 
                              type="number" 
                              value={formData.impacto_id ?? ""} 
                              onChange={(e) => handleInputChange('impacto_id', parseInt(e.target.value) || null)}
                            />
                          </div>

                          {/* Campo: Especialidad */}
                          <div>
                            <Label>Especialidad</Label>
                            <Input 
                              type="number" 
                              value={formData.especialidad_id ?? ""} 
                              onChange={(e) => handleInputChange('especialidad_id', parseInt(e.target.value) || null)}
                            />
                          </div>

                          {/* Campo: Personas asignadas */}
                          <div>
                            <Label>Personas asignadas</Label>
                            <Input
                              type="number"
                              value={formData.cantidad_personas_asignadas ?? ""}
                              onChange={(e) => handleInputChange('cantidad_personas_asignadas', parseInt(e.target.value) || null)}
                            />
                          </div>

                          {/* Campo: Contratista */}
                          <div>
                            <Label>Contratista</Label>
                            <Input 
                              type="number" 
                              value={formData.contratista_id ?? ""} 
                              onChange={(e) => handleInputChange('contratista_id', parseInt(e.target.value) || null)}
                            />
                          </div>

                          {/* Campo: Tipo de intervención */}
                          <div>
                            <Label>Tipo de intervención</Label>
                            <Input 
                              type="number" 
                              value={formData.tipointervencion_id ?? ""} 
                              onChange={(e) => handleInputChange('tipointervencion_id', parseInt(e.target.value) || null)}
                            />
                          </div>

                          {/* Campo: Código clase equipo */}
                          <div>
                            <Label>Código clase equipo</Label>
                            <Input 
                              value={formData.codigo_clase ?? ""} 
                              onChange={(e) => handleInputChange('codigo_clase', e.target.value)}
                            />
                          </div>

                          {/* Campo: Severidad */}
                          <div>
                            <Label>Severidad de falla</Label>
                            <Input 
                              type="number" 
                              value={formData.severidad_id ?? ""} 
                              onChange={(e) => handleInputChange('severidad_id', parseInt(e.target.value) || null)}
                            />
                          </div>

                          {/* Campo: Prioridad */}
                          <div>
                            <Label>Prioridad</Label>
                            <Input value="Programable ← 14d" disabled />
                          </div>

                          {/* Campo: Modo de falla */}
                          <div>
                            <Label>Modo de falla</Label>
                            <Input 
                              type="number" 
                              value={formData.modo_id ?? ""} 
                              onChange={(e) => handleInputChange('modo_id', parseInt(e.target.value) || null)}
                            />
                          </div>

                          {/* Campo: Descripción modo */}
                          <div className="md:col-span-2">
                            <Label>Descripción modo de falla</Label>
                            <textarea
                              className="w-full border rounded-md p-2"
                              rows={3}
                              value={formData.descripcion_modo ?? ""}
                              onChange={(e) => handleInputChange('descripcion_modo', e.target.value)}
                            />
                          </div>

                          {/* Campo: Detección */}
                          <div>
                            <Label>Detección de falla</Label>
                            <Input 
                              type="number" 
                              value={formData.deteccion_id ?? ""} 
                              onChange={(e) => handleInputChange('deteccion_id', parseInt(e.target.value) || null)}
                            />
                          </div>

                          {/* Campo: Método de detección */}
                          <div className="md:col-span-2">
                            <Label>Descripción método de detección</Label>
                            <textarea
                              className="w-full border rounded-md p-2"
                              rows={3}
                              value={formData.descripcion_metodo ?? ""}
                              onChange={(e) => handleInputChange('descripcion_metodo', e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      <DialogFooter>
                        <Button variant="destructive" onClick={() => setViewOpen(false)}>
                          Cerrar
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={handleSubmit}
                        >
                          Guardar
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