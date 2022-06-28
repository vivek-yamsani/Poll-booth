const express = require("express");
require("dotenv").config({ path: "./.env" });
const authRouter = require("./routes/authrouter");
const teamRouter = require("./routes/teamRouter");
const pollRouter = require("./routes/pollRouter");
const { verifyToken } = require("./middlewares/jwt");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/teams", verifyToken, teamRouter);
app.use("/teams", verifyToken, pollRouter);

app.use((req, res) => {
  console.log(req.path, req.params, req.method);
  // console.log(res);
});

app.all("*", async (req, res) => {
  res.status(404).json({ message: "Resource not found!" });
});

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
