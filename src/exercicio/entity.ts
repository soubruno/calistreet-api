import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import { Usuario } from '../usuario/entity';
import { UsuarioExercicioFavorito } from './usuario-exercicio-favorito.entity';

// Enums para Grupos e Subgrupos Musculares (para filtros)
export enum GrupoMuscular {
  SUPERIOR = 'SUPERIOR',
  CORE = 'CORE',
  INFERIOR = 'INFERIOR',
  FULL_BODY = 'FULL_BODY',
}

export enum SubgrupoMuscular {
  PEITO = 'PEITO',
  COSTAS = 'COSTAS',
  OMBRO = 'OMBRO',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  ANTEBRACO = 'ANTEBRACO',
  ABDOMEN = 'ABDOMEN',
  LOMBAR = 'LOMBAR',
  QUADRICEPS = 'QUADRICEPS',
  POSTERIOR = 'POSTERIOR',
  PANTURRILHA = 'PANTURRILHA',
}

@Table({
  tableName: 'exercicios',
  timestamps: true,
})
export class Exercicio extends Model<Exercicio> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true, // Garante que não haja exercícios duplicados
  })
  declare nome: string; 

  @Column(DataType.TEXT)
  declare descricao: string; 
  
  @Column({
    type: DataType.ENUM(...Object.values(GrupoMuscular)),
    allowNull: false,
  })
  declare grupoMuscular: GrupoMuscular;
 
  @Column({
    type: DataType.ENUM(...Object.values(SubgrupoMuscular)),
    allowNull: true, 
  })
  declare subgrupoMuscular: SubgrupoMuscular;

  @Column(DataType.STRING)
  declare equipamentosNecessarios: string; 

  @Column(DataType.STRING)
  declare videoUrl: string;

  // Relacionamento M:N com Usuário para Favoritos
  @BelongsToMany(() => Usuario, () => UsuarioExercicioFavorito)
  declare usuariosFavoritaram: Usuario[];
}