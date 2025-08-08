"use client";

import { Search, RotateCcw, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MantenimientoSidebar } from "@/components/mantenimiento/mantenimiento-sidebar";
import { SolicitudesContent } from "@/components/mantenimiento/solicitudes-content";
import { useState } from "react";

export default function SolicitudesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <MantenimientoSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SolicitudesContent setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  )
}
