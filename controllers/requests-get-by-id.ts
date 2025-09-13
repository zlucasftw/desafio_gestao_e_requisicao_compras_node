import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db as PrismaClient } from "../config/connection.ts";
import { checkAuthorizationService } from "../services/check-authorization-service.ts";
import z from 'zod';

const prisma = PrismaClient;

export const getRequestById: FastifyPluginCallbackZod = (app) => {

    app.get("/requests/:id", {
        schema: {
            tags: ['requests'],
            summary: 'Get a request by its id',
            description: 'This endpoint returns a request by a given id',
            headers: z.object({
                authorization: z.string(),
            }),
            params: z.object({
                id: z.string(),
            }),
            response: {
                200: z.any(),
                201: z.object({
                    id: z.uuidv4(),
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
                }),
                400: z.object({ message: z.string('Bad Request') }),
                401: z.object({ message: z.string('Unauthorized') }),
                404: z.object({ message: z.string('Not Found') }),
            }
        }
    }, async (request, reply) => {
        
        const token: string | undefined = request.headers.authorization;
        
        const userIdByToken = await checkAuthorizationService(token);

        if (!userIdByToken || !token) {
            return reply.status(401).send();
        }

        const purchaseRequestId = request.params.id;

        // TODO - Create a purchase request model respective to the database schema
        try {
            const purchaseById = await prisma.purchaseRequests.findFirst({
                where: {
                    id: purchaseRequestId,
                },
                include: {
                    items: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            quantity: true,
                            price: true,
                        }
                    },
                },
            });

            if (!purchaseById) {
                return reply.status(404).send();
            }

            return reply.status(200).send({ "purchaseRequest": purchaseById  });
        } catch {
            return reply.status(400).send();
        }
    });
}
