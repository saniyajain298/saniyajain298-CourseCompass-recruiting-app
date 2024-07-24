const jwt = require("jsonwebtoken");

module.exports = {
    allowIfLoggedin: async (req, res, next) => {
        try {
            const token =
                req.body.token || req.query.token || req.headers["x-access-token"];

            if (!token) {
                return res.status(403).send("A token is required for authentication");
            }
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
            } catch (error) {
                return res.status(401).send(error.message);
            }
            return next();
        } catch (error) {
            next(error);
        }
    }
}