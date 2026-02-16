// Hostinger Passenger entry point
// Set this as "Application startup file" in Hostinger hPanel → Node.js
const path = require("path");
process.chdir(path.join(__dirname, "server"));
require("./server/server.js");
