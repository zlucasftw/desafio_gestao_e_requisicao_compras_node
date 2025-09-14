import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db as PrismaClient } from "../config/connection.ts";
import { checkAuthorizationService } from "../services/check-authorization-service.ts";
import z from 'zod';

const prisma = PrismaClient;

export const deleteRequestById: FastifyPluginCallbackZod = (app) => {
    // TODO - Implement a soft delete instead of a hard delete
    // Create a table of deletion history to move deleted buying requests
    // that are logic deleted on their main table
    // and create a new endpoint to retrieve deleted requests if needed
    app.delete("/requests/:id", {
        schema: {
            tags: ['requests'],
            summary: 'Delete a request by its id',
            description: 'This endpoint deletes a request by a given id',
            headers: z.object({
                authorization: z.string(),
            }),
            params: z.object({
                id: z.string(),
            }),
            response: {
                200: z.null(),
                400: z.object({ message: z.string('Bad Request') }),
                401: z.object({ message: z.string('Unauthorized') }),
                404: z.object({ message: z.string('Not Found') }),
            }
        }
    }, async (request, reply) => {
        
        const token: string = request.headers.authorization;
        
        const userIdByToken = await checkAuthorizationService(token);

        if (!userIdByToken || !token) {
            return reply.status(401).send();
        }

        const deleteRequestId = request.params.id;

        // TODO - Create a purchase request model respective to the database schema
        try {
            const checkIfDeleted = await prisma.purchaseRequests.findFirst({
                where: {
                    id: deleteRequestId,
                }
            });

            if (!checkIfDeleted) {
                return reply.status(404).send();
            }

            const deletedByIdPurchase = await prisma.purchaseRequests.delete({
                where: {
                    id: deleteRequestId,
                },
            });

            if (!deletedByIdPurchase) {
                return reply.status(404).send();
            }

            return reply.status(200).send();
        } catch {
            return reply.status(400).send();
        }
    });
}
