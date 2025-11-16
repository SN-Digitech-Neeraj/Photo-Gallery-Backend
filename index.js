import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dbConfig, PORT } from './configuration/db.config.js';
import adminRoute from './controllers/Auth/admin.controller.js';
import collectionRoute from './controllers/Collection/collection.controller.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

mongoose.connect(dbConfig.url)
  .then(() => console.log('📊 MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.get('/', (req, res) => res.send('✅ Backend is Running...'));

// Serve uploads publically
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/auth', adminRoute);
app.use("/api/collections", collectionRoute);

const port = PORT || 5000;
app.listen(PORT,'0.0.0.0', () => console.log(`🚀 Server running on port ${port}`));
