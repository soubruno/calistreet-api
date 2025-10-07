import { Table, Column, Model, DataType, HasOne, HasMany } from 'sequelize-typescript';
//import { Profissional } from '../profissional/entity';
// Importação circular para Progresso, Metas, Lembretes, etc. será adicionada depois.

// Enum simples para o tipo de usuário (para o controle de permissão)
export enum TipoUsuario {
  ALUNO = 'ALUNO',
  PROFISSIONAL = 'PROFISSIONAL',
  ADMIN = 'ADMIN',
}

// Enum para o Nivelamento (do escopo)
export enum Nivel {
  INICIANTE = 'INICIANTE',
  INTERMEDIARIO = 'INTERMEDIARIO',
  AVANCADO = 'AVANCADO',
}

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OUTRO = 'OUTRO', 
}

export enum Objetivo {
  RESISTENCIA = 'RESISTENCIA',
  HIPERTROFIA = 'HIPERTROFIA',
  MOBILIDADE = 'MOBILIDADE',
  PERDER_GORDURA = 'PERDER_GORDURA',
  FRONT_LEVER = 'FRONT_LEVER', // Exemplo de treino específico
  PLANCHE = 'PLANCHE',
}

@Table({
  tableName: 'usuarios',
  timestamps: true, // Cria createdAt e updatedAt
})
export class Usuario extends Model<Usuario> {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare nome: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  // Campo essencial para autenticação (será hash/salt)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare senha: string;

  // Tipo de Usuário para controle de Permissões (Requisito 5)
  @Column({
    type: DataType.ENUM(...Object.values(TipoUsuario)),
    allowNull: false,
    defaultValue: TipoUsuario.ALUNO,
  })
  declare tipo: TipoUsuario;

  // --- Dados do Perfil (do seu escopo) ---
  
  @Column(DataType.FLOAT)
  declare peso: number; // Peso em kg
  
  @Column(DataType.FLOAT)
  declare altura: number; // Altura em metros

  @Column(DataType.DATEONLY)
  declare dataNasc: Date;

  @Column({
        type: DataType.ENUM(...Object.values(Genero)),
        allowNull: true, 
    })
  declare genero: Genero; 
  
  @Column({
    type: DataType.ENUM(...Object.values(Nivel)),
    defaultValue: Nivel.INICIANTE,
  })
  declare nivelamento: Nivel;
  
  @Column({ 
        type: DataType.ENUM(...Object.values(Objetivo)),
        allowNull: true,
    })
  declare objetivo: Objetivo; 
  
  // Campo para armazenar equipamentos (JSONB ou STRING, vamos usar STRING por simplicidade inicial)
  //@Column(DataType.STRING)
  //declare equipamentos: string; // Ex: 'argolas,paralela'

  // O Profissional associado a este Aluno (se houver)
  //@Column(DataType.UUID)
  //declare profissionalId: string;

  // --- Relacionamento: Se for um Profissional, terá uma entrada nesta tabela ---
  //@HasOne(() => Profissional)
  //dadosProfissional: Profissional;
}