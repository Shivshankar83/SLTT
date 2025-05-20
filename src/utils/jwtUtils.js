/**
 * Utility function to decode JWT tokens
 * @param {string} token - JWT token to decode
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export const decodeJWT = (token) => {
  if (!token) return null;

  try {
    // JWT tokens are structured as: header.payload.signature
    // We only need the payload part which is the second segment
    const base64Payload = token.split(".")[1];

    // Replace non-base64 URL characters and decode
    const decodedPayload = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));

    // Parse the JSON payload
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};