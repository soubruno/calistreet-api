import { PartialType } from '@nestjs/mapped-types';
import { CreateProgressoDto } from './create-progresso.dto';
import { ProgressoExercicioDto } from './progresso-exercicio.dto';
import { IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProgressoDto extends PartialType(CreateProgressoDto) {
    
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProgressoExercicioDto)
    @ApiProperty({ 
        type: [ProgressoExercicioDto], 
        required: false, 
        description: 'Lista completa de resultados de exercícios para substituição total.' 
    })
    declare resultadosExercicios?: ProgressoExercicioDto[];
}