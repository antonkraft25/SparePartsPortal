import { Sparepart } from "./sparepart"

export type Product = {
    id: string
    name: string
    spareparts?: Sparepart[]
}