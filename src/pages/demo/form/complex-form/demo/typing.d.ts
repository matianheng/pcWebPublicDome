import { LsyDynFormData } from '@/components/lsy/dyn-form/typing'
export interface CustomFormData extends LsyDynFormData {
  name: string
  isChina: boolean
  politicsStatus?: number
  male: number
  role?: string
}
