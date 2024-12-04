import User from "@/app/models/User";
import { connectToDatabase } from "@/app/utils/connectToDatabase";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract the `id` parameter from the request URL
    const url = new URL(req.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the user data as a response
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
