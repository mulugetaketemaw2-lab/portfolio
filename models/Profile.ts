import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Mulugeta Ketemaw",
  },
  summary: {
    type: String,
    default: "A motivated and dedicated Information Technology graduate with strong skills in web development and software systems.",
  },
  professionalSummary: {
    type: String,
    default: "Experienced in developing applications using modern technologies such as React, Node.js, and MongoDB. Passionate about problem solving, research, and innovation, with proven achievement in competitive projects.",
  },
  phone: {
    type: String,
    default: "+251 915 942 488",
  },
  email: {
    type: String,
    default: "mulugetaketemaw2@gmail.com",
  },
  location: {
    type: String,
    default: "Addis Ababa, Ethiopia",
  },
  imageUrl: {
    type: String,
    default: "/profile-final.png",
  },
  cvUrl: {
    type: String,
    default: "/cv.pdf",
  },
});

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
