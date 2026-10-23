import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazio' })
  currentPassword: string;

  @IsString({ message: 'Nova Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Nova Senha não pode estar vazio' })
  @MinLength(6, { message: 'Nova Senha precisa ter no minímo 6 caracteres' })
  newPassword: string;
}
