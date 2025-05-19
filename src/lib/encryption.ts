// This is a simplified encryption implementation for demonstration purposes
// In a real app, you would use a more secure method

export function encryptData(data: string): string {
  // In a real app, you would use a proper encryption library
  // This is just a simple base64 encoding for demonstration
  return Buffer.from(data).toString("base64")
}

export function decryptData(encryptedData: string): string {
  // In a real app, you would use a proper decryption method
  // This is just a simple base64 decoding for demonstration
  return Buffer.from(encryptedData, "base64").toString()
}