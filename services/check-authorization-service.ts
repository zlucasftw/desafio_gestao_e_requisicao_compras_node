import jwt from "jsonwebtoken";
import type { JwtHeaderRequest } from "../models/jwt-input.ts";

export const checkAuthorizationService = async (token: string) => {
    if (!token) {
        return false;
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined!");
    }

    try {
        const isJwtValid = jwt.verify(token, process.env.JWT_SECRET || "");
        
        if (!isJwtValid) {
            return false;
        }

        const tokenBody = jwt.decode(token, { json: true });        

        if (!tokenBody) {
            return false;
        }
        
        return tokenBody.sub;
    } catch {
        return false;
    }
};
