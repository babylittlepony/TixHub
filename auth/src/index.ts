import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/users/currentuser", (req, res) => {
  res.send("YOOO");
});

app.listen(3000, () => {
  console.log("Auth on 3000, v6");
});
