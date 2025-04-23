import { generateToken } from "../utils/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signup = async (req, res) => {
    const { email, password, imageUrl = "", firstName, lastName, username } = req.body;
    try {
        if (!email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const userExists = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (userExists) return res.status(400).json({ message: "Email or Username already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            fullName: `${firstName || ""} ${lastName || ""}`,
            email,
            image: imageUrl,
            password: hashedPassword,
        });
        if (newUser) {
            generateToken(newUser._id, newUser.email, res);
            const userDetails = newUser.toObject();
            delete userDetails.password;
            res.status(200).json(userDetails);
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, user.email, res);
        const userDetails = user.toObject();
        delete userDetails.password;
        res.status(200).json(userDetails);
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
