# 1단계: Node.js 기본 이미지를 사용합니다.
FROM node:20

# 2단계: 작업 디렉터리를 설정합니다.
WORKDIR /app

# 3단계: package 파일을 복사하고 의존성을 설치합니다.
COPY package*.json ./

RUN npm install --legacy-peer-deps

# 4단계: 애플리케이션 소스 코드를 복사합니다.
COPY . .

# 5단계: 애플리케이션을 빌드합니다.
RUN npm run build

# 6단계: 애플리케이션이 실행될 포트를 공개합니다.
EXPOSE 3000

# 7단계: 프로덕션 모드에서 애플리케이션을 시작합니다.
CMD ["npm", "run", "start"]
