import jwt from "jsonwebtoken";
import type { JwtHeaderRequest } from "../models/jwt-input.ts";

// TODO - Change method signature and return type accordingly
// The return of the userId extracted should be separate from
// the validation of the token
export const checkAuthorizationService = async (token: string) => {
    if (!token) {
        return;
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined!");
    }

    try {
        const isJwtValid = jwt.verify(token, process.env.JWT_SECRET || "");
        
        if (!isJwtValid) {
            return;
        }

        const tokenBody = jwt.decode(token, { json: true });        

        if (!tokenBody) {
            return;
        }
        
        return tokenBody.sub;
    } catch {
        return;
    }
};
