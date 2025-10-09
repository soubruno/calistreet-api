import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Usuario } from '../usuario/entity';
import { Exercicio } from './entity';

@Table({
  tableName: 'usuarios_exercicios_favoritos',
  timestamps: true, 
})
export class UsuarioExercicioFavorito extends Model<UsuarioExercicioFavorito> {
  @ForeignKey(() => Usuario)
  @Column({ primaryKey: true, type: DataType.UUID })
  declare usuarioId: string;

  @ForeignKey(() => Exercicio)
  @Column({ primaryKey: true, type: DataType.UUID })
  declare exercicioId: string;
}