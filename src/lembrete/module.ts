// src/lembrete/module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lembrete } from './entity';
import { LembreteService } from './service';
import { LembreteController } from './controller';
import { LembreteRepository } from './repository';
import { UsuarioModule } from '../usuario/module';

@Module({
  imports: [
    SequelizeModule.forFeature([Lembrete]),
    UsuarioModule, 
  ],
  controllers: [LembreteController],
  providers: [LembreteService, LembreteRepository],
  exports: [LembreteService, LembreteRepository], 
})
export class LembreteModule {}