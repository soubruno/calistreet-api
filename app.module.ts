import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

// Entidades Base
import { Usuario } from './usuario/entity';
import { Profissional } from './profissional/profissional.entity';

// Treino e Exercício
import { Exercicio } from './exercicio/exercicio.entity';
import { Treino } from './treino/treino.entity';
import { TreinoExercicio } from './treino/treino-exercicio.entity';
import { UsuarioExercicioFavorito } from './exercicio/usuario-exercicio-favorito.entity';

// Progresso e Histórico
import { Progresso } from './progresso/progresso.entity';
import { ProgressoExercicio } from './progresso/progresso-exercicio.entity';
import { MedidaFisica } from './progresso/medida-fisica.entity';
import { Lembrete } from './lembrete/lembrete.entity';

// Conquistas
import { Conquista } from './conquista/conquista.entity';
import { UsuarioConquista } from './conquista/usuario-conquista.entity';


// -------------------------------------------------------------------------
// 2. IMPORTAÇÃO DOS MÓDULOS DE FUNCIONALIDADE
// -------------------------------------------------------------------------

import { UsuarioModule } from './usuario/module';
import { ProfissionalModule } from './profissional/profissional.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    // Módulo para carregar o arquivo .env
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('PGHOST'),
        port: configService.get<number>('PGPORT'),
        username: configService.get('PGUSER'),
        password: configService.get('PGPASSWORD'),
        database: configService.get('PGDATABASE'),
        logging: true, // Habilita logs do Sequelize
        autoLoadModels: true, 
        synchronize: true, 
        alter: true,
        define: {
          underscored: true, 
        },
        
        // Lista de todas as entidades do projeto
        models: [
          Usuario, 
          Profissional, 
          Exercicio, 
          Treino, 
          TreinoExercicio,
          UsuarioExercicioFavorito,
          Progresso,
          ProgressoExercicio,
          MedidaFisica,
          Lembrete,
          Conquista,
          UsuarioConquista,
        ],
      }),
    }),
    
    // Módulos de Funcionalidade
    UsuarioModule,
    ProfissionalModule,
    AuthModule,
  ]
})
export class AppModule {}