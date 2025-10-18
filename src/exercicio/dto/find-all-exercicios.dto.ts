import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'; 
import { GrupoMuscular, SubgrupoMuscular } from '../entity';

export class FindAllExerciciosDto extends PaginationQueryDto {
    
    @IsOptional()
    @IsEnum(GrupoMuscular)
    @ApiProperty({ enum: GrupoMuscular, required: false, description: 'Filtra por grupo muscular principal.' })
    declare grupoMuscular?: GrupoMuscular;

    @IsOptional()
    @IsEnum(SubgrupoMuscular)
    @ApiProperty({ enum: SubgrupoMuscular, required: false, description: 'Filtra por subgrupo muscular (ex: OMBRO).' })
    declare subgrupoMuscular?: SubgrupoMuscular;
    
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra por nome (busca parcial).' })
    declare nome?: string;
    
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Filtra por equipamentos necessários (ex: "argolas").' })
    declare equipamentos?: string;
}