import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db as PrismaClient } from "../config/connection.ts";
import z from 'zod';
import fastify from 'fastify';

const prisma = PrismaClient;

export const getAllRequestsRoute: FastifyPluginCallbackZod = (app) => {

    app.get("/requests", {
        
        schema: {
            tags: ['requests'],
            summary: 'Get all purchase requests',
            description: 'This endpoint retrieves all purchase requests',
            /* response: { */
                /* 200: z.object({
                    purchases: z.object({
                        id: z.string(),
                        title: z.string(),
                        description: z.string().nullable(),
                        quantity: z.number(),
                        totalPrice: z.number(),
                        status: z.string(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                        userId: z.string(),
                    }),
                }), */
                /* 404: z.null(), */
            /* }, */
        }
    }, async (request, reply) => {
        
        const allPurchaseRequests = await prisma.purchaseRequests.findMany({
            include: {
                items: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        quantity: true,
                        price: true,
                    },
                },
            },
        });

        if (allPurchaseRequests.length === 0) {
            return reply.status(404).send(allPurchaseRequests);
        }

        return reply.status(200).send({ allPurchaseRequests });
    });
}
