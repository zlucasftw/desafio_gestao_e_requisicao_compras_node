export type JwtHeaderRequest = {
    sub: string,
    role: "USER" | "APPROVER"
}