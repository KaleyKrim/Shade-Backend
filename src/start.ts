import { app } from "./server";
const PORT = require(`../config/${process.env.NODE_ENV}`).PORT;

app.listen(PORT);
