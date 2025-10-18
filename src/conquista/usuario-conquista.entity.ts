import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Usuario } from '../usuario/entity';
import { Conquista } from './entity';

@Table({
  tableName: 'usuarios_conquistas',
  timestamps: true,
})
export class UsuarioConquista extends Model<UsuarioConquista> {
  @ForeignKey(() => Usuario)
  @Column({ primaryKey: true, type: DataType.UUID })
  declare usuarioId: string;

  @ForeignKey(() => Conquista)
  @Column({ primaryKey: true, type: DataType.UUID })
  declare conquistaId: string;
}