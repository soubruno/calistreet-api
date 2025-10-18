import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Usuario } from './entity';
import { UsuarioService } from './service';
import { UsuarioController } from './controller';
import { UsuarioRepository } from './repository';

@Module({
  imports: [
    SequelizeModule.forFeature([Usuario]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioRepository],
  exports: [SequelizeModule, UsuarioService, UsuarioRepository],
})
export class UsuarioModule {}