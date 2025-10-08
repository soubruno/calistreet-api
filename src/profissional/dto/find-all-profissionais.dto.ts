// src/profissional/dto/find-all-profissionais.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// IMPORTANTE: Assumimos que o caminho para a base de Paginação é este:
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'; 

/**
 * DTO para listagem de Profissionais.
 * Herda a Paginação (page, limit) e adiciona filtros específicos.
 */
export class FindAllProfissionaisDto extends PaginationQueryDto {
    
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra por cidade de atuação.' })
    cidade?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra por especialidade (Ex: Calistenia, Funcional).' })
    especialidade?: string;

    // Você pode adicionar mais filtros específicos do Profissional aqui, se necessário
}