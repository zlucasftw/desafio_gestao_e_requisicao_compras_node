import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db as PrismaClient } from "../config/connection.ts";
import { checkAuthorizationService } from "../services/check-authorization-service.ts";
import z from 'zod';
import { checkRoleService } from '../services/check-role-service.ts';

const prisma = PrismaClient;

export const submitRequestById: FastifyPluginCallbackZod = (app) => {

    app.post("/requests/:id/submit", {
        schema: {
            tags: ['requests'],
            summary: 'Change the status of a request to SUBMITTED',
            description: 'This endpoint changes the status of a request to SUBMITTED',
            headers: z.object({
                authorization: z.string(),
            }),
            params: z.object({
                id: z.string(),
            }),
            response: {
                200: z.object({
                    updatedStatus: z.object({
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
                    }),
                }),
                400: z.object({ message: z.string('Bad Request') }),
                401: z.object({ message: z.string('Unauthorized') }),
                404: z.object({ message: z.string('Not Found') }),
            }
        }
    }, async (request, reply) => {
        
        const token: string = request.headers.authorization;
        
        const userIdByToken = await checkAuthorizationService(token);
        const userRoleByToken = await checkRoleService(token);

        if (userIdByToken?.length === 0 || !userRoleByToken) {
            return reply.status(401).send();
        }

        const purchaseRequestId = request.params.id;

        // TODO - Create a purchase request model respective to the database schema
        try {
            const purchaseById = await prisma.purchaseRequests.findFirst({
                select: {
                    status: true,
                },
                where: {
                    id: purchaseRequestId,
                },
            });

            if (!purchaseById || purchaseById.status !== "DRAFT") {
                return reply.status(401).send();
            }

            const updatedStatus = await prisma.purchaseRequests.update({
                where: { 
                    id: purchaseRequestId,
                },
                data: { 
                    status: "SUBMITTED"
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

            if (!purchaseById || !updatedStatus) {
                return reply.status(404).send();
            }

            return reply.status(200).send({ updatedStatus: updatedStatus  });
        } catch {
            return reply.status(400).send();
        }
    });
}
