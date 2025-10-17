import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Usuario } from '../usuario/entity';
import { UsuarioConquista } from './usuario-conquista.entity';

export enum TipoConquista {
  TREINO_COMPLETO = 'TREINO_COMPLETO',
  PROGRESSO_MEDIDA = 'PROGRESSO_MEDIDA',
  SEQUENCIA_DIAS = 'SEQUENCIA_DIAS',
  VOLUME_TOTAL = 'VOLUME_TOTAL',
  PRIMEIRA_VEZ = 'PRIMEIRA_VEZ',
}

@Table({
  tableName: 'conquistas',
  timestamps: true,
})
export class Conquista extends Model<Conquista> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare titulo: string; // Ex: "Primeiro Treino", "O Gigante de Ferro"

  @Column(DataType.TEXT)
  declare descricao: string;

  @Column({
    type: DataType.ENUM(...Object.values(TipoConquista)),
    allowNull: false,
  })
  declare tipo: TipoConquista; // Qual evento ou métrica dispara a conquista

  // Campo para a regra de negócio (ex: "10" para 10 treinos, "5" para 5 kg perdidos)
  @Column(DataType.STRING)
  declare regraParametro: string; 

  @Column(DataType.STRING)
  declare iconeUrl: string;

  // Relacionamento M:N com Usuário
  @BelongsToMany(() => Usuario, () => UsuarioConquista)
  declare usuarios: Usuario[];
}