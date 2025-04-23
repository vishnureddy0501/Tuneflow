import jwt from "jsonwebtoken";

const oneDay = 1000 * 60 * 60 * 24;

export const generateToken = (userId, email, res) => {

	// expiresIn need to be in seconds. so dividing oneDay by 1000
	const oneDayInSeconds = oneDay / 1000;
	const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
		expiresIn: 2 * oneDayInSeconds,
	});
    res.cookie("jwt", token, {
        maxAge: oneDay * 2,
        httpOnly: true, // prevents cross site scripting attacks
        secure: process.env.NODE_ENV === "production", // Only set to true in production (HTTPS)
        sameSite: "strict", // Helps prevent CSRF attacks
    });
    return token;
};
