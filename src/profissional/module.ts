import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profissional } from './entity';
import { ProfissionalService } from './service';
import { ProfissionalController } from './controller';
import { ProfissionalRepository } from './repository';
import { UsuarioModule } from '../usuario/module';

@Module({
  imports: [
    SequelizeModule.forFeature([Profissional]),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [ProfissionalController],
  providers: [ProfissionalService, ProfissionalRepository],
  exports: [ProfissionalService, ProfissionalRepository],
})
export class ProfissionalModule {}