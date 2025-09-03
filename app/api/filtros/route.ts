import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type) {
    return NextResponse.json({ error: 'El parámetro "type" es requerido' }, { status: 400 });
  }

  try {
    let data: { value: string; label: string }[] = [];

    switch (type) {
      case 'ubicaciones':
        const { data: ubicacionesData, error: ubicacionesError } = await supabase
          .from('ubicaciones')
          .select('ubicacion_id, nombre');
        if (ubicacionesError) throw new Error(`Error al cargar ubicaciones: ${ubicacionesError.message}`);
        data = (ubicacionesData || []).filter(item => item.ubicacion_id).map(item => ({
          value: item.ubicacion_id.toString(),
          label: item.nombre || 'Sin nombre',
        }));
        break;

      case 'equipos':
        const { data: padres, error: errorPadres } = await supabase
          .from('equipos_padre')
          .select('equipo_padre_id, nombre');
        const { data: hijos, error: errorHijos } = await supabase
          .from('equipos_hijo')
          .select('equipo_hijo_id, nombre');
        if (errorPadres) throw new Error(`Error al cargar equipos padre: ${errorPadres.message}`);
        if (errorHijos) throw new Error(`Error al cargar equipos hijo: ${errorHijos.message}`);
        data = [
          ...(padres || []).map(item => ({
            value: `padre-${item.equipo_padre_id.toString()}`,
            label: item.nombre || 'Sin nombre',
          })),
          ...(hijos || []).map(item => ({
            value: `hijo-${item.equipo_hijo_id.toString()}`,
            label: item.nombre || 'Sin nombre',
          })),
        ];
        break;

      case 'estados':
        const { data: estadosData, error: estadosError } = await supabase
          .from('estado')
          .select('estado_id, label');
        if (estadosError) throw new Error(`Error al cargar estados: ${estadosError.message}`);
        data = (estadosData || []).filter(item => item.estado_id).map(item => ({
          value: item.estado_id.toString(),
          label: item.label || 'Sin valor',
        }));
        break;

      case 'estados_ot':
        const { data: estadosOtData, error: estadosOtError } = await supabase
          .from('estado')
          .select('estado_id, label');
        if (estadosOtError) throw new Error(`Error al cargar estados OT: ${estadosOtError.message}`);
        data = (estadosOtData || [])
          .filter(item => item.estado_id) // solo filas válidas
          .map(item => ({
            value: item.estado_id ? item.estado_id.toString() : `temp-${Math.random()}`, // fallback seguro
            label: item.label && item.label.trim() !== '' ? item.label : 'Sin valor',
          }));
        break;

      case 'urgencias':
        const { data: urgenciasData, error: urgenciasError } = await supabase
          .from('urgencia')
          .select('urgencia_id, label');
        if (urgenciasError) throw new Error(`Error al cargar urgencias: ${urgenciasError.message}`);
        data = (urgenciasData || []).filter(item => item.urgencia_id).map(item => ({
          value: item.urgencia_id.toString(),
          label: item.label || 'Sin valor',
        }));
        break;

      case 'usuarios':
        const { data: usuariosData, error: usuariosError } = await supabase
          .from('usuarios')
          .select('usuario_id, nombre');
        if (usuariosError) throw new Error(`Error al cargar usuarios: ${usuariosError.message}`);
        data = (usuariosData || []).filter(item => item.usuario_id).map(item => ({
          value: item.usuario_id.toString(),
          label: item.nombre || 'Sin nombre',
        }));
        break;

      default:
        return NextResponse.json({ error: `Tipo de filtro no válido: ${type}` }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(`Error fetching ${type}:`, err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}