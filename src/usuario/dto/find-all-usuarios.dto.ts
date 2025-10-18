import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FindAllUsuariosDto extends PaginationQueryDto {
    
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra usuários pelo nome (busca parcial).' })
    nome?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra usuários por gênero.' })
    genero?: string;
    
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra usuários pelo e-mail (busca parcial).' })
    email?: string;
}