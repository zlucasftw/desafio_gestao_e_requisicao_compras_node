import type { JwtHeaderRequest } from "../models/jwt-input.ts";
import jwt from "jsonwebtoken";

export const authService = async (id: string, role: string) => {
    
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined!");
    }

    const tokenPayload: JwtHeaderRequest = { sub: id, role: role as "USER" || role as "APPROVER" };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });
    /* const token = fastifyJwt.applySign() }); */

    return token;
}
