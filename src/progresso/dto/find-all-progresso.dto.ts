import { IsOptional, IsDateString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'; 
import { StatusSessao } from '../entity';

export class FindAllProgressoDto extends PaginationQueryDto {
    
    @IsOptional()
    @IsUUID()
    @ApiProperty({ required: false, description: 'Filtra pelo ID do template de treino utilizado.' })
    declare treinoId?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'Filtra sessões iniciadas após esta data.', example: '2025-09-01' })
    declare dataMinima?: string;
    
    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, description: 'Filtra sessões finalizadas antes desta data.', example: '2025-10-31' })
    declare dataMaxima?: string;
    
    @IsOptional()
    @IsEnum(StatusSessao)
    @ApiProperty({ enum: StatusSessao, required: false, description: 'Filtra por status da sessão (CONCLUIDO, INTERROMPIDO).' })
    declare status?: StatusSessao;
}