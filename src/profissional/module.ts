// src/profissional/module.ts

import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profissional } from './entity';
import { ProfissionalService } from './service';
import { ProfissionalController } from './controller';
import { ProfissionalRepository } from './repository';
import { UsuarioModule } from '../usuario/module'; // Necessário para UsuarioService

@Module({
  imports: [
    SequelizeModule.forFeature([Profissional]),
    forwardRef(() => UsuarioModule), // Importa o módulo de Usuário para usar UsuarioService
  ],
  controllers: [ProfissionalController],
  providers: [ProfissionalService, ProfissionalRepository],
  exports: [ProfissionalService, ProfissionalRepository],
})
export class ProfissionalModule {}