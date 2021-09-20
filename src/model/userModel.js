const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please Enter a name"] },
  email: {
    type: String,
    unique: true,
    required: [true, "Please Enter an email address"],
  },
  password: {
    type: String,
    min: 6,
    max: 50,
    required: [true, "Please Enter a Password"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    // only works on save or create;
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  createdAt: { type: Date, default: Date.now() },
});

userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;

  next();
});

userSchema.methods.validatePassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
