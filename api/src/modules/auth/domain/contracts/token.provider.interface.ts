export interface TokenPayload{
    userId: string,
}

export interface TokenResponse{
    value: string,
    duration: number
}

export const ACCESS_TOKEN_EXPIRATION_MS = 900;
export const REFRESH_TOKEN_EXPIRATION_MS = 604800;

export interface TokenProviderInterface{
    generateAccessToken(payload: TokenPayload): Promise<TokenResponse>;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    generateRefreshToken(payload: TokenPayload): Promise<TokenResponse>;
    verifyRefreshToken(token: string): Promise<TokenPayload>;
}