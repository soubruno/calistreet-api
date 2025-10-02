import { Table, Column, Model, DataType, HasOne, HasMany } from 'sequelize-typescript';
import { Profissional } from '../profissional/entity';

// Enum para o tipo de usuário
export enum TipoUsuario {
  ALUNO = 'ALUNO',
  PROFISSIONAL = 'PROFISSIONAL',
  ADMIN = 'ADMIN',
}

// Enum para o Nivelamento 
export enum Nivel {
  INICIANTE = 'INICIANTE',
  INTERMEDIARIO = 'INTERMEDIARIO',
  AVANCADO = 'AVANCADO',
}

@Table({
  tableName: 'usuarios',
  timestamps: true, 
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
    select: false, // Não retorna a senha em consultas padrão
  })
  declare senha: string;

  // Tipo de Usuário para controle de Permissões
  @Column({
    type: DataType.ENUM(...Object.values(TipoUsuario)),
    allowNull: false,
    defaultValue: TipoUsuario.ALUNO,
  })
  declare tipo: TipoUsuario;

  // --- Dados do Perfil ---
  
  @Column(DataType.FLOAT)
  declare peso: number; 
  
  @Column(DataType.FLOAT)
  declare altura: number;

  @Column(DataType.DATEONLY)
  declare dataNasc: Date;

  @Column(DataType.STRING(10))
  declare genero: string;
  
  @Column({
    type: DataType.ENUM(...Object.values(Nivel)),
    defaultValue: Nivel.INICIANTE,
  })
  declare nivelamento: Nivel;
  
  @Column(DataType.STRING)
  declare objetivo: string; 
  
  @Column(DataType.STRING)
  declare equipamentos: string;

  // O Profissional associado a este Aluno (se houver)
  @Column(DataType.UUID)
  declare profissionalId: string;

  // --- Relacionamento: Se for um Profissional, terá uma entrada nesta tabela ---
  @HasOne(() => Profissional)
  dadosProfissional: Profissional;
}