import { config } from 'dotenv'

config({ quiet: true })

export const API_PORT: number = Number(process.env.API_PORT) || 5000

export const DB_HOST: string = process.env.DB_HOST!
export const DB_PORT: number = Number(process.env.DB_PORT) || 5432
export const DB_USER: string = process.env.DB_USER || 'postgres'
export const DB_PASSWORD: string = process.env.DB_PASSWORD!
export const DB_NAME: string = process.env.DB_NAME || 'arche'

export const JWT_SECRET: string = process.env.JWT_SECRET!;