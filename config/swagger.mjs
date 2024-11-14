// config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", 
    info: {
      title: "Q&A Platform API",
      version: "1.0.0",
      description: "A RESTful API for a Q&A platform",
    },
    servers: [
      {
        url: "http://localhost:4000", 
      },
    ],
  },
  apis: ["./routes/*.mjs"], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
