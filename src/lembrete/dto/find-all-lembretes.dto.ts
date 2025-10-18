import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'; 
import { DiaSemana } from '../entity';

export class FindAllLembretesDto extends PaginationQueryDto {
    
    @IsOptional()
    @IsEnum(DiaSemana)
    @ApiProperty({ enum: DiaSemana, required: false, description: 'Filtra por dia da semana.' })
    declare diaSemana?: DiaSemana;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra por horário (Ex: 19:00).' })
    declare hora?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra por status (ativo: true/false).' })
    declare ativo?: string;
}