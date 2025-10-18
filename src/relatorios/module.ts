import { Module } from '@nestjs/common';
import { RelatoriosController } from './controller';
import { RelatoriosService } from './service';
import { ProgressoModule } from '../progresso/module'; // Para acessar estatísticas
import { UsuarioModule } from '../usuario/module'; // Para acessar dados de usuários
import { TreinoModule } from '../treino/module';

@Module({
  imports: [
    // Importamos os módulos que contêm os dados e Services que precisamos
    ProgressoModule,
    UsuarioModule,
    TreinoModule,
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
  // Não precisa exportar, pois é o módulo final de leitura.
})
export class RelatoriosModule {}