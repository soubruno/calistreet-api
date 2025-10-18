import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GrupoMuscular, SubgrupoMuscular } from '../entity';

export class CreateExercicioDto {
  
  @IsString({ message: 'O nome é obrigatório.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  @ApiProperty({ description: 'Nome único do exercício.', example: 'Flexão de Braço Diamante' })
  declare nome: string;

  @IsString({ message: 'A descrição é obrigatória.' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia.' })
  @ApiProperty({ description: 'Instruções de execução.' })
  declare descricao: string;
  
  @IsEnum(GrupoMuscular, { message: 'Grupo muscular inválido.' })
  @ApiProperty({ enum: GrupoMuscular, description: 'Grupo muscular principal (SUPERIOR, CORE, INFERIOR).' })
  declare grupoMuscular: GrupoMuscular;

  @IsOptional()
  @IsEnum(SubgrupoMuscular, { message: 'Subgrupo muscular inválido.' })
  @ApiProperty({ enum: SubgrupoMuscular, required: false, description: 'Subgrupo muscular (ex: PEITO, OMBRO).' })
  declare subgrupoMuscular?: SubgrupoMuscular;
  
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Equipamentos necessários (separados por vírgula).', example: 'argolas, paralela' })
  declare equipamentosNecessarios?: string;
  
  @IsOptional()
  @IsUrl({}, { message: 'A URL do vídeo deve ser válida.' })
  @ApiProperty({ required: false, description: 'Link para vídeo de demonstração.' })
  declare videoUrl?: string;
}