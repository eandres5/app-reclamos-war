export interface LoginRequest {
  identificacion: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  identificacion: string;
  nombres: string;
  apellidos: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}
