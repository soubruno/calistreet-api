import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Usuario, Nivel } from '../usuario/entity'; // Reutiliza Nivel
import { Exercicio } from '../exercicio/entity'; // Necessário para o relacionamento
import { TreinoExercicio } from './treino-exercicio.entity'; // Tabela de junção

@Table({
  tableName: 'treinos',
  timestamps: true,
})
export class Treino extends Model<Treino> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare nome: string;

  @Column(DataType.TEXT)
  declare descricao: string;
  
  // Nível do treino (para o filtro GET /treinos?nivel)
  @Column({
    type: DataType.ENUM(...Object.values(Nivel)),
    allowNull: false,
  })
  declare nivel: Nivel;
  
  // Quem criou o template (Profissional/Admin/Aluno)
  @ForeignKey(() => Usuario)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare criadoPorId: string;

  @BelongsTo(() => Usuario, { foreignKey: 'criadoPorId' })
  declare criador: Usuario;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isTemplate: boolean; // Se é um template público ou treino personalizado
  
  // Relacionamento M:N com Exercicio através da tabela de junção
  @BelongsToMany(() => Exercicio, () => TreinoExercicio)
  declare exercicios: Exercicio[];

  // Relação 1:N com a tabela de junção para facilitar a busca
  @HasMany(() => TreinoExercicio)
  declare itens: TreinoExercicio[]; 

  // Futura relação 1:N com Progresso (Histórico)
  // @HasMany(() => Progresso)
  // historico: Progresso[]; 
}