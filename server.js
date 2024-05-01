const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
/*MongoDB connection for ATLAS */
const DB = process.env.DATABASE.replace(
"PASSWORD",
process.env.DATABASE_PASSWORD
);

mongoose.connect(DB)
    .then((con) => {
        console.log("DB connection succesful");
    })
    .catch((error) => console.log(error));

const port = 4001;
app.listen(port, () => {
    console.log(`App running on port ${port} ..`);
});