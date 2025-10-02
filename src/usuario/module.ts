import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Usuario } from './entity';
import { UsuarioService } from './service';
import { UsuarioController } from './controller';

@Module({
  imports: [
    // Registra a entidade no módulo
    SequelizeModule.forFeature([Usuario]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  // Exporta o serviço para que o Módulo de Autenticação possa usá-lo
  exports: [SequelizeModule, UsuarioService], 
})
export class UsuarioModule {}