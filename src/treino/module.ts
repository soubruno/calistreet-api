// src/treino/module.ts

import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Treino } from './entity';
import { TreinoExercicio } from './treino-exercicio.entity';
import { TreinoService } from './service';
import { TreinoController } from './controller';
import { TreinoRepository } from './repository';
import { ExercicioModule } from '../exercicio/module';
import { UsuarioModule } from '../usuario/module';

@Module({
  imports: [
    SequelizeModule.forFeature([Treino, TreinoExercicio]),
    forwardRef(() => ExercicioModule), 
    forwardRef(() => UsuarioModule),
  ],
  controllers: [TreinoController],
  providers: [TreinoService, TreinoRepository],
  exports: [TreinoService, TreinoRepository, SequelizeModule], 
})
export class TreinoModule {}