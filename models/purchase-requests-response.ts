export type PurchaseRequestsResponse = {
    id: string,
    title: string,
    description: string | null,
    quantity: number,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
}