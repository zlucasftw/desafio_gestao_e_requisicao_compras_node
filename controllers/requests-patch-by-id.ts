import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { db as PrismaClient } from "../config/connection.ts";
import { checkAuthorizationService } from "../services/check-authorization-service.ts";
import z from 'zod';

const prisma = PrismaClient;

export const patchRequestById: FastifyPluginCallbackZod = (app) => {

    app.patch("/requests/:id", {
        schema: {
            tags: ['requests'],
            summary: 'Update a request by its id',
            description: 'This endpoint updates a request by a given id and returns the updated request',
            headers: z.object({
                authorization: z.string(),
            }),
            params: z.object({
                id: z.string(),
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
                200: z.object({ 
                    updatedPurchaseRequestItems: z.object({
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
        
        const token: string | undefined = request.headers.authorization;
        
        const userIdByToken = await checkAuthorizationService(token);

        if (!userIdByToken || !token) {
            return reply.status(401).send();
        }

        const requestIdToUpdate = request.params.id;

        const updatedPurchaseRequest = request.body;

        // TODO - Create a purchase request model respective to the database schema
        /* try { */

            const purchaseById = await prisma.purchaseRequests.findMany({
                where: {
                    id: requestIdToUpdate,
                },
            });

            const itemsById = await prisma.requestItems.findMany({
                where: {
                    purchaseRequestId: requestIdToUpdate,
                },
            });

            if (!purchaseById || !itemsById) {
                return reply.status(404).send();
            }

            const total = updatedPurchaseRequest.items.reduce((accumulatedSum, item) => accumulatedSum + (item.price * item.quantity), 0);
            const updatedPurchaseRequestItems = await prisma.purchaseRequests.update({
                where: { id: requestIdToUpdate },
                data: {
                    title: updatedPurchaseRequest.title,
                    description: updatedPurchaseRequest.description,
                    quantity: updatedPurchaseRequest.quantity,
                    totalPrice: total, // TODO - Price must be calculated based on items
                    userId: userIdByToken,
                }
            });

            const itemsToUpdate = updatedPurchaseRequest.items.map((item, index) => {
                return { 
                    id: itemsById[index].id,
                    title: itemsById[index].title = item.title,
                    description: itemsById[index].description = item.description,
                    quantity: itemsById[index].quantity = item.quantity,
                    price: itemsById[index].price = item.price,
                    createdAt: itemsById[index].createdAt,
                    purchaseRequestById: itemsById[index].purchaseRequestId,
                };
            });

            // const purchaseItemsRequestToUpdate = await prisma.requestItems.updateMany({
            //     where: {
            //         purchaseRequestId: {
            //             contains: requestIdToUpdate,
            //         }
            //     },
            //     data: {
            //         ...itemsToUpdate,
            //     }
            // });
            const purchaseItemsRequestToUpdate = itemsToUpdate.map(async (item) => {
                const updatedItem = await prisma.requestItems.update({
                    where: {
                        id: item.id,
                    },
                    data: {
                        title: item.title,
                        description: item.description,
                        quantity: item.quantity,
                        price: item.price,
                        createdAt: item.createdAt,
                        purchaseRequestId: item.purchaseRequestById,
                    }
                });
                return updatedItem;
            });
            
            console.log(purchaseItemsRequestToUpdate)

            const updatedItems = {
                items: itemsToUpdate,
                ...updatedPurchaseRequestItems,
            }

            return reply.status(200).send({ "updatedPurchaseRequestItems": updatedItems });
        /* } catch {
            return reply.status(400).send();
        } */
    });
}
