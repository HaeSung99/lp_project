const express = require('express');
const router = express.Router();
const db = require('../config/db'); // MySQL 연결 가져오기

// NODE_ENV 설정 확인
const isProduction = process.env.NODE_ENV === "production";

// 로그 출력 함수
const log = (...args) => {
  if (!isProduction) {
    console.log(...args);
  }
};

/**
 * @swagger
 * /userdata:
 *   get:
 *     summary: "메인 페이지 통계 조회"
 *     description: "가입된 유저 수, 블랙리스트 관련 통계, 방문자 통계를 조회합니다."
 *     tags: [Userdata]
 *     responses:
 *       200:
 *         description: "메인 페이지 통계 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 가입된유저수:
 *                   type: integer
 *                   example: 1234
 *                 블랙리스트등록된유저수:
 *                   type: integer
 *                   example: 456
 *                 오늘블랙리스트등록된유저수:
 *                   type: integer
 *                   example: 12
 *                 블랙리스트명단작성수:
 *                   type: integer
 *                   example: 78
 *                 오늘블랙리스트명단작성수:
 *                   type: integer
 *                   example: 3
 *                 오늘방문자수:
 *                   type: integer
 *                   example: 99
 *       500:
 *         description: "서버 오류"
 */


// 유틸 함수: 오늘 날짜 포맷팅
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().slice(0, 10); // "YYYY-MM-DD" 형식으로 반환
};

// 메인 페이지 라우트
router.get('/', async (req, res) => {
  try {
    const today = getTodayDate();

    // 방문자 기록
    const visitorId = `${req.ip}-${req.headers['user-agent']}`; // IP와 User-Agent를 결합
    const userAgent = req.headers['user-agent'] || 'unknown';

    await db.query(
      'INSERT INTO Visitors (visitorId, ipAddress, userAgent, visitedAt) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE visitedAt = NOW()',
      [visitorId, req.ip, userAgent]
    );

    log('Visitor recorded:', visitorId);

    // 통계 데이터 수집
    const [[{ count: 가입된유저수 }]] = await db.query(
      'SELECT COUNT(*) AS count FROM User WHERE deletedAt IS NULL'
    );
    const [[{ count: 블랙리스트등록된유저수 }]] = await db.query(
      'SELECT COUNT(*) AS count FROM Blacklist'
    );
    const [[{ count: 오늘블랙리스트등록된유저수 }]] = await db.query(
      'SELECT COUNT(*) AS count FROM Blacklist WHERE DATE(created_at) = ?',
      [today]
    );
    const [[{ count: 블랙리스트명단작성수 }]] = await db.query(
      'SELECT COUNT(*) AS count FROM Posts'
    );
    const [[{ count: 오늘블랙리스트명단작성수 }]] = await db.query(
      'SELECT COUNT(*) AS count FROM Posts WHERE DATE(created_at) = ?',
      [today]
    );
    const [[{ count: 오늘방문자수 }]] = await db.query(
      'SELECT COUNT(DISTINCT visitorId) AS count FROM Visitors WHERE DATE(visitedAt) = ?',
      [today]
    );

    // 응답 데이터 구성
    const responseData = {
      가입된유저수,
      블랙리스트등록된유저수,
      오늘블랙리스트등록된유저수,
      블랙리스트명단작성수,
      오늘블랙리스트명단작성수,
      오늘방문자수,
    };

    log('Response data:', responseData);

    // JSON 응답 반환
    res.status(200).json(responseData);
  } catch (error) {
    console.error(
      'Error handling main page request:',
      isProduction ? error.message : error
    );
    res.status(500).json({
      error: isProduction ? '서버에서 문제가 발생했습니다.' : error.message,
    });
  }
});

module.exports = router;