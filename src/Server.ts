import express from 'express';
import cors from 'cors';
import { userRoutes } from './Routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());

app.use(express.json());

app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
