import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "1d"});
    res.cookie('token', token, {
        maxAge: 86400000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.MODE !== "development"
    });
    return token;
}