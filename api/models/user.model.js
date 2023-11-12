import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-stickers%2Fcat&psig=AOvVaw2MCThuu6NHnxIGc5SFXZZk&ust=1699853067341000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPDu26PcvYIDFQAAAAAdAAAAABAJ"
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model('User', userSchema);

export default User;