const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Url Monitoring API",
      version: "1.0.0",
      description: "Simple URL monitoring REST API"
    },
    servers: [
      {
        url: "http://localhost:8080"
      }
    ],
  },
  apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
