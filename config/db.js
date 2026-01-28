import 'dotenv/config';
import pkg from "../generated/prisma/index.js";
const { PrismaClient } = pkg
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

const adapter = new PrismaPg({
    connectionString,
})

export const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ['query', 'error', 'warn'] : ['error']
})

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('DB connected successfully');
    } catch (error) {
        console.log(`DB connection failed with error ${error.message}`);
        process.exit(1);
    }
}


export const disconnectDB = async () => {
    await prisma.$disconnect();
}

