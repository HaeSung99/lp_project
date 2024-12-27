# Express를 실행하기 위한 Node.js 이미지
FROM node:20

# 작업 디렉토리 설정
WORKDIR /app

# 프로덕션 환경 설정
ENV NODE_ENV=production

# 종속성 설치를 위한 package.json 복사
COPY package*.json ./

RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 컨테이너 실행 명령
CMD ["npm", "run", "start"]