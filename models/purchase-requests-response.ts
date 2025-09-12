export type PurchaseRequestsResponse = {
    id: string,
    title: string,
    description: string | null,
    quantity: number,
    totalPrice: string,
    status: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
    userId: string,
    createdAt: Date,
    updatedAt: Date,
}