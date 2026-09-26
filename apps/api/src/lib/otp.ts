const OTP_LENGTH = 6;

export const generateOtp = (): string =>{

    const array = new Uint32Array(1);

    crypto.getRandomValues(array);
    const otp = array[0] % 1_000_000;

    return otp.toString().padStart(OTP_LENGTH,"0");
}


const encoder = new TextEncoder();

const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const hashOtp = async (otp: string): Promise<string> => {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(otp),
  );

  return bufferToHex(hash);
};