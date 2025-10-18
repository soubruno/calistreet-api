import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber, IsIn } from 'class-validator';
import { TipoUsuario, Nivel, Genero, Objetivo } from '../entity';

export class CreateUsuarioDto {
  
  @IsString({ message: 'O nome é obrigatório.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  declare nome: string;

  @IsEmail({}, { message: 'O e-mail deve ser um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  declare email: string;

  @IsString({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  declare senha: string;

  // O tipo de usuário padrão será ALUNO, mas é permitida a criação de PROFISSIONAIS e ADMINS
  @IsOptional()
  @IsIn(Object.values(TipoUsuario), { message: 'Tipo de usuário inválido.' })
  declare tipo: TipoUsuario;
  
  // --- Dados do Perfil ---
  
  @IsOptional()
  @IsNumber({}, { message: 'Peso deve ser um número.' })
  peso?: number; 
  
  @IsOptional()
  @IsNumber({}, { message: 'Altura deve ser um número.' })
  altura?: number;
  
  @IsOptional()
  @IsString({ message: 'Data de nascimento deve ser uma string de data válida.' })
  dataNasc?: string; 
  
  @IsOptional()
  @IsIn(Object.values(Genero), { message: 'Gênero inválido.' })
  genero?: Genero;
  
  @IsOptional()
  @IsIn(Object.values(Nivel), { message: 'Nivelamento inválido.' })
  nivelamento?: Nivel;
  
  @IsOptional()
  @IsIn(Object.values(Objetivo), { message: 'Objetivo inválido.' })
  objetivo?: Objetivo;
  
  @IsOptional()
  @IsString()
  equipamentos?: string;
}