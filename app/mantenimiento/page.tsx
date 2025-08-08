import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MantenimientoPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Módulo de Mantenimiento</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gestiona las solicitudes de mantenimiento</p>
            <Link href="/mantenimiento/solicitudes">
              <Button className="w-full">Ver Solicitudes</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Órdenes de Trabajo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Administra las órdenes de trabajo</p>
            <Link href="/mantenimiento/ordenes">
              <Button className="w-full" variant="outline">Próximamente</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reportes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Genera reportes de mantenimiento</p>
            <Link href="/mantenimiento/reportes">
              <Button className="w-full" variant="outline">Próximamente</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
