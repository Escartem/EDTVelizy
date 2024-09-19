import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const urls = {
	"VEL": "edt.iut-velizy.uvsq.fr",
	"VER": "edt.uvsq.fr"
}
