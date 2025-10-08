import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Usuario } from '../usuario/entity';

@Table({
  tableName: 'profissionais',
  timestamps: true,
})
export class Profissional extends Model<Profissional> {
  
  // A chave primária é a mesma do usuário (1:1)
  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  declare usuarioId: string; // Chave estrangeira e primária

  @BelongsTo(() => Usuario)
  declare usuario: Usuario;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare registroCREF: string; // Registro no Conselho Regional de Educação Física

  @Column(DataType.STRING)
  declare especialidade: string; // Ex: Calistenia, Treinamento Funcional

  @Column(DataType.STRING)
  declare cidade: string;
  
  @Column(DataType.TEXT)
  declare biografia: string;
  
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare certificadoVerificado: boolean;
}