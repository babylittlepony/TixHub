import mongoose from "mongoose";

import { app } from "./app";

/*---------------Start Database---------------*/
const startDB = async () => {
  const url = "mongodb://auth-mongo-srv:27017/auth";
  if (!process.env.jwt_key) {
    throw new Error("jwt secret key not found");
  }
  try {
    await mongoose.connect(url);
    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};
/*---------------Start Database---------------*/

/*---------------Start Server---------------*/
app.listen(3000, () => {
  console.log("Auth on 3000, v20");
  startDB();
});
/*---------------Start Server---------------*/
