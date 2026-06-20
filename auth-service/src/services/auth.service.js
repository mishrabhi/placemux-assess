import User from "../models/user.model.js";
import refreshTokenModel from "../models/refreshToken.model.js";

import {
    hashedPassword, comparePassword,
} from "../utils/bcrypt.js";

import {
    generateAccessToken, generateRefreshToken
} from "../utils/jwt.js";

import jwt from "jsonwebtoken";

class AuthService {
    //signup
    async signup(body){
        const {email, password, experienceLevel} = body;
        const userExists = await User.findOne({email});

        if(userExists){
            throw new Error("User already exists")
        }

        const hashedPassword = await hashedPassword(password);
        const user = await User.create({
            email,
            password: hashedPassword,
            experienceLevel
        })

        return user;
    }

    //login 
    async login(body){
        const {email, password} = body;
        const user = await User.findOne({email});
        if(!user){
            throw new Error("Invalid credentials")
        }

        const isMatch = await comparePassword(
            password, user.password
        );

        if(!isMatch){
            throw new Error("Invalid credentials")
        }

        const payload = {
            userId: user._id,
            role: user.role
        }

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7*24*60*60*1000)
        })
        return {
            accessToken, refreshToken
        }
    }
    //refreshToken
    async refreshToken(token){
        const tokenExists = await RefreshToken.findOne({
            token
        })

        if(!tokenExists){
            throw new Error("Invalid refresh token")
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET
        );

        const accessToken = generateAccessToken({
            userId: decoded.userId,
            role: decoded.role
        })
        return accessToken;
    }

    //logout
    async logout(token){
        await RefreshToken.findOneAndDelete({
            token
        })
        return;
    }
}

export default new AuthService();
