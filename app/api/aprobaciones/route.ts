
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const validFields = [
  'titulo', 'aviso_id', 'fecha_aviso', 'urgencia_id', 'autor_id', 'ubicacion_id',
  'equipo_padre_id', 'equipo_hijo_id', 'descripcion', 'descripcion_modo', 'descripcion_metodo',
  'documento_adjunto', 'duracion', 'equipo_paro', 'equipo_paro_fechahora', 'impacto_id',
  'severidad_id', 'modo_id', 'deteccion_id', 'tipointervencion_id', 'especialidad_id',
  'contratista_id', 'cantidad_personas_asignadas', 'codigo_clase', 'prioridad_ejecucion',
  'fecha_creacion', 'usuario_id'
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.titulo || !body.aviso_id || !body.autor_id || !body.equipo_padre_id || !body.equipo_hijo_id) {
      return NextResponse.json({ error: 'Campos requeridos faltantes: título, aviso_id, autor_id, equipo_padre_id, equipo_hijo_id' }, { status: 400 });
    }

    const idFields = [
      'aviso_id', 'autor_id', 'urgencia_id', 'ubicacion_id', 'equipo_padre_id', 'equipo_hijo_id',
      'impacto_id', 'severidad_id', 'modo_id', 'deteccion_id', 'tipointervencion_id',
      'especialidad_id', 'contratista_id', 'cantidad_personas_asignadas', 'usuario_id'
    ];
    idFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null) {
        body[field] = parseInt(String(body[field]), 10);
        if (isNaN(body[field])) {
          throw new Error(`Campo ${field} debe ser un número válido`);
        }
      } else if (body[field] === null) {
        body[field] = null;
      }
    });

    const filteredBody: Partial<Aprobacion> = {};
    validFields.forEach(field => {
      if (body.hasOwnProperty(field)) {
        filteredBody[field as keyof Aprobacion] = body[field];
      }
    });

    const { data, error } = await supabase.from('solicitudes_aprobadas').insert([filteredBody]).select();
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
      id,
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
      documento_adjunto,
      duracion,
      equipo_paro,
      equipo_paro_fechahora,
      impacto_id,
      severidad_id,
      modo_id,
      deteccion_id,
      tipointervencion_id,
      especialidad_id,
      contratista_id,
      cantidad_personas_asignadas,
      codigo_clase,
      prioridad_ejecucion,
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
