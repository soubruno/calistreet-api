// src/usuario/dto/find-all-usuario.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'; // Importa a base

// DTO para filtros de usuários (herda paginação)
export class FindAllUsuariosDto extends PaginationQueryDto {
    
    // Filtro 1 (Requisito 2: Filtro em pelo menos uma coluna)
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra usuários pelo nome (busca parcial).' })
    nome?: string;

    // Filtro 2 (Adicional)
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra usuários por gênero.' })
    genero?: string;
    
    // Filtro 3 (Adicional)
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra usuários pelo e-mail (busca parcial).' })
    email?: string;
}