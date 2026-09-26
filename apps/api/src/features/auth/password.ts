const ITERATIONS = 600_000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

const encoder = new TextEncoder();

const bufferToBase64 = (buffer: ArrayBuffer)=>{
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

const base64ToBuffer = (value: string)=>{
    return Uint8Array.from(atob(value), (char)=> char.charCodeAt(0));
}

export const hashPassword = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH * 8,
  );

  return [
    "pbkdf2",
    "sha256",
    ITERATIONS,
    bufferToBase64(salt.buffer),
    bufferToBase64(hash),
  ].join("$");
};

export const verifyPassword = async (
  password: string,
  storedHash: string,
) => {
  const [algorithm, hashAlgorithm, iterationsString, saltBase64, hashBase64] =
    storedHash.split("$");

  if (
    algorithm !== "pbkdf2" ||
    hashAlgorithm !== "sha256" ||
    !iterationsString ||
    !saltBase64 ||
    !hashBase64
  ) {
    return false;
  }

  const iterations = Number(iterationsString);
  const salt = base64ToBuffer(saltBase64);
  const expectedHash = base64ToBuffer(hashBase64);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const derivedHash = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      expectedHash.length * 8,
    ),
  );

  if (derivedHash.length !== expectedHash.length) {
    return false;
  }

  let difference = 0;

  for (let i = 0; i < derivedHash.length; i++) {
    difference |= derivedHash[i] ^ expectedHash[i];
  }

  return difference === 0;
};