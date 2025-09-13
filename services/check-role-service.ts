import jwt from "jsonwebtoken";

export const checkRoleService = async (token: string) => {
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
        
        if (tokenBody.role !== 'APPROVER') {
            return;
        }

        return true;
    } catch {
        return;
    }
};
