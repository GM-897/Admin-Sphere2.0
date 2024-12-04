import User from "@/app/models/User";
import { connectToDatabase } from "@/app/utils/connectToDatabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Parse the request body
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Decide whether to include JWT
    const includeJwt = true; // Set to false if JWT is not required
    let token = null;

    if (includeJwt) {
      // Generate JWT token
      token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET, // Make sure to set this in your environment variables
        { expiresIn: "1d" }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: { name: user.name, email: user.email, role: user.role },
        ...(includeJwt && { token }), // Include token only if JWT is enabled
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
