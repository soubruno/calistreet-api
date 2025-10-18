import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Usuario } from '../usuario/entity';

export enum DiaSemana {
  SEGUNDA = 'SEGUNDA',
  TERCA = 'TERCA',
  QUARTA = 'QUARTA',
  QUINTA = 'QUINTA',
  SEXTA = 'SEXTA',
  SABADO = 'SABADO',
  DOMINGO = 'DOMINGO',
  TODOS = 'TODOS',
}

@Table({
  tableName: 'lembretes',
  timestamps: true,
})
export class Lembrete extends Model<Lembrete> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare usuarioId: string;

  @BelongsTo(() => Usuario)
  declare usuario: Usuario;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare titulo: string; // Ex: "Hora do treino de braços"
  
  @Column({
    type: DataType.ENUM(...Object.values(DiaSemana)),
    allowNull: false,
  })
  declare diaSemana: DiaSemana;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  declare hora: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare ativo: boolean;
  
  // --- PONTO DE INTEGRAÇÃO BÔNUS (Filas) ---
  //@Column(DataType.STRING)
  //declare jobId: string; // ID da tarefa na Fila (BullMQ/Redis) para cancelamento.
}