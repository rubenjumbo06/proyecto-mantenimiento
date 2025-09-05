import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const validFields = [
  'titulo', 'aviso_id', 'fecha_aviso', 'urgencia_id', 'autor_id', 'ubicacion_id',
  'equipo_padre_id', 'equipo_hijo_id', 'descripcion', 'descripcion_modo', 'descripcion_metodo',
  'documento_adjunto', 'duracion', 'impacto_id', 'severidad_id', 'modo_id',
  'deteccion_id', 'tipointervencion_id', 'especialidad_id', 'contratista_id',
  'cantidad_personas_asignadas', 'codigo_clase', 'prioridad_ejecucion',
  'fecha_creacion', 'usuario_id'
];

function toLocalISOString(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 19);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.titulo || !body.aviso_id || !body.autor_id || !body.equipo_padre_id || !body.equipo_hijo_id) {
      return NextResponse.json({ error: 'Campos requeridos faltantes: título, aviso_id, autor_id, equipo_padre_id, equipo_hijo_id' }, { status: 400 });
    }

    // Verificar si ya existe una solicitud aprobada para el aviso
    const { data: existingSolicitud } = await supabase
      .from('solicitudes_aprobadas')
      .select('solicitudaprobada_id')
      .eq('aviso_id', body.aviso_id)
      .single();

    if (existingSolicitud) {
      return NextResponse.json({ error: 'Ya existe una solicitud aprobada para este aviso' }, { status: 400 });
    }

    // Validar y formatear fechas
    const fechaAviso = body.fecha_aviso
      ? new Date(body.fecha_aviso).toISOString().slice(0, 19)
      : toLocalISOString(new Date());

    if (body.fecha_aviso && isNaN(new Date(body.fecha_aviso).getTime())) {
      return NextResponse.json({ error: 'Formato de fecha_aviso inválido' }, { status: 400 });
    }

    const idFields = [
      'aviso_id', 'autor_id', 'urgencia_id', 'ubicacion_id', 'equipo_padre_id', 'equipo_hijo_id',
      'impacto_id', 'severidad_id', 'modo_id', 'deteccion_id', 'tipointervencion_id',
      'especialidad_id', 'contratista_id', 'cantidad_personas_asignadas', 'usuario_id'
    ];
    idFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null) {
        const parsedValue = parseInt(String(body[field]), 10);
        if (isNaN(parsedValue)) {
          throw new Error(`Campo ${field} debe ser un número válido`);
        }
        body[field] = parsedValue;
      } else {
        body[field] = null;
      }
    });

    const filteredBody: Partial<Aprobacion> = {};
    validFields.forEach(field => {
      if (body.hasOwnProperty(field)) {
        filteredBody[field as keyof Aprobacion] = body[field];
      }
    });

    // Ajustar el payload para omitir columnas no existentes
    filteredBody.fecha_aviso = fechaAviso;
    filteredBody.fecha_creacion = toLocalISOString(new Date());
    filteredBody.descripcion_modo = filteredBody.descripcion_modo || '';
    filteredBody.descripcion_metodo = filteredBody.descripcion_metodo || '';
    filteredBody.duracion = filteredBody.duracion || '0 hours';
    filteredBody.codigo_clase = filteredBody.codigo_clase || '';

    // Omitir documento_adjunto y prioridad_ejecucion si no están definidos
    if (!body.documento_adjunto) {
      delete filteredBody.documento_adjunto;
    }
    if (!body.prioridad_ejecucion) {
      delete filteredBody.prioridad_ejecucion;
    }

    console.log('Datos enviados a Solicitudes_Aprobadas:', filteredBody);

    const { data, error } = await supabase
      .from('solicitudes_aprobadas')
      .insert([filteredBody])
      .select('solicitudaprobada_id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Server error in POST:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let query = supabase.from('solicitudes_aprobadas').select(`
      solicitudaprobada_id,
      titulo,
      aviso_id,
      fecha_aviso,
      urgencia_id,
      autor_id,
      ubicacion_id,
      equipo_padre_id,
      equipo_hijo_id,
      descripcion,
      descripcion_modo,
      descripcion_metodo,
      duracion,
      impacto_id,
      severidad_id,
      modo_id,
      deteccion_id,
      tipointervencion_id,
      especialidad_id,
      contratista_id,
      cantidad_personas_asignadas,
      codigo_clase,
      fecha_creacion,
      usuario_id
    `).order('fecha_aviso', { ascending: false });
    let countQuery = supabase.from('solicitudes_aprobadas').select('count(*)', { count: 'exact', head: true });

    const filters = ['urgencia_id', 'equipo_padre_id', 'ubicacion_id'];

    filters.forEach((field) => {
      const value = searchParams.get(field);
      if (value !== null && value !== undefined) {
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue)) {
          query = query.eq(field, parsedValue);
          countQuery = countQuery.eq(field, parsedValue);
        }
      }
    });

    const search = searchParams.get('search');
    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descripcion.ilike.%${search}%`);
      countQuery = countQuery.or(`titulo.ilike.%${search}%,descripcion.ilike.%${search}%`);
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { count } = await countQuery;
    const total = count || 0;

    const { data, error } = await query;
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data: data || [], total, page, limit });
  } catch (err) {
    console.error('Server error in GET:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { solicitudaprobada_id, ...updates } = body;

    if (!solicitudaprobada_id) {
      return NextResponse.json({ error: 'solicitudaprobada_id es requerido' }, { status: 400 });
    }

    // Validate required fields
    if (!updates.titulo || !updates.aviso_id || !updates.autor_id || !updates.equipo_padre_id || !updates.equipo_hijo_id) {
      return NextResponse.json({ error: 'Campos requeridos faltantes: título, aviso_id, autor_id, equipo_padre_id, equipo_hijo_id' }, { status: 400 });
    }

    // Validate and format date
    if (updates.fecha_aviso) {
      const fechaAviso = new Date(updates.fecha_aviso);
      if (isNaN(fechaAviso.getTime())) {
        return NextResponse.json({ error: 'Formato de fecha_aviso inválido' }, { status: 400 });
      }
      updates.fecha_aviso = fechaAviso.toISOString().slice(0, 19);
    }

    // Validate numeric fields
    const idFields = [
      'aviso_id', 'autor_id', 'urgencia_id', 'ubicacion_id', 'equipo_padre_id', 'equipo_hijo_id',
      'impacto_id', 'severidad_id', 'modo_id', 'deteccion_id', 'tipointervencion_id',
      'especialidad_id', 'contratista_id', 'cantidad_personas_asignadas', 'usuario_id'
    ];
    idFields.forEach(field => {
      if (updates[field] !== undefined && updates[field] !== null) {
        const parsedValue = parseInt(String(updates[field]), 10);
        if (isNaN(parsedValue)) {
          throw new Error(`Campo ${field} debe ser un número válido`);
        }
        updates[field] = parsedValue;
      }
    });

    // Filter valid fields
    const filteredUpdates: Partial<Aprobacion> = {};
    validFields.forEach(field => {
      if (updates.hasOwnProperty(field)) {
        filteredUpdates[field as keyof Aprobacion] = updates[field];
      }
    });

    // Set default values for optional fields
    filteredUpdates.descripcion_modo = filteredUpdates.descripcion_modo || '';
    filteredUpdates.descripcion_metodo = filteredUpdates.descripcion_metodo || '';
    filteredUpdates.duracion = filteredUpdates.duracion || '0 hours';
    filteredUpdates.codigo_clase = filteredUpdates.codigo_clase || '';

    // Omit undefined fields
    if (!updates.documento_adjunto) {
      delete filteredUpdates.documento_adjunto;
    }
    if (!updates.prioridad_ejecucion) {
      delete filteredUpdates.prioridad_ejecucion;
    }

    console.log('Datos enviados para actualizar en Solicitudes_Aprobadas:', filteredUpdates);

    const { data, error } = await supabase
      .from('solicitudes_aprobadas')
      .update(filteredUpdates)
      .eq('solicitudaprobada_id', solicitudaprobada_id)
      .select('solicitudaprobada_id')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('Server error in PATCH:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}