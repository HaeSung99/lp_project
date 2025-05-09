const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs"); // YAML 파일 로드 패키지
const cookieParser = require('cookie-parser');

const swaggerDocs = YAML.load('./swagger.yaml'); // swagger.yaml 파일 로드

const visitorTracker = require('./middleware/visitorTracker');
const swaggerAuth = require('./middleware/swaggerAuth');

app.use(cookieParser());
app.use(express.json({ limit: '50mb' })); // POST 요청의 JSON 데이터 파싱
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS 설정
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
}));

// Swagger UI 연결
app.use(
  "/api-docs",
  swaggerAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    explorer: true // ✅ 이 옵션이 있어야 서버 드롭다운이 보여요!
  })
);

// 라우터 관리 부분
const testRouter = require("./router/test");
const partyRouter = require("./router/party");
const blacklistRouter = require("./router/blacklist");
const userdataRouter = require("./router/userdata");

app.use("/product", testRouter);
app.use("/ex/party", partyRouter);
app.use("/api/blacklist", blacklistRouter);
app.use("/userdata", visitorTracker, userdataRouter);

// 서버 실행
app.listen(5000, '0.0.0.0', () => {
  console.log('Express 서버가 http://localhost:5000 에서 실행 중입니다.');
  console.log('API documentation available at http://localhost:5000/api-docs');
});
