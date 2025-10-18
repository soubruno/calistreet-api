import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'; 

export class FindAllProfissionaisDto extends PaginationQueryDto {
    
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra por cidade de atuação.' })
    cidade?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra por especialidade (Ex: Calistenia, Funcional).' })
    especialidade?: string;

    // Adicionar mais filtros específicos do Profissional aqui, se necessário
}