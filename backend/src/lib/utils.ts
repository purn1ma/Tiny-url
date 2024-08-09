import * as crypto from "crypto"

export async function encryption(data: string) {
  try {
  //   const secretKey = crypto.randomBytes(32).toString('hex');
  //   const iv = crypto.randomBytes(16)
    const cipher = crypto.createHash("sha256").update(data);
    const digest = cipher.digest('base64');
    const shortHash = digest.slice(0, 5)
    return shortHash;
  } catch (error) {
    console.log(error)
  }
}