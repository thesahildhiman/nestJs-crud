import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  ValidationOptions,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @IsStrongPassword(undefined, {
    message: 'password is too weak',
  } as ValidationOptions)
  readonly password: string;
}
