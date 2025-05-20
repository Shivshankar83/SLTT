import Cookies from "js-cookie";
import { decodeJWT } from "../utils/jwtUtils";
import { store } from "../redux/store";
import { setUser, clearUser } from "../redux/features/userSlice";

/**
 * Service for authentication-related operations
 */
const authService = {
  /**
   * Check if user is authenticated
   * @returns {boolean} authentication status
   */
  isAuthenticated: () => {
    const token = Cookies.get("authToken");
    return !!token;
  },

  /**
   * Get the current authentication token
   * @returns {string|null} JWT token or null
   */
  getToken: () => {
    return Cookies.get("authToken") || null;
  },

  /**
   * Logout the current user
   */
  logout: () => {
    Cookies.remove("authToken");
    localStorage.removeItem("user");
    store.dispatch(clearUser());
  },

  /**
   * Initialize authentication from stored token or localStorage
   * Useful when app starts or refreshes
   * @param {function} dispatch - Redux dispatch function
   * @returns {boolean} - true if user successfully initialized, false otherwise
   */
  initAuth: (dispatch) => {
    // First, check localStorage for user data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData && userData.userId) {
        // Ensure role is set to ADMIN if missing
        const normalizedRole = userData.role || "ADMIN";
        dispatch(
          setUser({
            ...userData,
            role: normalizedRole,
          })
        );
        return true;
      }
    }

    // Fallback to token-based initialization
    const token = Cookies.get("authToken");
    if (!token) return false;

    const userData = decodeJWT(token);
    if (!userData) return false;

    const { sub: username, userId, email, role } = userData;
    const normalizedRole = role ? (Array.isArray(role) ? role[0] : role) : "ADMIN";

    const userPayload = {
      username,
      userId,
      email,
      role: normalizedRole,
    };

    dispatch(setUser(userPayload));
    localStorage.setItem("user", JSON.stringify(userPayload));
    return true;
  },
};

export default authService;