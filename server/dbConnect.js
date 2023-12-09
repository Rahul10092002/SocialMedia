const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri = `mongodb+srv://rahulpatidar1009:rahul1009@cluster0.rgb1bke.mongodb.net/?retryWrites=true&w=majority`;

  try {
    const connect = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`mongodb connected:${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
