// app/api/login/route.ts
export const runtime = 'nodejs'; // evita Edge (necesario para bcryptjs)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    // 1) Buscar usuario por email
    const { data: user, error: userErr } = await supabase
      .from('usuarios')
      .select('usuario_id, nombre, email, rol_id, nivel_id, passwordhash')
      .eq('email', email)
      .maybeSingle();

    if (userErr) {
      console.error('Supabase error:', userErr);
      return NextResponse.json({ error: 'Error consultando usuario' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }

    // 2) Validar contraseña con bcrypt
    const hash = user.passwordhash || '';
    const ok = await bcrypt.compare(password, hash);
    if (!ok) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 3) (Opcional) Traer nombre del nivel
    let nivelNombre: string | null = null;
    if (user.nivel_id) {
      const { data: nivel } = await supabase
        .from('NivelesAcceso')
        .select('Nombre')
        .eq('Nivel_ID', user.nivel_id)
        .maybeSingle();
      nivelNombre = nivel?.Nombre ?? null;
    }

    // Respuesta mínima útil para tu frontend
    return NextResponse.json({
      id: user.usuario_id,
      nombre: user.nombre,
      email: user.email,
      rol_id: user.rol_id,
      nivel_id: user.nivel_id,
      nivel: nivelNombre, // 'Superadmin' | 'Admin' | null
    });
  } catch (err: any) {
    console.error('Login server error:', err);
    return NextResponse.json({ error: err.message ?? 'Error en el servidor' }, { status: 500 });
  }
}

