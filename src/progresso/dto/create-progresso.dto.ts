import { IsUUID, IsString, IsOptional, IsArray, ValidateNested, IsDateString, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StatusSessao } from '../entity';
import { ProgressoExercicioDto } from './progresso-exercicio.dto';

export class CreateProgressoDto {

    @IsOptional()
    @IsUUID()
    @ApiProperty({ required: false, description: 'ID do treino (template) que foi executado. Opcional se for treino livre.' })
    declare treinoId?: string;

    @IsDateString()
    @ApiProperty({ description: 'Data e hora de início da sessão.', example: '2025-10-09T18:00:00Z' })
    declare dataInicio: string;

    @IsDateString()
    @ApiProperty({ description: 'Data e hora de fim da sessão.' })
    declare dataFim: string;

    @IsInt()
    @Min(0)
    @ApiProperty({ description: 'Duração total líquida do treino (em segundos).' })
    declare duracaoSegundos: number;

    @IsEnum(StatusSessao)
    @ApiProperty({ enum: StatusSessao, description: 'Status final da sessão.', default: StatusSessao.CONCLUIDO })
    declare status: StatusSessao;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Notas ou sentimentos sobre a sessão.' })
    declare notas?: string;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProgressoExercicioDto)
    @ApiProperty({ type: [ProgressoExercicioDto], description: 'Lista de exercícios executados e seus resultados.' })
    declare resultadosExercicios: ProgressoExercicioDto[];
}