import User from "@/app/models/User";
import { connectToDatabase } from "@/app/utils/connectToDatabase";

export async function GET(req) {
  try {
    console.log("Fetching users...");

    // Connect to the database
    await connectToDatabase();

    // Fetch users from the database
    const users = await User.find().select("-password"); // Exclude sensitive fields like passwords

    // Handle case where no users are found
    if (!users.length) {
      return new Response(
        JSON.stringify({ message: "No users found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return a JSON response
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
