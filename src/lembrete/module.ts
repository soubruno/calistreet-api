// src/lembrete/module.ts

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lembrete } from './entity';
import { LembreteService } from './service';
import { LembreteController } from './controller';
import { LembreteRepository } from './repository';
import { UsuarioModule } from '../usuario/module'; // Importado para garantir a injeção do Usuario

@Module({
  imports: [
    // 1. Registra a entidade Lembrete
    SequelizeModule.forFeature([Lembrete]),
    // 2. Importa o módulo de Usuário (opcional, mas bom para coesão)
    UsuarioModule, 
  ],
  controllers: [LembreteController],
  providers: [LembreteService, LembreteRepository],
  exports: [LembreteService, LembreteRepository], 
})
export class LembreteModule {}