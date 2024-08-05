const jwt = require("jsonwebtoken");

module.exports = JWTAuthToken = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (authHeader) {
        let token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
            if (err) {
                return res
                    .status(401)
                    .json({ data: "Please Login to access this resource!" });
            }
            req.user = data
            next()

        });
    } else {
        return res
            .status(401)
            .json({ data: "You are not authorized to access this resource." });
    }
};
