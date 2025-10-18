import { Module } from '@nestjs/common';
import { RelatoriosController } from './controller';
import { RelatoriosService } from './service';
import { ProgressoModule } from '../progresso/module';
import { UsuarioModule } from '../usuario/module';
import { TreinoModule } from '../treino/module';

@Module({
  imports: [
    ProgressoModule,
    UsuarioModule,
    TreinoModule,
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}