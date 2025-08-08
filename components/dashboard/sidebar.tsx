"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Users,
  ShoppingCart,
  Package,
  FileText,
  BarChart3,
  Settings,
  Bell,
  X,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      badge: null,
      href: "/dashboard",
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      badge: { label: "12", variant: "secondary" as const },
      href: "/customers",
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingCart,
      badge: { label: "5", variant: "destructive" as const },
      href: "/orders",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      badge: { label: "New", variant: "default" as const },
      href: "/products",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      badge: null,
      href: "/reports",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: { label: "3", variant: "outline" as const },
      href: "/analytics",
    },
    {
      id: "mantenimiento",
      label: "Mantenimiento",
      icon: Wrench, // importar de lucide-react
      badge: { label: "New", variant: "default" as const },
      href: "/mantenimiento/solicitudes",
    },
  ];

  const bottomMenuItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: { label: "8", variant: "destructive" as const },
      href: "/notifications",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
      href: "/settings",
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
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Dashboard</h1>
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
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeItem === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between text-left h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base",
                    activeItem === item.id && "bg-gray-100"
                  )}
                  onClick={() => setActiveItem(item.id)}
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
              ))}
            </nav>

            <Separator className="my-6" />

            <nav className="space-y-2">
              {bottomMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeItem === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between text-left h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base",
                    activeItem === item.id && "bg-gray-100"
                  )}
                  onClick={() => setActiveItem(item.id)}
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
              ))}
            </nav>
          </ScrollArea>

          {/* User Profile */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-7 sm:w-8 h-7 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm font-medium text-gray-700">JD</span>
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Pro
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}