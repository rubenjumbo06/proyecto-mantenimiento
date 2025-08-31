import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    let body = await request.json();
    // Validación básica: campos requeridos
    if (!body.titulo) {
      return NextResponse.json({ error: 'El título es requerido' }, { status: 400 });
    }
    // Limpia campos ID: '' -> null y asegura number
    const idFields = ['estado_id', 'urgencia_id', 'impacto_id', 'severidad_id', 'modo_id', 'deteccion_id', 'tipo_intervencion_id', 'equipo_padre_id', 'equipo_hijo_id', 'autor_id'];
    idFields.forEach(field => {
      if (body[field] === '' || body[field] === undefined) body[field] = null;
      else if (body[field] !== null) body[field] = parseInt(body[field]);
    });
    // Genera código único si no se proporciona
    if (!body.codigo) {
      const { data: last } = await supabase.from('solicitudes').select('codigo').order('solicitud_id', { ascending: false }).limit(1);
      const nextNum = last?.[0] ? parseInt(last[0].codigo.split('-')[1]) + 1 : 1;
      body.codigo = `SM-${nextNum.toString().padStart(5, '0')}`;
    }
    const { data, error } = await supabase.from('solicitudes').insert([body]).select();
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
    
    // Construye la query base
    let query = supabase.from('solicitudes').select('*').order('fecha_aviso', { ascending: false });
    
    // Duplica para count (aplica mismos filtros)
    let countQuery = supabase.from('solicitudes').select('count(*)', { count: 'exact', head: true });

    // Filtros basados en query params
    const filters = ['estado_id', 'urgencia_id', 'impacto_id', 'severidad_id', 'modo_id', 'deteccion_id', 'tipo_intervencion_id', 'paro'];
    filters.forEach((field) => {
      const value = searchParams.get(field);
      if (value) {
        query = query.eq(field, value);
        countQuery = countQuery.eq(field, value);
      }
    });

    // Búsqueda por texto
    const search = searchParams.get('search');
    if (search) {
      query = query.or(`titulo.ilike.%${search}%,descripcion.ilike.%${search}%`);
      countQuery = countQuery.or(`titulo.ilike.%${search}%,descripcion.ilike.%${search}%`);
    }

    // Paginación
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Ejecuta count con filtros
    const { count } = await countQuery;
    const total = count || 0;

    const { data, error } = await query;
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ data, total, page, limit }, { status: 200 });
  } catch (err) {
    console.error('Server error in GET:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}