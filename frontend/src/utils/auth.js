import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../api";
import { setUser } from '../store/slice/userSclice';


export const isTokenValid = (token) => {
  try {
    if (!token) return false;
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export const getUserDetails = async (token) => {
  try {
    if (!token) return false;
    const decodedToken = jwtDecode(token);
    let { data } = await axios.get(
      `${baseUrl}/api/auth/getUserById/${decodedToken.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { user: data.data };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return false;
  }
};

export const initializeAuth = async ({ dispatch, setIsAuth, setLoading, setError }) => {
  const token = localStorage.getItem("token");

  if (!isTokenValid(token)) {
    localStorage.removeItem("token");
    setIsAuth(false);
    setLoading(false);
    return;
  }

  try {
    const user = await getUserDetails(token);
    dispatch(setUser({ ...user, token }));
    setIsAuth(true);
  } catch (err) {
    console.error("Error fetching user details:", err);
    setError(err.message || "Failed to fetch user details.");
    setIsAuth(false);
  } finally {
    setLoading(false);
  }
};

