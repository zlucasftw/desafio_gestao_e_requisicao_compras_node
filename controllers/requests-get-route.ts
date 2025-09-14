import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db as PrismaClient } from "../config/connection.ts";
import z from 'zod';
import { checkAuthorizationService } from '../services/check-authorization-service.ts';

const prisma = PrismaClient;

export const getAllRequestsRoute: FastifyPluginCallbackZod = (app) => {

    app.get("/requests", {
        
        schema: {
            tags: ['requests'],
            summary: 'Get all purchase requests',
            description: 'This endpoint retrieves all purchase requests',
            headers: z.object({
                authorization: z.string(),
            }),
            response: {
                200: z.object({
                    allPurchaseRequests: z.array(z.object({
                        id: z.string(),
                        title: z.string(),
                        description: z.string().nullable(),
                        quantity: z.int(),
                        totalPrice: z.number(),
                        status: z.string(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                        userId: z.string(),
                        items: z.array(z.object({
                            id: z.string(),
                            title: z.string(),
                            description: z.string().nullable(),
                            quantity: z.int(),
                            price: z.number(),
                        })),
                    })),
                }),
                400: z.object({ message: z.string('Bad Request') }),
                401: z.object({ message: z.string('Unauthorized') }),
                404: z.array(z.object({})),
                500: z.object({ message: z.string('Internal Server Error') }),
            },
        }
    }, async (request, reply) => {

        const token: string | undefined = request.headers.authorization;
        
        const userIdByToken = await checkAuthorizationService(token);

        if (!userIdByToken || !token) {
            return reply.status(401).send();
        }
        
        try {
            const allPurchaseRequests = await prisma.purchaseRequests.findMany({
                include: {
                    items: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            quantity: true,
                            price: true,
                        }
                    }
                },
            });

            if (allPurchaseRequests.length === 0) {
                return reply.status(404).send([]);
            }

            return reply.status(200).send({ allPurchaseRequests });
        } catch {
            return reply.status(500).send();
        }
    });
}
