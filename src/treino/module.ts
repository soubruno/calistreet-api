// src/treino/module.ts

import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Treino } from './entity';
import { TreinoExercicio } from './treino-exercicio.entity';
import { TreinoService } from './service';
import { TreinoController } from './controller';
import { TreinoRepository } from './repository';
import { ExercicioModule } from '../exercicio/module'; // Importa o Módulo Exercício
import { UsuarioModule } from '../usuario/module';

@Module({
  imports: [
    // 1. Registra as entidades de Treino e Junção
    SequelizeModule.forFeature([Treino, TreinoExercicio]),
    
    // 2. CRÍTICO: Usa forwardRef para o Módulo Exercício
    // Isso evita uma possível dependência circular, caso o Módulo Exercício
    // precise futuramente saber dos Treinos (ex: para relatórios).
    forwardRef(() => ExercicioModule), 
    forwardRef(() => UsuarioModule),
  ],
  controllers: [TreinoController],
  providers: [TreinoService, TreinoRepository],
  // Exportamos Service e Repository, pois o futuro Módulo Progresso precisará deles
  exports: [TreinoService, TreinoRepository, SequelizeModule], 
})
export class TreinoModule {}