import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { dbConfig, PORT } from './configuration/db.config.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: "*", // or ["https://yourfrontend.netlify.app"]
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

mongoose.connect(dbConfig.url)
  .then(() => console.log('📊 MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.get('/', (req, res) => res.send('✅ Backend is Running...'));

// Example Routes
// import userRoutes from './routes/user.routes.js';
// app.use('/api/users', userRoutes);

const port = PORT || 5000;
app.listen(PORT,'0.0.0.0', () => console.log(`🚀 Server running on port ${port}`));
