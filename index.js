const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const userRouter = require("./routes/user.routes");

const bookRouter = require("./routes/books.routes");
const { logger } = require("./middlewares/logger");

const app = express();

const port = 9000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://qe-frontend.vercel.app",
    ],
    credentials: true,
  })
);
app.use(logger);
app.get("/", (req, res) => {
  res.send("basic api endpiont");
});

app.use("/users", userRouter);
app.use("/books", bookRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log("listening on ", port);
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
});
