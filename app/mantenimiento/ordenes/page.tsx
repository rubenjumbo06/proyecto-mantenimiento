"use client";

import { MantenimientoSidebar } from "@/components/mantenimiento/mantenimiento-sidebar";
// CORRECCIÓN AQUÍ: Se quitaron las llaves {} para importar el componente por defecto.
import OrdenesContent from "@/components/mantenimiento/ordenes-content";
import { useState } from "react";

export default function OrdenesPage() { // Renombrado para mayor claridad
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <MantenimientoSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <OrdenesContent setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  );
}