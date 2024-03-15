const http = require("http");
const app = require("./app/app");

const PORT = process.env.PORT || 6006;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
