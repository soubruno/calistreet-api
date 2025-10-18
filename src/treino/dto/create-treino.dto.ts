import { IsNotEmpty, IsString, IsEnum, IsOptional, IsArray, ValidateNested, IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Nivel } from '../../usuario/entity';

export class TreinoItemDto {
    @IsUUID()
    @ApiProperty({ description: 'ID do exercício do catálogo.' })
    declare exercicioId: string;
    
    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Ordem de execução.' })
    declare ordem: number;

    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Número de séries a serem executadas.' })
    declare series: number;

    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Número de repetições por série.' })
    declare repeticoes: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @ApiProperty({ required: false, description: 'Tempo de descanso entre séries (em segundos).' })
    declare descansoSegundos?: number;
}


export class CreateTreinoDto {
    @IsString({ message: 'O nome do treino é obrigatório.' })
    @IsNotEmpty()
    @ApiProperty({ description: 'Nome do plano de treino.' })
    declare nome: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Descrição detalhada do treino.' })
    declare descricao?: string;

    @IsEnum(Nivel)
    @ApiProperty({ enum: Nivel, description: 'Nível de dificuldade do treino.' })
    declare nivel: Nivel;

    @IsOptional()
    @ApiProperty({ required: false, description: 'Se o treino é um template para uso público. Requer ADMIN/PROFISSIONAL.' })
    declare isTemplate?: boolean;
    
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TreinoItemDto)
    @ApiProperty({ type: [TreinoItemDto], description: 'Lista de exercícios com prescrição (séries/reps).' })
    declare itens: TreinoItemDto[];
}