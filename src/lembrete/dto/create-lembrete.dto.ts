import { IsNotEmpty, IsString, IsEnum, IsBoolean, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiaSemana } from '../entity';

export class CreateLembreteDto {
  
  @IsString({ message: 'O título é obrigatório.' })
  @IsNotEmpty()
  @ApiProperty({ description: 'Título do lembrete (o texto da notificação).', example: 'Lembrete de Hidratação' })
  declare titulo: string;

  @IsEnum(DiaSemana, { message: 'Dia da semana inválido.' })
  @ApiProperty({ enum: DiaSemana, description: 'Dia da semana para o lembrete.', example: DiaSemana.TERCA })
  declare diaSemana: DiaSemana;

  @IsString({ message: 'O horário é obrigatório.' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'O formato da hora deve ser HH:MM.' })
  @ApiProperty({ description: 'Horário do dia para envio (formato HH:MM).', example: '19:30' })
  declare hora: string; 

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false, description: 'Se o lembrete está ativo.', default: true })
  declare ativo?: boolean;
}