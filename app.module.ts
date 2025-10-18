import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './src/auth/module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

// -------------------------------------------------------------------------
// 1. IMPORTAÇÃO DE TODAS AS ENTIDADES (MODELS) PARA O SEQUELIZE
// -------------------------------------------------------------------------

// Entidades Base
import { Usuario } from './src/usuario/entity';
import { Profissional } from './src/profissional/entity';

// Treino e Exercício
import { Exercicio } from './src/exercicio/entity';
import { Treino } from './src/treino/entity';
import { TreinoExercicio } from './src/treino/treino-exercicio.entity';
import { UsuarioExercicioFavorito } from './src/exercicio/usuario-exercicio-favorito.entity';

// Progresso e Histórico
import { Progresso } from './src/progresso/entity';
import { ProgressoExercicio } from './src/progresso/progresso-exercicio.entity';
import { MedidaFisica } from './src/progresso/medida-fisica.entity';
import { Lembrete } from './src/lembrete/entity';

// Conquistas
import { Conquista } from './src/conquista/entity';
import { UsuarioConquista } from './src/conquista/usuario-conquista.entity';

// Relatórios
import { RelatoriosModule } from './src/relatorios/module';

// -------------------------------------------------------------------------
// 2. IMPORTAÇÃO DOS MÓDULOS DE FUNCIONALIDADE
// -------------------------------------------------------------------------

import { UsuarioModule } from './src/usuario/module';
import { ProfissionalModule } from './src/profissional/module';
import { ExercicioModule } from './src/exercicio/module';
import { TreinoModule } from './src/treino/module';
import { ProgressoModule } from './src/progresso/module';
import { LembreteModule } from './src/lembrete/module';
import { ConquistaModule } from './src/conquista/module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigService disponível em toda a aplicação
    }),
    
    // Configuração Assíncrona do Sequelize (lendo do ConfigService)
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
        
        // Configurações do Sequelize
        autoLoadModels: true,
        synchronize: true,
        alter: true,
        define: {
          underscored: true, // Usa snake_case no banco de dados (ex: created_at)
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

    // Configuração do Cache com Redis
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST') || 'localhost',
        port: configService.get('REDIS_PORT') || 6379,
        ttl: 60000, // 60 segundos de tempo de vida do cache por padrão
      }),
    }),
    
    EventEmitterModule.forRoot(),
    UsuarioModule,
    ProfissionalModule,
    RelatoriosModule,
    AuthModule,
    ExercicioModule,
    TreinoModule,
    ProgressoModule,
    LembreteModule,
    ConquistaModule,
  ]
})
export class AppModule {}