import type { FastifyPluginAsync } from "fastify";
import type { LoginRequestBody } from "../models/login-input.ts";
import { decodePassword } from "../services/password-hash.ts";
import { authService } from "../services/auth.ts";
import { db as PrismaClient } from "../config/connection.ts";

const prisma = PrismaClient;

export const loginRoute: FastifyPluginAsync = async (app) => {

    app.post("/login", async (request, reply) => {

        const { 
            email,
            password
        } : LoginRequestBody = request.body as LoginRequestBody;

        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if (!existingUser || !await decodePassword(existingUser.password, password)) {
            return reply.status(401).send({ message: 'Invalid email or password' });
        }
        
        const token = await authService(existingUser.id, existingUser.email);

        return reply.status(200).send({ token });
    });
    
}
