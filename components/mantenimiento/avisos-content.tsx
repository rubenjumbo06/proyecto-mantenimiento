"use client";

import { useState, useEffect } from 'react';
import { Search, RotateCcw, ArrowUpDown, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toLocalISOString, formatFechaHora } from "@/app/utils/dateHelpers";
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

interface AvisosContentProps {
  setSidebarOpen: (open: boolean) => void;
}

interface Aviso {
  aviso_id: number;
  titulo: string;
  descripcion: string;
  fecha_aviso: string;
  estadoaviso_id: number | null;
  rechazado: boolean;
  equipo_padre_id: number | null;
  equipo_hijo_id: number | null;
  autor_id: number;
  ubicacion_id: number | null;
  urgencia_id: number | null;
  motivo_rechazo: string | null;
  detalle_rechazo: string | null;
  ot_asociada: string | null;
  estado_ot_id: number | null;
  paro: boolean;
  fecha_paro: string | null;
}

interface Option {
  value: string;
  label: string;
}

export function AvisosContent({ setSidebarOpen }: AvisosContentProps) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
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
    descripcion: '',
    fecha_aviso: '',
    estadoaviso_id: 1 as number | null,
    paro: false,
    fecha_paro: '',
    autor_id: 1,
    equipo_padre_id: null as number | null,
    equipo_hijo_id: null as number | null,
    urgencia_id: null as number | null,
    ubicacion_id: null as number | null,
    impacto_id: null as number | null,
    severidad_id: null as number | null,
    modo_id: null as number | null,
    deteccion_id: null as number | null,
    tipo_intervencion_id: null as number | null,
    ot_asociada: '' as string | null,
    estado_ot_id: null as number | null,
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAviso, setSelectedAviso] = useState<Aviso | null>(null);
  const [editForm, setEditForm] = useState({
    ot_asociada: '' as string | null,
    estado_ot_id: null as number | null,
  });
  const [rejectionForm, setRejectionForm] = useState({ motivo_rechazo: '', detalle_rechazo: '' });
  const [showRejectionFields, setShowRejectionFields] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [ubicacionOptions, setUbicacionOptions] = useState<Option[]>([]);
  const [equipoOptions, setEquipoOptions] = useState<Option[]>([]);
  const [estadoAvisoOptions, setEstadoAvisoOptions] = useState<Option[]>([]);
  const [urgenciaOptions, setUrgenciaOptions] = useState<Option[]>([]);
  const [usuarioOptions, setUsuarioOptions] = useState<Option[]>([]);
  const [estadoOtOptions, setEstadoOtOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [ubicacionesRes, equiposRes, estadosRes, urgenciasRes, usuariosRes, estadoOtRes] = await Promise.all([
          fetch('/api/filtros?type=ubicaciones'),
          fetch('/api/filtros?type=equipos'),
          fetch('/api/filtros?type=estados'),
          fetch('/api/filtros?type=urgencias'),
          fetch('/api/filtros?type=usuarios'),
          fetch('/api/filtros?type=estados_ot'),
        ]);

        const responses = await Promise.all([
          ubicacionesRes.json().catch(() => []),
          equiposRes.json().catch(() => []),
          estadosRes.json().catch(() => []),
          urgenciasRes.json().catch(() => []),
          usuariosRes.json().catch(() => []),
          estadoOtRes.json().catch(() => []),
        ]);

        const [ubicacionesData, equiposData, estadosData, urgenciasData, usuariosData, estadoOtData] = responses;

        if (!ubicacionesRes.ok || !Array.isArray(ubicacionesData)) throw new Error('Error al cargar ubicaciones');
        if (!equiposRes.ok || !Array.isArray(equiposData)) throw new Error('Error al cargar equipos');
        if (!estadosRes.ok || !Array.isArray(estadosData)) throw new Error('Error al cargar estados');
        if (!urgenciasRes.ok || !Array.isArray(urgenciasData)) throw new Error('Error al cargar urgencias');
        if (!usuariosRes.ok || !Array.isArray(usuariosData)) throw new Error('Error al cargar usuarios');
        if (!estadoOtRes.ok || !Array.isArray(estadoOtData)) throw new Error('Error al cargar estados OT');

        setUbicacionOptions(ubicacionesData);
        setEquipoOptions(equiposData);
        setEstadoAvisoOptions(estadosData);
        setUrgenciaOptions(urgenciasData);
        setUsuarioOptions(usuariosData);
        setEstadoOtOptions(estadoOtData);
      } catch (error) {
        console.error('Error cargando opciones:', error);
        setOptionsError('No se pudieron cargar las opciones de los filtros. Por favor, intenta de nuevo.');
      }
    };

    fetchOptions();
  }, []);

  const fetchAvisos = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/avisos?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (filters.estadoAviso) url += `&estadoaviso_id=${filters.estadoAviso}`;
      if (filters.urgencia) url += `&urgencia_id=${filters.urgencia}`;
      if (filters.equipoPadre) url += `&equipo_padre_id=${filters.equipoPadre.replace('padre-', '')}`;
      if (filters.plataforma) url += `&ubicacion_id=${filters.plataforma}`;

      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al obtener datos');
      }
      const { data, total } = await res.json();
      setAvisos(data || []);
      setTotal(total || 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvisos();
  }, [page, search, filters]);

  const getLabel = (key: keyof typeof filters, value: string) => {
    let options: Option[] = [];
    if (key === 'plataforma') options = ubicacionOptions;
    if (key === 'equipoPadre') options = equipoOptions;
    if (key === 'estadoAviso') options = estadoAvisoOptions;
    if (key === 'urgencia') options = urgenciaOptions;
    return options.find(opt => opt.value === value)?.label || value;
  };

  const removeFilter = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: '' });
  };

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewForm({ ...newForm, [name]: value });
  };

  const handleAuthorChange = (value: string) => {
    setNewForm(prev => ({ ...prev, autor_id: value ? parseInt(value) : 1 }));
  };

  const handleEquipoChange = (type: 'padre' | 'hijo', value: string) => {
    const [, idStr] = value.split('-');
    const id = idStr ? parseInt(idStr) : null;
    if (type === 'padre') {
      setNewForm({ ...newForm, equipo_padre_id: id });
    } else {
      setNewForm({ ...newForm, equipo_hijo_id: id });
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditEstadoOtChange = (value: string) => {
    setEditForm({ ...editForm, estado_ot_id: value ? parseInt(value, 10) : null });
  };

  const handleSaveEdit = async () => {
    if (!selectedAviso) return;
    try {
      const res = await fetch('/api/avisos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aviso_id: selectedAviso.aviso_id,
          ot_asociada: editForm.ot_asociada,
          estado_ot_id: editForm.estado_ot_id,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      setDetailOpen(false);
      setEditForm({ ot_asociada: '', estado_ot_id: null });
      fetchAvisos();
    } catch (err) {
      alert('Error al actualizar: ' + (err as Error).message);
    }
  };

  const handleSaveNew = async () => {
    if (!newForm.titulo || !newForm.equipo_padre_id || !newForm.equipo_hijo_id || !newForm.autor_id) {
      alert('Título, Autor, Equipo Padre y Equipo Hijo son requeridos');
      return;
    }
    if (newForm.estadoaviso_id === null) {
      alert('El estado es requerido');
      return;
    }
    if (!newForm.paro) {
      newForm.fecha_paro = '';
    }
    try {
      const res = await fetch('/api/avisos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newForm),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      setNewRequestOpen(false);
      setNewForm({
        titulo: '',
        descripcion: '',
        fecha_aviso: '',
        estadoaviso_id: 1,
        paro: false,
        fecha_paro: '',
        autor_id: 1,
        equipo_padre_id: null,
        equipo_hijo_id: null,
        urgencia_id: null,
        ubicacion_id: null,
        impacto_id: null,
        severidad_id: null,
        modo_id: null,
        deteccion_id: null,
        tipo_intervencion_id: null,
        ot_asociada: null,
        estado_ot_id: null,
      });
      fetchAvisos();
    } catch (err) {
      alert('Error: ' + (err as Error).message);
    }
  };

  const handleRejectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRejectionForm({ ...rejectionForm, [name]: value });
  };

  const handleApprove = async (aviso_id: number) => {
    if (!selectedAviso || !selectedAviso.equipo_padre_id || !selectedAviso.equipo_hijo_id) {
      alert('Equipo Padre e Hijo son requeridos para aprobar');
      return;
    }
    try {
      const res = await fetch('/api/avisos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aviso_id, action: 'aprobar' }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      if (selectedAviso) {
        await fetch('/api/aprobaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: selectedAviso.titulo,
            descripcion: selectedAviso.descripcion,
            aviso_id: selectedAviso.aviso_id,
            fecha_aviso: selectedAviso.fecha_aviso,
            autor_id: selectedAviso.autor_id,
            equipo_padre_id: selectedAviso.equipo_padre_id,
            equipo_hijo_id: selectedAviso.equipo_hijo_id,
            urgencia_id: selectedAviso.urgencia_id,
            ubicacion_id: selectedAviso.ubicacion_id,
            paro: selectedAviso.paro,
            fecha_paro: selectedAviso.fecha_paro,
          }),
        });
      }
      fetchAvisos();
      setDetailOpen(false);
    } catch (err) {
      alert('Error al aprobar: ' + (err as Error).message);
    }
  };

  const handleReject = () => {
    setShowRejectionFields(true);
  };

  const handleConfirmReject = async (aviso_id: number) => {
    if (!selectedAviso) return;
    if (!rejectionForm.motivo_rechazo || !rejectionForm.detalle_rechazo) {
      alert('Motivo y detalle de rechazo son requeridos');
      return;
    }
    try {
      const res = await fetch('/api/avisos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aviso_id, action: 'rechazar', ...rejectionForm }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      setShowRejectionFields(false);
      setRejectionForm({ motivo_rechazo: '', detalle_rechazo: '' });
      fetchAvisos();
      setDetailOpen(false);
    } catch (err) {
      alert('Error al rechazar: ' + (err as Error).message);
    }
  };

  const handleCancelReject = () => {
    setShowRejectionFields(false);
    setRejectionForm({ motivo_rechazo: '', detalle_rechazo: '' });
  };

  const formatSolicitudId = (id: number) => `SM-${id.toString().padStart(5, '0')}`;

  const totalPages = Math.ceil(total / limit);

  // Format fecha_paro to show only hours and minutes
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima',
    });
  };

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
          <h1 className="text-xl font-semibold">Avisos de Mantenimiento</h1>
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
        {optionsError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {optionsError}
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={newRequestOpen} onOpenChange={setNewRequestOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Nuevo Aviso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto [&>button.absolute]:hidden">
                <DialogHeader>
                  <DialogTitle>Aviso de Mantenimiento</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input id="titulo" name="titulo" value={newForm.titulo} onChange={handleNewChange} />
                  </div>
                  <div>
                    <Label htmlFor="autor_id">Autor</Label>
                    <Select
                      value={newForm.autor_id.toString()}
                      onValueChange={handleAuthorChange}
                    >
                      <SelectTrigger id="autor_id">
                        <SelectValue placeholder="Selecciona autor" />
                      </SelectTrigger>
                      <SelectContent>
                        {usuarioOptions.length > 0 ? (
                          usuarioOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay autores disponibles</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estadoaviso_id">Estado</Label>
                    <Select
                      value={newForm.estadoaviso_id?.toString() || ''}
                      onValueChange={(value) => setNewForm(prevForm => ({ ...prevForm, estadoaviso_id: value ? parseInt(value) : null }))}
                    >
                      <SelectTrigger id="estadoaviso_id">
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadoAvisoOptions.length > 0 ? (
                          estadoAvisoOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay estados disponibles</SelectItem>
                        )}
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
                        {urgenciaOptions.length > 0 ? (
                          urgenciaOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay urgencias disponibles</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ubicacion_id">Ubicación</Label>
                    <Select
                      value={newForm.ubicacion_id?.toString() || ''}
                      onValueChange={(value) => setNewForm({ ...newForm, ubicacion_id: value ? parseInt(value) : null })}
                    >
                      <SelectTrigger id="ubicacion_id">
                        <SelectValue placeholder="Selecciona ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        {ubicacionOptions.length > 0 ? (
                          ubicacionOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay ubicaciones disponibles</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="equipo_padre_id">Equipo Padre</Label>
                    <Select
                      value={newForm.equipo_padre_id ? `padre-${newForm.equipo_padre_id}` : ''}
                      onValueChange={(value) => handleEquipoChange('padre', value)}
                    >
                      <SelectTrigger id="equipo_padre_id">
                        <SelectValue placeholder="Selecciona equipo padre" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipoOptions.filter(opt => opt.value.startsWith('padre-')).length > 0 ? (
                          equipoOptions.filter(opt => opt.value.startsWith('padre-')).map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay equipos padre disponibles</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="equipo_hijo_id">Equipo Hijo</Label>
                    <Select
                      value={newForm.equipo_hijo_id ? `hijo-${newForm.equipo_hijo_id}` : ''}
                      onValueChange={(value) => handleEquipoChange('hijo', value)}
                    >
                      <SelectTrigger id="equipo_hijo_id">
                        <SelectValue placeholder="Selecciona equipo hijo" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipoOptions.filter(opt => opt.value.startsWith('hijo-')).length > 0 ? (
                          equipoOptions.filter(opt => opt.value.startsWith('hijo-')).map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay equipos hijo disponibles</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ot_asociada">Orden trabajo (OT) asociada</Label>
                    <Input
                      id="ot_asociada"
                      name="ot_asociada"
                      value={newForm.ot_asociada || ''}
                      onChange={handleNewChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado_ot_id">Estado OT asociada</Label>
                    <Select
                      value={newForm.estado_ot_id?.toString() || ''}
                      onValueChange={(value) => setNewForm({ ...newForm, estado_ot_id: value ? parseInt(value) : null })}
                    >
                      <SelectTrigger id="estado_ot_id">
                        <SelectValue placeholder="Selecciona estado OT" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadoOtOptions.length > 0 ? (
                          estadoOtOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay estados OT disponibles</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
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
                      <Input
                        id="fecha-paro"
                        name="fecha_paro"
                        type="datetime-local"
                        value={newForm.fecha_paro ? newForm.fecha_paro.slice(0, 16) : ''} // 👈 cortar a YYYY-MM-DDTHH:mm
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            const date = new Date(value);
                            const localISO = toLocalISOString(date);
                            setNewForm({ ...newForm, fecha_paro: localISO });
                          } else {
                            setNewForm({ ...newForm, fecha_paro: '' });
                          }
                        }}
                        step="60"
                      />
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
                        <SelectValue placeholder="Selecciona plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        {ubicacionOptions.length > 0 ? (
                          ubicacionOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay plataformas disponibles</SelectItem>
                        )}
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
                        {equipoOptions.filter(opt => opt.value.startsWith('padre-')).length > 0 ? (
                          equipoOptions.filter(opt => opt.value.startsWith('padre-')).map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay equipos padre disponibles</SelectItem>
                        )}
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
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estadoAvisoOptions.length > 0 ? (
                          estadoAvisoOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay estados disponibles</SelectItem>
                        )}
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
                        {urgenciaOptions.length > 0 ? (
                          urgenciaOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>No hay urgencias disponibles</SelectItem>
                        )}
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

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <p className="p-4">Cargando...</p>
            ) : error ? (
              <p className="p-4 text-red-500">Error: {error}</p>
            ) : avisos.length === 0 ? (
              <p className="p-4">No hay ninguna solicitud creada.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {avisos.map((aviso) => (
                  <Dialog key={aviso.aviso_id.toString()} open={detailOpen && selectedAviso?.aviso_id === aviso.aviso_id} onOpenChange={setDetailOpen}>
                    <DialogTrigger asChild>
                      <div 
                        className={`p-4 cursor-pointer ${aviso.rechazado ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => {
                          setSelectedAviso(aviso);
                          setEditForm({
                            ot_asociada: aviso.ot_asociada || '',
                            estado_ot_id: aviso.estado_ot_id || null,
                          });
                          setDetailOpen(true);
                          setShowRejectionFields(false);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900 mb-1">{formatSolicitudId(aviso.aviso_id)}</div>
                            <div className="text-sm text-gray-700 mb-1">{aviso.titulo}</div>
                            <div className="text-sm text-gray-500">{aviso.descripcion}</div>
                          </div>
                          <div className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                            Creado: {new Date(aviso.fecha_aviso).toLocaleString('es-ES', { timeZone: 'America/Lima' })}
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto [&>button.absolute]:hidden">
  <DialogHeader>
    <DialogTitle>Detalle de Solicitud de Mantenimiento</DialogTitle>
  </DialogHeader>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
    <div>
      <Label>Título</Label>
      <p>{selectedAviso?.titulo ?? 'N/A'}</p>
    </div>
    <div>
      <Label>ID-Solicitud</Label>
      <p>{selectedAviso ? formatSolicitudId(selectedAviso.aviso_id) : 'N/A'}</p>
    </div>
    <div>
      <Label>Fecha de aviso</Label>
      <p>{selectedAviso ? new Date(selectedAviso.fecha_aviso).toLocaleString('es-ES', { timeZone: 'America/Lima' }) : 'N/A'}</p>
    </div>
    <div>
      <Label>Equipo Padre</Label>
      <p>
        {selectedAviso && selectedAviso.equipo_padre_id != null
          ? equipoOptions.find(opt => opt.value === `padre-${selectedAviso.equipo_padre_id!.toString()}`)?.label ?? 'N/A'
          : 'N/A'}
      </p>
    </div>
    <div>
      <Label>Ubicación</Label>
      <p>
        {selectedAviso && selectedAviso.ubicacion_id != null
          ? ubicacionOptions.find(opt => opt.value === selectedAviso.ubicacion_id!.toString())?.label ?? 'N/A'
          : 'N/A'}
      </p>
    </div>
    <div>
      <Label>Equipo Hijo</Label>
      <p>
        {selectedAviso && selectedAviso.equipo_hijo_id != null
          ? equipoOptions.find(opt => opt.value === `hijo-${selectedAviso.equipo_hijo_id!.toString()}`)?.label ?? 'N/A'
          : 'N/A'}
      </p>
    </div>
    <div>
      <Label>Autor</Label>
      <p>{selectedAviso ? usuarioOptions.find(opt => opt.value === selectedAviso.autor_id.toString())?.label ?? 'N/A' : 'N/A'}</p>
    </div>
    <div>
      <Label>Estado</Label>
      <p>
        {selectedAviso && selectedAviso.estadoaviso_id != null
          ? estadoAvisoOptions.find(opt => opt.value === selectedAviso.estadoaviso_id!.toString())?.label ?? 'N/A'
          : 'N/A'}
      </p>
    </div>
    <div>
  <Label>Orden trabajo (OT) asociada</Label>
  {selectedAviso ? (
    <p>{selectedAviso.ot_asociada ?? 'N/A'}</p> // siempre en modo solo lectura
  ) : (
    <Input
      id="ot_asociada"
      name="ot_asociada"
      value={editForm.ot_asociada || ''}
      onChange={handleEditChange}
      readOnly
    />
  )}
</div>

<div>
  <Label>Estado OT asociada</Label>
  {selectedAviso ? (
    <p>
      {selectedAviso.estado_ot_id != null
        ? estadoOtOptions.find(
            (opt) => opt.value === selectedAviso.estado_ot_id?.toString()
          )?.label ?? 'N/A'
        : 'N/A'}
    </p>
  ) : (
    <Select value={newForm.estado_ot_id?.toString() || ''} open={false}>
      <SelectTrigger id="estado_ot_id" className="pointer-events-none">
        <SelectValue placeholder="Selecciona estado OT" />
      </SelectTrigger>
      <SelectContent>
        {estadoOtOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
</div>

<div>
  <Label>¿Paró?</Label>
  <p>{selectedAviso?.paro ? 'Sí' : 'No'}</p>
</div>

{selectedAviso?.paro && (
  <div>
    <Label>Fecha paro</Label>
    <p>{selectedAviso.fecha_paro ? formatFechaHora(new Date(selectedAviso.fecha_paro)) : 'N/A'}</p>
  </div>
)}
  </div>
  {selectedAviso?.rechazado && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div>
        <Label>Motivo de rechazo</Label>
        <p>{selectedAviso?.motivo_rechazo ?? 'N/A'}</p>
      </div>
      <div className="md:col-span-2">
        <Label>Detalle de rechazo</Label>
        <p>{selectedAviso?.detalle_rechazo ?? 'N/A'}</p>
      </div>
    </div>
  )}
  {!showRejectionFields && !selectedAviso?.rechazado && selectedAviso && (
    <DialogFooter>
      <Button variant="destructive" onClick={handleReject}>
        Rechazar
      </Button>
      <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(selectedAviso.aviso_id)}>
        Aprobar
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveEdit} disabled={selectedAviso && !selectedAviso.rechazado}>
        Guardar Cambios
      </Button>
    </DialogFooter>
  )}
  {showRejectionFields && selectedAviso && (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div>
          <Label htmlFor="motivo_rechazo">Motivo de rechazo (ID o código)</Label>
          <Input id="motivo_rechazo" name="motivo_rechazo" value={rejectionForm.motivo_rechazo} onChange={handleRejectionChange} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="detalle_rechazo">Detalle de rechazo</Label>
          <Textarea id="detalle_rechazo" name="detalle_rechazo" value={rejectionForm.detalle_rechazo} onChange={handleRejectionChange} />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={handleCancelReject}>
          Cancelar
        </Button>
        <Button className="bg-red-600 hover:bg-red-700" onClick={() => handleConfirmReject(selectedAviso.aviso_id)}>
          Confirmar Rechazo
        </Button>
      </DialogFooter>
    </>
  )}
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