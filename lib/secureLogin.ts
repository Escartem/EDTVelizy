import crypto from "crypto";

const key = process.env.MASTER_KEY;

export function encrypt(text: string) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), iv);
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString("hex")}:${encrypted.toString("hex")}:${authTag.toString("hex")}`;
}
