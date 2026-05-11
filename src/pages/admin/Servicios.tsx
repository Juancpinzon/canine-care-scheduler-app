import { useState } from 'react'
import { Plus, Edit2, Trash2, Scissors, Loader2 } from 'lucide-react'
import { 
  useServices, 
  useCreateService, 
  useUpdateService, 
  useDeleteService 
} from '@/hooks/useServices'
import { toast } from 'sonner'
import ServiceModal from '@/components/admin/ServiceModal'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Service } from '@/types'

export default function Servicios() {
  const { data: services, isLoading } = useServices(true) // includeInactive = true
  const createMutation = useCreateService()
  const updateMutation = useUpdateService()
  const deleteMutation = useDeleteService()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  const handleOpenModal = (service: Service | null = null) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedService(null)
    setIsModalOpen(false)
  }

  const handleSaveService = async (values: any) => {
    try {
      if (selectedService) {
        await updateMutation.mutateAsync({ id: selectedService.id, ...values })
        toast.success('Servicio actualizado con éxito')
      } else {
        await createMutation.mutateAsync(values)
        toast.success('Servicio creado con éxito')
      }
      handleCloseModal()
    } catch (error: any) {
      toast.error(`Error: ${error.message || 'No se pudo guardar el servicio'}`)
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      await updateMutation.mutateAsync({ id: service.id, is_active: !service.is_active })
      toast.success(`Servicio ${!service.is_active ? 'activado' : 'desactivado'}`)
    } catch (error: any) {
      toast.error('Error al cambiar el estado')
    }
  }

  const handleDeleteService = async () => {
    if (!serviceToDelete) return
    try {
      await deleteMutation.mutateAsync(serviceToDelete)
      toast.success('Servicio eliminado con éxito')
      setServiceToDelete(null)
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar el servicio')
      setServiceToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C9A84C]" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-['Cormorant_Garamond'] text-[#C9A84C] tracking-wide mb-1">
            Gestión de Servicios
          </h1>
          <p className="text-white/40 text-sm">
            Configura los precios, duraciones y disponibilidad de los servicios.
          </p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          className="bg-[#C9A84C] hover:bg-[#D4B96A] text-black font-medium h-11 px-6 gap-2"
        >
          <Plus size={18} />
          Nuevo Servicio
        </Button>
      </header>

      <div className="bg-[#0C0C0C] border border-white/5 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/40 uppercase text-[10px] tracking-widest py-4">Servicio</TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] tracking-widest py-4">Duración</TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] tracking-widest py-4">Precios (XS / S / M / L / XL / XXL)</TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] tracking-widest py-4 text-center">Estado</TableHead>
              <TableHead className="text-white/40 uppercase text-[10px] tracking-widest py-4 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.length === 0 ? (
              <TableRow className="border-white/5">
                <TableCell colSpan={5} className="text-center py-12 text-white/20">
                  No hay servicios configurados.
                </TableCell>
              </TableRow>
            ) : (
              services?.map((service) => (
                <TableRow key={service.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]">
                        <Scissors size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-[#F0EDE8]">{service.name}</p>
                        {service.description && (
                          <p className="text-xs text-white/30 truncate max-w-[200px]">{service.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/60 text-sm font-mono">
                    {service.duration_minutes} min
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-[#C9A84C]">${service.price_xs}</span>
                      <span className="text-white/20">/</span>
                      <span className="text-white/70">${service.price_small}</span>
                      <span className="text-white/20">/</span>
                      <span className="text-white/70">${service.price_medium}</span>
                      <span className="text-white/20">/</span>
                      <span className="text-white/70">${service.price_large}</span>
                      <span className="text-white/20">/</span>
                      <span className="text-white/70">${service.price_xl}</span>
                      <span className="text-white/20">/</span>
                      <span className="text-white/70">${service.price_xxl}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Switch 
                        checked={service.is_active} 
                        onCheckedChange={() => handleToggleActive(service)}
                        className="data-[state=checked]:bg-[#C9A84C]"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenModal(service)}
                        className="w-8 h-8 text-white/40 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setServiceToDelete(service.id)}
                        className="w-8 h-8 text-white/40 hover:text-red-400 hover:bg-red-400/10"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
        onSave={handleSaveService}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent className="bg-[#0C0C0C] border-white/10 text-[#F0EDE8]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#C9A84C]">¿Estás segura?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Esta acción no se puede deshacer. El servicio se eliminará permanentemente del catálogo.
              Si el servicio tiene citas registradas, no podrás eliminarlo por integridad de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteService}
              className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
            >
              Confirmar Eliminación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
