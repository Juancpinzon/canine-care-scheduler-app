import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { Service } from '@/types'

const serviceSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().nullable().optional(),
  duration_minutes: z.coerce.number().min(1, 'La duración debe ser mayor a 0'),
  price_xs: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  price_small: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  price_medium: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  price_large: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  price_xl: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  price_xxl: z.coerce.number().min(1, 'El precio debe ser mayor a 0'),
  is_active: z.boolean().default(true),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

interface Props {
  isOpen: boolean
  onClose: () => void
  service?: Service | null
  onSave: (values: ServiceFormValues) => Promise<void>
  isSaving: boolean
}

export default function ServiceModal({ isOpen, onClose, service, onSave, isSaving }: Props) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      duration_minutes: 60,
      price_xs: 0,
      price_small: 0,
      price_medium: 0,
      price_large: 0,
      price_xl: 0,
      price_xxl: 0,
      is_active: true,
    },
  })

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description || '',
        duration_minutes: service.duration_minutes,
        price_xs: service.price_xs || 0,
        price_small: service.price_small || 0,
        price_medium: service.price_medium || 0,
        price_large: service.price_large || 0,
        price_xl: service.price_xl || 0,
        price_xxl: service.price_xxl || 0,
        is_active: service.is_active,
      })
    } else {
      form.reset({
        name: '',
        description: '',
        duration_minutes: 60,
        price_xs: 0,
        price_small: 0,
        price_medium: 0,
        price_large: 0,
        price_xl: 0,
        price_xxl: 0,
        is_active: true,
      })
    }
  }, [service, form, isOpen])

  const handleSubmit = async (values: ServiceFormValues) => {
    await onSave(values)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-[#0C0C0C] border-white/10 text-[#F0EDE8] max-h-[90vh] overflow-y-auto q4-scrollbar">
        <DialogHeader>
          <DialogTitle className="font-['Cormorant_Garamond'] text-2xl text-[#C9A84C] tracking-wide">
            {service ? 'Editar Servicio' : 'Nuevo Servicio'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 md:col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-xs uppercase tracking-widest">Nombre del Servicio</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/40 border-white/10 focus:border-[#C9A84C]/50 h-11" placeholder="Ej. Full Groom" />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-xs uppercase tracking-widest">Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ''}
                          className="bg-black/40 border-white/10 focus:border-[#C9A84C]/50 min-h-[80px]" 
                          placeholder="Breve descripción del servicio..." 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 text-xs uppercase tracking-widest">Duración (minutos)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-black/40 border-white/10 focus:border-[#C9A84C]/50 h-11" />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-3 bg-black/20">
                    <div className="space-y-0.5">
                      <FormLabel className="text-white/60 text-xs uppercase tracking-widest">Estado Activo</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#C9A84C]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 border-t border-white/5">
              <h3 className="text-[#C9A84C] font-['Cormorant_Garamond'] text-lg mb-4 tracking-wide">Precios por Tamaño (USD)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: 'price_xs', label: 'XS' },
                  { name: 'price_small', label: 'S (Pequeño)' },
                  { name: 'price_medium', label: 'M (Mediano)' },
                  { name: 'price_large', label: 'L (Grande)' },
                  { name: 'price_xl', label: 'XL' },
                  { name: 'price_xxl', label: 'XXL' },
                ].map((size) => (
                  <FormField
                    key={size.name}
                    control={form.control}
                    name={size.name as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/40 text-[10px] uppercase tracking-tighter">{size.label}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">$</span>
                            <Input 
                              type="number" 
                              {...field} 
                              className="bg-black/40 border-white/10 focus:border-[#C9A84C]/50 h-10 pl-7 text-sm" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-[10px]" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/10 text-white/60 hover:bg-white/5 hover:text-white h-11 px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#C9A84C] hover:bg-[#D4B96A] text-black font-medium h-11 px-8 min-w-[140px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Servicio'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
