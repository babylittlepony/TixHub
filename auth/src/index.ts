import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("YOOO");
});

app.listen(3000, () => {
  console.log("Auth on 3000");
});
