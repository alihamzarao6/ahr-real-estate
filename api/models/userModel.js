import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "This username is already taken"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "This email is already in use"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// hash the password
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare user password with the password saved in 'User' collection. it'll retrun true or false.
userSchema.methods.comparePassword = async function (userPassword) {
  const isPasswordMatched = await bcrypt.compare(userPassword, this.password);
  return isPasswordMatched;
};

// generate jwt token from user's id
userSchema.methods.generateJWT = function () {
  const jwtToken = jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );

  return jwtToken;
};

const User = mongoose.model("User", userSchema);

export default User;
