import jwt from "jsonwebtoken";

export const authService = async (id: number, role: string) => {
    
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined!");
    }

    const token = jwt.sign({ sub: id, role: role }, process.env.JWT_SECRET);

    return token;
}
