"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { MantenimientoSidebar } from "@/components/mantenimiento/mantenimiento-sidebar";
import { DashboardContent } from "@/components/dashboard/dashboard1sh-content";
import { VigoDashboard } from "@/components/dashboard/dashboard1ec-content";
import { useState } from "react";


export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <MantenimientoSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <VigoDashboard setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  );
}