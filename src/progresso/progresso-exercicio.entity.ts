import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Progresso } from './entity';
import { Exercicio } from '../exercicio/entity';

@Table({
  tableName: 'progresso_exercicios',
  timestamps: false,
})
export class ProgressoExercicio extends Model<ProgressoExercicio> {
  
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Progresso)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare progressoId: string; // FK para a sessão de progresso

  @BelongsTo(() => Progresso)
  declare sessaoProgresso: Progresso;

  @ForeignKey(() => Exercicio)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare exercicioId: string; // FK para o exercício do catálogo

  @BelongsTo(() => Exercicio)
  declare exercicio: Exercicio;

  @Column(DataType.INTEGER)
  declare ordem: number;

  @Column(DataType.INTEGER)
  declare seriesFeitas: number;
  
  // Repetições feitas: armazena como string/JSON para permitir '8, 8, 7' (falha na última)
  @Column(DataType.STRING)
  declare repeticoesFeitas: string; 
  
  @Column(DataType.FLOAT)
  declare cargaUtilizadaKg: number; 

  @Column(DataType.INTEGER)
  declare tempoTotalSegundos: number;
}