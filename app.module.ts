import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './src/auth/module';
import { JwtModule } from '@nestjs/jwt';
// -------------------------------------------------------------------------
// 1. IMPORTAÇÃO DE TODAS AS ENTIDADES (MODELS) PARA O SEQUELIZE
// -------------------------------------------------------------------------

// Entidades Base
import { Usuario } from './src/usuario/entity';
import { Profissional } from './src/profissional/entity';

// Treino e Exercício
import { Exercicio } from './src/exercicio/entity';
//import { Treino } from './treino/entity';
//import { TreinoExercicio } from './treino/treino-exercicio.entity';
import { UsuarioExercicioFavorito } from './src/exercicio/usuario-exercicio-favorito.entity';

// Progresso e Histórico
//import { Progresso } from './progresso/progresso.entity';
//import { ProgressoExercicio } from './progresso/progresso-exercicio.entity';
//import { MedidaFisica } from './progresso/medida-fisica.entity';
//import { Lembrete } from './lembrete/lembrete.entity';

// Conquistas
//import { Conquista } from './conquista/conquista.entity';
//import { UsuarioConquista } from './conquista/usuario-conquista.entity';


// -------------------------------------------------------------------------
// 2. IMPORTAÇÃO DOS MÓDULOS DE FUNCIONALIDADE
// -------------------------------------------------------------------------

import { UsuarioModule } from './src/usuario/module';
import { ProfissionalModule } from './src/profissional/module';
// Importaremos os demais módulos (Auth, Treino, Progresso, etc.)
// à medida que os criarmos. Por enquanto, a base:
//import { AuthModule } from './auth/auth.module';
import { ExercicioModule } from './src/exercicio/module';
// import { TreinoModule } from './treino/treino.module';
// import { ProgressoModule } from './progresso/progresso.module';


@Module({
  imports: [
    // Módulo para carregar o arquivo .env
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
        autoLoadModels: true, // Carrega modelos automaticamente
        synchronize: true, // Sincroniza o DB com os Models (usar `false` em produção)
        alter: true, // Permite alterar a tabela (usar `false` em produção)
        define: {
          underscored: true, // Usa snake_case no banco de dados (ex: created_at)
        },
        
        // Lista de todas as entidades do projeto
        models: [
          Usuario, 
          Profissional, 
          Exercicio, 
          //Treino, 
          //TreinoExercicio,
          UsuarioExercicioFavorito,
          //Progresso,
          //ProgressoExercicio,
          //MedidaFisica,
          //Lembrete,
          //Conquista,
          //UsuarioConquista,
        ],
      }),
    }),
    
    // Módulos de Funcionalidade
    UsuarioModule,
    ProfissionalModule,
    // Próximos módulos a serem adicionados:
    AuthModule,
    ExercicioModule,
    // TreinoModule,
    // ProgressoModule,
  ]
})
export class AppModule {}