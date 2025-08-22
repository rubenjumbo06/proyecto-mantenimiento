"use client";

import { MantenimientoSidebar } from "@/components/mantenimiento/mantenimiento-sidebar";
// CORRECCIÓN AQUÍ: Se quitaron las llaves {} para importar el componente por defecto.
import DocumentosContent from "@/components/mantenimiento/documento-content";
import { useState } from "react";

export default function OrdenesPage() { // Renombrado para mayor claridad
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <MantenimientoSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DocumentosContent setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  );
}