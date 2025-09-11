import type { FastifyPluginCallback } from "fastify";
import type { RegisterRequestBody } from "../models/register-input.js";
import { hash }  from "argon2";
import { db as PrismaClient } from "../config/connection.ts";

const prisma = PrismaClient;

export const requestsRoute : FastifyPluginCallback = (app) => {

    app.post("/requests", async (request, reply) => {
        
        
    });
    
}
