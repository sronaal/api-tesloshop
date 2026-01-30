import { Type } from "class-transformer"
import { IsInt, IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDTO{

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit?: number

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(0)
    offset?: number
}