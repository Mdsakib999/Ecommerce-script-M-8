import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/homiara";

const checkDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB...");

    const count = await Product.countDocuments();
    console.log(`Total products in DB: ${count}`);

    const sample = await Product.findOne({ name: /Abstract Golden Sun/i });
    if (sample) {
      console.log("Found sample product:", sample.name);
      console.log("Category:", sample.category);
    } else {
      console.log("Sample product NOT found.");
    }

    const categories = await Product.distinct("category");
    console.log("Categories in DB:", categories);

    process.exit();
  } catch (error) {
    console.error("Error during check:", error);
    process.exit(1);
  }
};

checkDB();
