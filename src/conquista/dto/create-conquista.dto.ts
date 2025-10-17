import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoConquista } from '../entity';

export class CreateConquistaDto {
  
  @IsString({ message: 'O título é obrigatório.' })
  @IsNotEmpty()
  @ApiProperty({ description: 'Nome da conquista.', example: 'Maratonista do Core' })
  declare titulo: string;

  @IsString()
  @ApiProperty({ description: 'Descrição da regra para desbloqueio.' })
  declare descricao: string;
  
  @IsEnum(TipoConquista, { message: 'Tipo de conquista inválido.' })
  @ApiProperty({ enum: TipoConquista, description: 'Tipo de evento/métrica que dispara o desbloqueio.' })
  declare tipo: TipoConquista;

  @IsString()
  @ApiProperty({ description: 'Parâmetro numérico ou string da regra (ex: "10" para 10 treinos).', example: '10' })
  declare regraParametro: string; 

  @IsOptional()
  @IsUrl()
  @ApiProperty({ required: false, description: 'URL do ícone ou imagem da conquista.' })
  declare iconeUrl?: string;
}