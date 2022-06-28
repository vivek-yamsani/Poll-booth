const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const { createToken } = require("../middlewares/jwt");

const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      const result = await bcrypt.compare(password, user.hashedPassword);
      if (result) {
        res.json({
          token: await createToken({ id: user.id }),
          user: { name: user.name, email: user.email, id: user.id },
        });
        // res.status(200).json({ authenticated: true, message: "successfully loggedin .." });
      } else
        res
          .status(401)
          .json({ authenticated: false, message: "Incorrect Password" });
    } else
      res
        .status(401)
        .json({ authenticated: false, message: "Incorrect email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong...!",
    });
  }
};

const signup = async function (req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(401).json({
        message: "Invalid Request",
      });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const check = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (check) {
      console.log("email already present", email);
      res.status(401).json({ message: "this email is already used..." });
      return;
    }
    let user;
    user = await prisma.users.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    console.log(user);
    res.json({ message: "Successfully signed up...." });
  } catch (err) {
    console.log(err);
    res.json({ message: "Something went wrong!" }).status(400);
  }
};

module.exports = { login, signup };
