"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Holds the authenticated user
  const [loading, setLoading] = useState(false); // Indicates if a login/signup request is in progress
  const [error, setError] = useState(null); // Holds any login/signup errors
  const router = useRouter();

  // Load cached user data from localStorage on component mount
  useEffect(() => {
    const cachedUser = localStorage.getItem("authUser");
    const token = localStorage.getItem("authToken");

    if (cachedUser && token) {
      setUser(JSON.parse(cachedUser)); // Restore user from localStorage
    }
  }, []);

  // Login Function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const { token, user } = await response.json();

      if (!token) {
        throw new Error("Authentication failed. Please try again!");
      }

      // Store the JWT token and user data in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));

      setUser(user);

      // Redirect to the home page
      router.push("/");
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.message || "An error occurred while logging in!");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // SignUp Function
  const signUp = async (email, password, name) => {
    console.log("singup is working");

    setLoading(true);
    setError(null);
    try {
      // Input validation
      // if (!validator.isEmail(email)) {
      //   throw new Error("Invalid email format!");
      // }
      if (password.length < 5) {
        throw new Error("Password must be at least 5 characters long!");
      }

      // API request to create a new user
      const response = await fetch("/api/user/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      // Parse the API response
      const newUser = await response.json();
      setUser(newUser.user);

      // Store the user in localStorage
      localStorage.setItem("authUser", JSON.stringify(newUser.user));

      console.log("User created successfully:", newUser);

      // Redirect to the home page
      router.push("/");
    } catch (err) {
      setError(err.message || "Something went wrong during signup");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    router.push("/login"); // Redirect to Login Page
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to Use Auth Context
export function useAuth() {
  return useContext(AuthContext);
}
