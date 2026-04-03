require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const app = require("./app");
const { seedDatabase } = require("./utils/seed");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task_management_app";

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = startServer;
