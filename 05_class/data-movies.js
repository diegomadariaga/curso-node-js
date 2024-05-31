import { createRequire } from "module";
const require = createRequire(import.meta.url);
const movies = require("./movies.json");

export default movies;
