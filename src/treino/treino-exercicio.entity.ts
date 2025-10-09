import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Exercicio } from '../exercicio/entity';
import { Treino } from './entity';

@Table({
  tableName: 'treinos_exercicios',
  timestamps: false,
})
export class TreinoExercicio extends Model<TreinoExercicio> {
  
  @ForeignKey(() => Treino)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare treinoId: string;

  @ForeignKey(() => Exercicio)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  declare exercicioId: string;

  @BelongsTo(() => Treino)
  declare treino: Treino;

  @BelongsTo(() => Exercicio)
  declare exercicio: Exercicio;

  // --- Detalhes da Prescrição (o que diferencia este exercício neste treino) ---
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare ordem: number; // Ordem de execução no treino
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare series: number; // Quantidade de séries
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare repeticoes: number; // Quantidade de repetições
  
  @Column({
    type: DataType.INTEGER,
  })
  declare descansoSegundos: number; // Tempo de descanso entre séries (em segundos)
}