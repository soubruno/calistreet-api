import { PartialType } from '@nestjs/mapped-types';
import { CreateExercicioDto } from './create-exercicio.dto';

// Torna todas as propriedades de CreateExercicioDto opcionais para operações de PUT/PATCH
export class UpdateExercicioDto extends PartialType(CreateExercicioDto) {}