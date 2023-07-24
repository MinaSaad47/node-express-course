const jwt = require("jsonwebtoken");

const { UnauthenticatedError } = require("../errors");

module.exports = async (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("authentication invalid");
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { name: payload.name, id: payload.id };
        next();
    } catch (error) {
        throw new UnauthenticatedError("authentication invalid");
    }
};
