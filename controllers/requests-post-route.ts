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
            headers: z.object({
                authorization: z.string(),
            }),
            body: z.object({
                title: z.string().min(4, 'Title must be at least 4 characters long'),
                description: z.string().nullable(),
                quantity: z.int().min(1, 'Quantity must be at least 1'),
                totalPrice: z.number().min(1, 'Total price must be higher than 1'),
                items: z.array(z.object({
                    title: z.string().min(4, 'Title must be at least 4 characters long'),
                    description: z.string().nullable(),
                    quantity: z.int().min(1, 'Quantity must be at least 1'),
                    price: z.number().min(1, 'Price must be higher than 1'),
                })),
            }),
            response: {
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

        const purchaseRequest = request.body;

        // TODO - Create a purchase request model respective to the database schema
        // TODO - Validations and send database requests to services layer
        try {
            const total = purchaseRequest.items.reduce((accumulatedSum, item) => accumulatedSum + (item.price * item.quantity), 0);
            const newPurchaseRequest = await prisma.purchaseRequests.create({
                data: {
                    title: purchaseRequest.title,
                    description: purchaseRequest.description,
                    quantity: purchaseRequest.quantity,
                    totalPrice: total, // TODO - Price must be calculated based on items
                    userId: userIdByToken,
                }
            });

            const newPurchaseRequestId = newPurchaseRequest.id;
            
            const itemsWithRequestId = purchaseRequest.items.map(item => {
                return { purchaseRequestId: newPurchaseRequestId, ...item };
            });

            const newItemsRequest = await prisma.requestItems.createMany({
                data: [
                    ...itemsWithRequestId
                ]
            });

            const registeredItems = await prisma.requestItems.findMany({
                where: {
                    purchaseRequestId: newPurchaseRequestId,
                },
                omit: {
                    purchaseRequestId: true,
                }
            })
            
            const newPurchaseRequestResponse = {
                items: registeredItems,
                ...newPurchaseRequest,
            }

            return reply.status(201).send(newPurchaseRequestResponse);
        } catch {
            return reply.status(404).send();
        }
    });
}
