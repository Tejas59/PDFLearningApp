import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userModel } from "../models/userModel";
import jwt from "jsonwebtoken";

export const registrationFun = async (req: Request, res: Response) => {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        return res.json({ success: false, message: "Invalid data" });
    }
    const exisitngUser = await userModel.findOne({ email });
    if (exisitngUser) {
        return res.json({ success: false, message: "User alerady exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 100,
    });
    return res.json({ success: true });
};

export const loginFun = async (req: Request, res: Response) => {
    const { password, email } = req.body;

    if (!password || !email) {
        return res.json({
            success: false,
            message: "Password and Mail is required",
        });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.json({
            success: false,
            message: "User does not exist for this mail",
        });
    }
    const isMatch = bcrypt.compare(password, user?.password as string);
    if (!isMatch) {
        return res.json({ success: false, message: "Incorrect Email Address" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 100,
    });

    return res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
};

export const logoutFun = async (res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ sucess: true, message: "Logged out" });
};