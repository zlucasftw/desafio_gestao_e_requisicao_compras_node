import jwt from "jsonwebtoken";

export const authService = async (id: string, email: string, role: string) => {
    
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined!");
    }

    const tokenPayload = { sub: id, email: email, role: role};
    // Sign token with 10 hours expiration time
    // TODO - Change expiration time to 10 minutes and implement refresh token

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "10h" });

    return token;
}
