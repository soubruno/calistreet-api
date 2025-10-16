import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Progresso } from './entity';
import { ProgressoExercicio } from './progresso-exercicio.entity';
import { MedidaFisica } from './medida-fisica.entity';
import { ProgressoService } from './service';
import { ProgressoController } from './controller';
import { ProgressoRepository } from './repository';
import { UsuarioModule } from '../usuario/module'; // Necessário para MedidaFisica
import { TreinoModule } from '../treino/module'; // Necessário para relacionamentos e dados de Treino
import { ExercicioModule } from '../exercicio/module'; // Necessário para resultados de exercícios

@Module({
  imports: [
    // 1. Registra as entidades do módulo Progresso
    SequelizeModule.forFeature([Progresso, ProgressoExercicio, MedidaFisica]),
    
    // 2. Importações CRÍTICAS (usando forwardRef para evitar ciclos)
    forwardRef(() => UsuarioModule),
    forwardRef(() => TreinoModule),
    forwardRef(() => ExercicioModule),
  ],
  controllers: [ProgressoController],
  providers: [ProgressoService, ProgressoRepository],
  // Exporta o Service e Repository para os futuros módulos (ex: Relatórios)
  exports: [ProgressoService, ProgressoRepository, SequelizeModule], 
})
export class ProgressoModule {}