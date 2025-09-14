import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db as PrismaClient } from "../config/connection.ts";
import { checkAuthorizationService } from "../services/check-authorization-service.ts";
import z from 'zod';

const prisma = PrismaClient;

export const getReportSummary: FastifyPluginCallbackZod = (app) => {

    app.get("/reports/summary", {
        schema: {
            tags: ['reports'],
            summary: 'Get a summary of the quantity of requests by status',
            description: 'This endpoint returns a summary of the quantity of requests by status',
            headers: z.object({
                authorization: z.string(),
            }),
            response: {
                200: z.any(),
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

        // TODO - Create a purchase request model respective to the database schema
        try {
            // TODO - Adjust the output of the query below
            const totalRequestsByStatus  = await prisma.purchaseRequests.groupBy({
                _count: {
                    status: true,
                },
                by: ['status'],
            });

            
            if (!totalRequestsByStatus) {
                console.error(totalRequestsByStatus);
                return reply.status(404).send();
            }

            return reply.status(200).send({ totalRequestsByStatus });
        } catch {
            return reply.status(400).send();
        }
    });
}
