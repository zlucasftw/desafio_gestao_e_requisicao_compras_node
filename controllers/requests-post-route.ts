import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db as PrismaClient } from "../config/connection.ts";
import { checkAuthorizationService } from "../services/check-authorization-service.ts";
import z from 'zod';

const prisma = PrismaClient;

export const requestsPostRoute: FastifyPluginCallbackZod = (app) => {

    app.post("/requests", {
        schema: {
            tags: ['requests'],
            summary: 'Create a new purchase request',
            description: 'This endpoint creates a new purchase request',
            body: z.object({
                title: z.string().min(4, 'Title must be at least 4 characters long'),
                description: z.string().nullable(),
                quantity: z.int().min(1, 'Quantity must be at least 1'),
                totalPrice: z.number().min(0, 'Total price must be a positive number'),
            }),
            response: {
                201: z.object({
                    id: z.uuid(),
                    title: z.string(),
                    description: z.string().nullable(),
                    quantity: z.int(),
                    totalPrice: z.number(),
                    status: z.string(),
                    
                }),
                400: z.object({ message: z.string('Bad Request') }),
                401: z.object({ message: z.string('Unauthorized') }),

            }
        }
    }, async (request, reply) => {
        
        const token: string | undefined = request.headers.authorization;
        
        const userIdByToken = await checkAuthorizationService(token);

        if (!userIdByToken || !token) {
            return reply.status(401).send();
        }

        const purchaseRequest = request.body;

        // TODO - Create a purchase request model respective to the database schema
        try {
            const newPurchaseRequest = await prisma.purchaseRequests.create({
                data: {
                    title: purchaseRequest.title,
                    description: purchaseRequest.description,
                    quantity: purchaseRequest.quantity,
                    totalPrice: purchaseRequest.totalPrice,
                    userId: userIdByToken,
                }
            });
            
            const newPurchaseRequestResponse = {
                id: newPurchaseRequest.id,
                title: newPurchaseRequest.title,
                description: newPurchaseRequest.description,
                quantity: newPurchaseRequest.quantity,
                totalPrice: newPurchaseRequest.totalPrice.toNumber(),
                status: newPurchaseRequest.status,
            }

            return reply.status(201).send(newPurchaseRequestResponse);
        } catch {
            return reply.status(400).send();
        }
    });
}
