import User from "@/app/models/User";
import { connectToDatabase } from "@/app/utils/connectToDatabase";
import bcrypt from "bcrypt";
import validator from "validator";

export async function POST(req) {
  try {
    // Parse the request body
    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return new Response(
        JSON.stringify({ message: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate password strength
    if (password.length < 5) {
      return new Response(
        JSON.stringify({ message: "Password must be at least 5 characters long" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Email is already in use" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "Admin", // Default role
      status: "Active", // Default status
    });

    // Save the user to the database
    await newUser.save();

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        user: { name, email, role: newUser.role, status: newUser.status },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
