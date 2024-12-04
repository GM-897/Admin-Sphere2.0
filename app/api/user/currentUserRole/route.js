export async function GET(req) {
    try {
      // Log the headers to check if the token is being sent
      console.log("Request Headers:", req.headers);
  
      const authHeader = req.headers.get("Authorization");
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ message: "Authorization token missing" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const token = authHeader.split(" ")[1];
      console.log("Token extracted:", token); // Log the extracted token
  
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Fetch the user as before
      // ...
    } catch (error) {
      console.error("Error fetching user role:", error);
      return new Response(
        JSON.stringify({ message: "Server Error", error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
  