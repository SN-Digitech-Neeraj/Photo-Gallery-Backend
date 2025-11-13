import jwt from "jsonwebtoken";

// Verify Token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token; // ✅ fixed 'req.header.token' → 'req.headers.token'

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, admin) => {
      if (err)
        return res
          .status(403)
          .json({ error: true, message: "Token is not valid!" });

      req.admin = admin;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ error: true, message: "You are not authenticated admin!" });
  }
};

// Verify Token Authorization
export const verifyTokenAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.admin.id === req.params.id || req.admin.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({ error: true, message: "You are not allowed to access!" });
    }
  });
};

// Verify Token Admin
export const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.admin.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: true, message: "You are not allowed!" });
    }
  });
};
