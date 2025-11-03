import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';


export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({message: "Please fill all fields"});
        }

        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({message : "Password must be at least 6 characters long."});
        }

        const user = await User.findOne({email});

        if (user) {
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&size=200`
        })

        if (newUser) {
            await newUser.save();
            generateToken(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(500).json({message: "Server error."});
        }

    } catch (error) {
        console.log("error in signup", error.message);
        return res.status(500).json({message: "Server error."});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: "User with given credentials does not exist."});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({message: "User with given credentials does not exist."});
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("error in login", error.message);
        return res.status(500).json({message: "server error."});
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 1000 });
        return res.status(200).json({message: "Successfully logged out."});
    } catch (error) {
        console.log("error in logout", error.message);
        return res.status(500).json({message: "server error."});
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({message: "No profile pic is provided."});
        }

        const uploadedResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadedResponse.secure_url },
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in updateProfile", error);
        return res.status(500).json({message: "server error."});
    }
}

export const checkAuth = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checkAuth", error);
        return res.status(500).json({message: "server error."});
    }
}