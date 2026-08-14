import { config } from 'dotenv'

config({ quiet: true })

export const API_PORT: number = Number(process.env.API_PORT) || 5000

export const DATABASE_URL: string = process.env.DATABASE_URL!

export const JWT_SECRET: string = process.env.JWT_SECRET!;