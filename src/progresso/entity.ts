import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Usuario } from '../usuario/entity';
import { Treino } from '../treino/entity';
import { ProgressoExercicio } from './progresso-exercicio.entity';

// Status do treino, útil para o controle de permissões e relatórios
export enum StatusSessao {
  CONCLUIDO = 'CONCLUIDO',
  INTERROMPIDO = 'INTERROMPIDO',
  EM_ANDAMENTO = 'EM_ANDAMENTO', 
}

@Table({
  tableName: 'progresso', // Histórico de sessões de treino
  timestamps: true,
})
export class Progresso extends Model<Progresso> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  // Usuário que completou (ou iniciou) o treino
  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare usuarioId: string;

  @BelongsTo(() => Usuario)
  declare usuario: Usuario;

  // Qual treino template foi usado (Pode ser nulo se for um treino "livre")
  @ForeignKey(() => Treino)
  @Column(DataType.UUID)
  declare treinoId: string;

  @BelongsTo(() => Treino)
  declare treinoModelo: Treino;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare dataInicio: Date;

  @Column(DataType.DATE)
  declare dataFim: Date;

  @Column(DataType.INTEGER)
  declare duracaoSegundos: number;

  @Column({
    type: DataType.ENUM(...Object.values(StatusSessao)),
    defaultValue: StatusSessao.EM_ANDAMENTO,
  })
  declare status: StatusSessao;

  @Column(DataType.TEXT)
  declare notas: string; 

  // Coluna para armazenar o URL da imagem gerada para compartilhamento
  @Column(DataType.STRING)
  declare urlCompartilhamento: string;
  
  // Relacionamento 1:N com os resultados de cada exercício
  @HasMany(() => ProgressoExercicio)
  declare resultadosExercicios: ProgressoExercicio[];
}