import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Progresso } from './entity';
import { ProgressoExercicio } from './progresso-exercicio.entity';
import { MedidaFisica } from './medida-fisica.entity';
import { ProgressoService } from './service';
import { ProgressoController } from './controller';
import { ProgressoRepository } from './repository';
import { UsuarioModule } from '../usuario/module';
import { TreinoModule } from '../treino/module';
import { ExercicioModule } from '../exercicio/module';
import { ConquistaModule } from '../conquista/module';

@Module({
  imports: [
    SequelizeModule.forFeature([Progresso, ProgressoExercicio, MedidaFisica]),
    
    forwardRef(() => UsuarioModule),
    forwardRef(() => TreinoModule),
    forwardRef(() => ExercicioModule),
    forwardRef(() => ConquistaModule),
  ],
  controllers: [ProgressoController],
  providers: [ProgressoService, ProgressoRepository],
  exports: [ProgressoService, ProgressoRepository, SequelizeModule], 
})
export class ProgressoModule {}