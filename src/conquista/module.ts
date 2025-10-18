import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Conquista } from './entity';
import { UsuarioConquista } from './usuario-conquista.entity';
import { ConquistaService } from './service';
import { ConquistaController } from './controller';
import { ConquistaRepository } from './repository';
import { UsuarioModule } from '../usuario/module'; 

@Module({
  imports: [
    SequelizeModule.forFeature([Conquista, UsuarioConquista]),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [ConquistaController],
  providers: [ConquistaService, ConquistaRepository],
  exports: [ConquistaService, ConquistaRepository], 
})
export class ConquistaModule {}