import { PartialType } from '@nestjs/mapped-types';
import { CreateProgressoDto } from './create-progresso.dto';
import { ProgressoExercicioDto } from './progresso-exercicio.dto';
import { IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para atualização parcial de uma Sessão de Progresso.
 * Herda CreateProgressoDto e torna todos os campos opcionais.
 */
export class UpdateProgressoDto extends PartialType(CreateProgressoDto) {
    
    // Sobrescrevemos 'resultadosExercicios' para garantir que a atualização
    // de sub-recursos (itens) seja tratada separadamente, se necessário.
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