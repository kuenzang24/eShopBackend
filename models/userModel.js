const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
});
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

//Hashing the Password
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("passwordHash")) return next();
  // Hash the password with cost of 12
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  console.log(this.passwordHash);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword, //Password user entered
  userPassword //User's password in the db
) {
  console.log(candidatePassword, userPassword);
  console.log(await bcrypt.compare(candidatePassword, userPassword));
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
