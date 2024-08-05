const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const routes = require("./Routes");
app.use("/api/v1", routes);

const port = process.env.PORT;
app.get("/", (req, res) => {
    res.send("Hello World! I am a server");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
