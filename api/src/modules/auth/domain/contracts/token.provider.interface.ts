export interface TokenPayload{
    sub: string,
    sessionId: string,
}

export interface TokenResponse{
    value: string,
    duration: number
}

export interface TokenProviderInterface{
    generateAccessToken(payload: TokenPayload): Promise<TokenResponse>;
    verifyAccessToken(token: string): Promise<TokenPayload>;
    generateRefreshToken(payload: TokenPayload): Promise<TokenResponse>;
    verifyRefreshToken(token: string): Promise<TokenPayload>;
}