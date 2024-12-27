const swaggerJsDoc = require("swagger-jsdoc");

if (process.env.ENABLE_SWAGGER === "true") {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Express API with Swagger",
        version: "1.0.0",
        description: "API 문서입니다.",
      },
      servers: [
        {
          url: "http://localhost:5000",
        },
      ],
    },
    apis: ["./router/*.js"], // 라우트 파일에서 주석을 검색
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  module.exports = swaggerDocs;
} else {
  console.log("Swagger is disabled in this environment.");
  module.exports = null; // Swagger를 비활성화
}
