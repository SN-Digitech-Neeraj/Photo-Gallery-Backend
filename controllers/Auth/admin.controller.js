import express from "express";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin.Modal.js";

const router = express.Router();

// 🟢 Register Admin
router.post("/register", async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne({ email: req.body.email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC_KEY
    ).toString();

    const newAdmin = new Admin({
      email: req.body.email,
      password: encryptedPassword,
    });

    const savedAdmin = await newAdmin.save();
    res.status(201).json({
      success: true,
      message: "Admin created successfully!",
      admin: savedAdmin,
    });
  } catch (error) {
    console.error("❌ Error saving admin:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
});

// 🟡 Login Admin
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      admin.password,
      process.env.PASS_SEC_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }

    const accessToken = jwt.sign(
      {
        id: admin._id,
        isAdmin: admin.isAdmin,
      },
      process.env.JWT_SECRET_KEY, // ✅ match your verify middleware key name
      { expiresIn: "3d" }
    );

    // ✅ Hide password field safely
    const { password, ...others } = admin._doc;

    res.status(200).json({
      success: true,
      message: "Login successful!",
      admin: { ...others },
      token: accessToken, // ✅ consistent token key name
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during login!" });
  }
});

export default router;
