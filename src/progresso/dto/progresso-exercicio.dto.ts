import { IsUUID, IsInt, Min, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProgressoExercicioDto {
    
    @IsUUID()
    @ApiProperty({ description: 'ID do exercício do catálogo.' })
    declare exercicioId: string;
    
    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Ordem de execução na sessão.' })
    declare ordem: number;

    @IsInt()
    @Min(0)
    @ApiProperty({ description: 'Número de séries realmente concluídas.' })
    declare seriesFeitas: number;
    
    @IsString()
    @ApiProperty({ description: 'Repetições feitas em cada série (ex: "10, 10, 8" para séries com falha).' })
    declare repeticoesFeitas: string;
    
    @IsOptional()
    @IsNumber()
    @Min(0)
    @ApiProperty({ required: false, description: 'Carga adicional utilizada (em Kg).', default: 0 })
    declare cargaUtilizadaKg?: number; 

    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ required: false, description: 'Tempo total gasto no exercício (em segundos).', default: 0 })
    declare tempoTotalSegundos?: number;
}