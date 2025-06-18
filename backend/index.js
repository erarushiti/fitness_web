const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const DB = require("./config/db");
const cors = require("cors");
const sessionRoutes = require("./routes/sessions");
const authRouter = require("./routes/auth");
const waterLogRoutes = require('./routes/waterLog');
const supplementRoutes = require("./routes/supplements");
const trainerRoutes = require("./routes/trainer");
const ordesRoutes = require("./routes/orders");
const cartRoutes = require("./routes/cart");
const { authenticateToken } = require("./middleware/authenticateToken");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/session", sessionRoutes);
app.use('/api/waterlog', waterLogRoutes);
app.use('/api/supplement', supplementRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/orders', ordesRoutes);
app.use('/api/cart', cartRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
