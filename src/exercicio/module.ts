import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exercicio } from './entity';
import { UsuarioExercicioFavorito } from './usuario-exercicio-favorito.entity';
import { ExercicioService } from './service'; 
import { ExercicioController } from './controller'; 
import { ExercicioRepository } from './repository'; 

@Module({
  imports: [
    SequelizeModule.forFeature([Exercicio, UsuarioExercicioFavorito]),
  ],
  controllers: [ExercicioController],
  providers: [ExercicioService, ExercicioRepository],
  exports: [ExercicioService, ExercicioRepository],
})
export class ExercicioModule {}