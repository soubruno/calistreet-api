import { IsOptional, IsEnum, IsUUID, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'; 
import { Nivel } from '../../usuario/entity'; 

/**
 * DTO para listagem de Treinos.
 * Herda a Paginação (page, limit).
 */
export class FindAllTreinosDto extends PaginationQueryDto {
    
    @IsOptional()
    @IsEnum(Nivel)
    @ApiProperty({ enum: Nivel, required: false, description: 'Filtra por nível de dificuldade.' })
    declare nivel?: Nivel;
    
    @IsOptional()
    @IsUUID()
    @ApiProperty({ required: false, description: 'Filtra por treinos criados por um usuário específico.' })
    declare usuarioId?: string;
    
    @IsOptional()
    @IsString() 
    @ApiProperty({ required: false, description: 'Filtra por status de template ("true" ou "false").' })
    declare isTemplate?: string;
}