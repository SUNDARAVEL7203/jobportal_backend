import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Retrieve the token from cookies
        const token = req.cookies.token;

        // If no token is found, return an unauthorized response
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        // Verify the token using the secret key
        const decode = await jwt.verify(token, process.env.SECRET_KEY);

        // If token verification fails, return an unauthorized response
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        };

        // Attach the decoded user ID to the request object for use in other middleware/routes
        req.id = decode.userId;

        // Call the next middleware or route handler
        next();

    } catch (error) {
        console.log(error); // Log error for debugging
    }
}

export default isAuthenticated;