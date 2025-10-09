import { PartialType } from '@nestjs/mapped-types';
import { CreateTreinoDto } from './create-treino.dto';

// Permite a atualização parcial de qualquer campo do Treino
export class UpdateTreinoDto extends PartialType(CreateTreinoDto) {}