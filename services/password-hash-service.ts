import { hash, verify } from "argon2";

export async function hashPassword(password: string) {
    const hashedPassword = await hash(password);
    return hashedPassword;
}

export async function decodePassword(hashedPassword: string, matchPassword: string) {
    const isMatch = await verify(hashedPassword, matchPassword);
    return isMatch;
}
