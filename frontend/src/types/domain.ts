type UserCredentials = {
  id: string;
  password: string;
};

type RegisterInfo = UserCredentials & {
  confirmPassword: string;
  api: string;
};

type LoginInfo = UserCredentials;

type ResponseToken = {
  accessToken: string;
};

type ProcessInfo = {
  image: string;
};

export type { UserCredentials, RegisterInfo, LoginInfo, ResponseToken, ProcessInfo };
