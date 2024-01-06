import { users, quotes } from "./db.js";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

const User = mongoose.model("User");
const Quote = mongoose.model("Quote");

const resolvers = {
  Query: {
    // users: () => users,
    users: async () => await User.find({}),
    user: async (_, { _id }) => await User.findOne({ _id }), //((user) => user._id == _id),
    quotes: async () => await Quote.find({}).populate("by", "_id, firstName"), //same as line 14
    iquote: async (_, { by }) => await Quote.find({ by }), //filter((quote) => quote.by == by),
  },
  User: {
    quotes: async (ur) => await Quote.find({ by: ur._id }), //filter((quote) => quote.by == ur._id),
  },

  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("User already eits with this email");
      }
      const hashedPassword = await bcrypt.hash(userNew.password, 12);

      const newUser = new User({
        ...userNew,
        password: hashedPassword,
      });

      return await newUser.save();
    },
    signinUser: async (_, { userSignin }) => {
      const user = await User.findOne({ email: userSignin.email });
      if (!user) {
        throw new Error("User doesn't exists with this email");
      }

      const doMatch = await bcrypt.compare(userSignin.password, user.password);
      if (!doMatch) {
        throw new Error("email or password is invalid");
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      return { token };
    },
    createQuote: (_, { name }, { userId }) => {
      if (!userId) throw new Error("You must logged in");

      const newQuote = new Quote({
        name,
        by: userId,
      });

      newQuote.save();
      return "Quote saved successfully";
    },
  },
};

export default resolvers;
