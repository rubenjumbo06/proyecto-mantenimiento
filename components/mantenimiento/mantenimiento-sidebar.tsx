"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Home, FileText, CheckCircle, ClipboardList, FolderOpen, XCircle, X, ChevronRight, Wrench } from 'lucide-react';
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MantenimientoSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MantenimientoSidebar({ open, setOpen }: MantenimientoSidebarProps) {
  const pathname = usePathname();
  
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      badge: null,
      href: "/dashboard",
    },
    {
      id: "avisos",
      label: "Avisos",
      icon: FileText,
      badge: { label: "48", variant: "secondary" as const },
      href: "/mantenimiento/solicitudes",
    },
    {
      id: "aprobaciones",
      label: "Aprobaciones",
      icon: CheckCircle,
      badge: { label: "58", variant: "default" as const },
      href: "/mantenimiento/aprobaciones",
    },
    {
      id: "ordenes",
      label: "Órdenes",
      icon: ClipboardList,
      badge: { label: "75", variant: "outline" as const },
      href: "/mantenimiento/ordenes",
    },
    {
      id: "documentos",
      label: "Documentos",
      icon: FolderOpen,
      badge: { label: "82", variant: "secondary" as const },
      href: "/mantenimiento/documentos",
    },
    {
      id: "cierre",
      label: "Cierre",
      icon: XCircle,
      badge: { label: "110", variant: "destructive" as const },
      href: "/mantenimiento/cierre",
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">ViGO</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 sm:px-4 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-between text-left h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base",
                        isActive && "bg-gray-100"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-2 sm:mr-3 h-4 sm:h-5 w-4 sm:w-5 text-gray-500" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <Badge variant={item.badge.variant} className="text-xs">
                            {item.badge.label}
                          </Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User Profile */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <Wrench className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Mantenimiento</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
