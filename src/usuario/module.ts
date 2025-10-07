import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Usuario } from './entity';
import { UsuarioService } from './service';
import { UsuarioController } from './controller';
import { UsuarioRepository } from './repository'; // Importação do Repository

@Module({
  imports: [
    // Registra a entidade no módulo
    SequelizeModule.forFeature([Usuario]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioRepository],
  // Exporta o serviço para que o Módulo de Autenticação possa usá-lo
  exports: [SequelizeModule, UsuarioService, UsuarioRepository],
})
export class UsuarioModule {}