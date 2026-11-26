import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "../guards/authentication.guard";

export function Authenticated(){
    return applyDecorators(
        UseGuards(AuthenticationGuard)
    )
}