import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Aviso {
  aviso_id: number;
  titulo: string;
  descripcion: string;
  fecha_aviso: string;
  estadoaviso_id: number | null;
  rechazado: boolean;
  fecha_rechazo: string | null;
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const validFields = [
  'titulo', 'descripcion', 'fecha_aviso', 'estadoaviso_id', 'rechazado',
  'equipo_padre_id', 'equipo_hijo_id', 'autor_id', 'ubicacion_id',
  'urgencia_id', 'motivo_rechazo', 'detalle_rechazo', 'ot_asociada', 'estado_ot_id',
  'paro', 'fecha_paro'
];

function toLocalISOString(date: Date) {
  const offset = date.getTimezoneOffset(); // en minutos
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 19); // YYYY-MM-DDTHH:mm:ss
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.titulo || !body.autor_id || !body.equipo_padre_id || !body.equipo_hijo_id) {
      return NextResponse.json({ error: 'Campos requeridos faltantes: título, autor_id, equipo_padre_id, equipo_hijo_id' }, { status: 400 });
    }

    if (!body.fecha_aviso) {
      body.fecha_aviso = toLocalISOString(new Date());
    }

    body.paro = !!body.paro;
    if (!body.paro || body.fecha_paro === '') {
      body.fecha_paro = null;
    }

    const idFields = ['autor_id', 'estadoaviso_id', 'urgencia_id', 'ubicacion_id', 'equipo_padre_id', 'equipo_hijo_id', 'estado_ot_id'];
    idFields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null && body[field] !== '') {
        const parsedValue = parseInt(String(body[field]), 10);
        if (isNaN(parsedValue)) {
          throw new Error(`Campo ${field} debe ser un número válido`);
        }
        body[field] = parsedValue;
      } else {
        body[field] = null;
      }
    });

    const filteredBody: Partial<Aviso> = {};
    validFields.forEach(field => {
      if (body.hasOwnProperty(field)) {
        filteredBody[field as keyof Aviso] = body[field];
      }
    });

    const { data, error } = await supabase.from('avisos').insert([filteredBody]).select();
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
    let query = supabase.from('avisos').select(`
      aviso_id,
      titulo,
      descripcion,
      fecha_aviso,
      estadoaviso_id,
      rechazado,
      equipo_padre_id,
      equipo_hijo_id,
      autor_id,
      ubicacion_id,
      urgencia_id,
      motivo_rechazo,
      detalle_rechazo,
      ot_asociada,
      estado_ot_id,
      paro,
      fecha_paro
    `).order('fecha_aviso', { ascending: false });
    let countQuery = supabase.from('avisos').select('count(*)', { count: 'exact', head: true });

    const filters = ['estadoaviso_id', 'urgencia_id', 'equipo_padre_id', 'ubicacion_id', 'rechazado'];

    filters.forEach((field) => {
      const value = searchParams.get(field);
      if (value !== null && value !== undefined) {
        if (field === 'rechazado') {
          query = query.eq(field, value === 'true');
          countQuery = countQuery.eq(field, value === 'true');
        } else {
          const parsedValue = parseInt(value, 10);
          if (!isNaN(parsedValue)) {
            query = query.eq(field, parsedValue);
            countQuery = countQuery.eq(field, parsedValue);
          }
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
    const { aviso_id, action, motivo_rechazo, detalle_rechazo, ot_asociada, estado_ot_id } = body;

    if (!aviso_id) {
      return NextResponse.json({ error: 'ID de aviso es requerido' }, { status: 400 });
    }

    const updates: Partial<Aviso> = {};
    if (action === 'aprobar') {
      updates.rechazado = false;
      updates.motivo_rechazo = null;
      updates.detalle_rechazo = null;
    } else if (action === 'rechazar') {
      if (!motivo_rechazo || !detalle_rechazo) {
        return NextResponse.json({ error: 'Motivo y detalle de rechazo son requeridos' }, { status: 400 });
      }
      updates.rechazado = true;
      updates.motivo_rechazo = motivo_rechazo;
      updates.detalle_rechazo = detalle_rechazo;
      updates.fecha_rechazo = new Date().toISOString(); // 👈 guarda fecha + hora exacta
    }
    if (ot_asociada !== undefined) {
      updates.ot_asociada = ot_asociada === '' ? null : ot_asociada;
    }
    if (estado_ot_id !== undefined) {
      if (estado_ot_id === null || estado_ot_id === '') {
        updates.estado_ot_id = null;
      } else {
        const parsedEstado = parseInt(String(estado_ot_id), 10);
        if (isNaN(parsedEstado)) {
          throw new Error('estado_ot_id debe ser un número válido o null');
        }
        updates.estado_ot_id = parsedEstado;
      }
    }

    const { data, error } = await supabase
      .from('avisos')
      .update(updates)
      .eq('aviso_id', aviso_id)
      .select();

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