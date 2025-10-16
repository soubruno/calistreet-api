import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Usuario } from '../usuario/entity';

export enum TipoMedida {
  PESO = 'PESO',
  CIRCUNFERENCIA = 'CIRCUNFERENCIA',
  PERCENTUAL = 'PERCENTUAL',
  OUTRO = 'OUTRO',
}

@Table({
  tableName: 'medidas_fisicas',
  timestamps: true,
})
export class MedidaFisica extends Model<MedidaFisica> {
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
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare dataRegistro: Date;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare nomeMedida: string; // Ex: "Peso", "Circunferência Braço"

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare valor: number; // O valor da medida (Ex: 85.5, 35.5)

  @Column({
    type: DataType.STRING(10),
  })
  declare unidade: string; // Ex: 'kg', 'cm', '%'

  @Column({
    type: DataType.ENUM(...Object.values(TipoMedida)),
    allowNull: false,
  })
  declare tipo: TipoMedida;
}