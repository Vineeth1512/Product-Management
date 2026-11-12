import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas using Mongoose
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("[Database Error] MONGO_URI is missing from your .env file.");
    process.exit(1);
  }

  if (mongoUri.includes("<username>") || mongoUri.includes("<password>")) {
    console.warn(
      "\n⚠️  [Database Notice] You are using placeholder credentials in backend/.env." +
      "\n👉 Please update MONGO_URI with your actual MongoDB Atlas connection string." +
      "\n   Example: mongodb+srv://myUser:myPassword@cluster0.abcde.mongodb.net/product_db?retryWrites=true&w=majority\n"
    );
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    console.error(
      "👉 Tips to resolve:\n" +
      "   1. Verify your MongoDB Atlas username and password in .env.\n" +
      "   2. Ensure IP '0.0.0.0/0' (Allow Access from Anywhere) is whitelisted in Atlas Network Access.\n" +
      "   3. Check your internet connection.\n"
    );
    process.exit(1);
  }
};

export default connectDB;
