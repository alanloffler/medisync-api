export interface IPayload {
  _id: string;
  email: string;
  role: string;
  tokens: ITokens;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
