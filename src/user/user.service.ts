import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { LoginDto } from 'src/dto/login.dto';
import { SignupDto } from 'src/dto/signup.dto';
import { User } from 'src/schema/user.schema';
import { PasswordService } from 'src/utils/password.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly passwordService: PasswordService,
    private jwtService: JwtService,
  ) {}

  async signupUser(signupDto: SignupDto): Promise<any> {
    try {
      const isUserExist = await this.userModel.findOne({
        email: signupDto?.email,
      });
      if (isUserExist) {
        throw new HttpException('User already exist', HttpStatus.CONFLICT);
      }

      const hashedPassword = await this.passwordService.hashPassword(
        signupDto.password,
      );

      const user = new this.userModel({
        ...signupDto,
        password: hashedPassword,
      });

      const newUser = await user.save();
      return newUser;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginUser(loginDto: LoginDto) {
    try {
      const isUserExist = await this.userModel.findOne({
        email: loginDto?.email,
      });
      if (!isUserExist) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }

      const isPasswordMatched = await this.passwordService.comparePasswords(
        loginDto.password,
        isUserExist.password,
      );

      if (!isPasswordMatched) {
        throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const payload = { email: loginDto.email };
      const token = await this.jwtService.signAsync(payload);
      return token;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
