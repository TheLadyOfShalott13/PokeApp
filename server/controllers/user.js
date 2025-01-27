import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

//================= List All Users =======================//
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//============== Get a Single User By ID ===================//
export const getOneUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findAll({ where: { id: userId } });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//========== Register a User ===================//
//========== Use bycrypt to salt and hash the password ================//
export const register = async (req, res, next) => {
    try {

        //check for already exist
        const em = await User.findAll({ where: { email: req.body.email } });
        if (em.length===1)
            return res.status(409).send({
                message: "User with given email already exists"
            })
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash,
        });

        await newUser.save();
        res.status(200).send(req.body);
    } catch (err) {
        next(err);
    }
};


//========== Login using a user email and password ===========//
//========== Generate a cookie with a valid JWT token in return upon successful authorization ===========//
export const login = async (req, res, next) => {
    try {
        let user = await User.findAll({ where: { email: req.body.email } });
        if (user.length===0) return next(
            createError(404, "User not found!"));
        else user = user[0];

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return next(createError(
                400, "Wrong password or email!"));

        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin },
            process.env.JWT
        );

        const { password, isAdmin, ...otherDetails } = user;
        res.cookie("access_token", token, { httpOnly: true }).status(200).json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
        next(err);
    }
};