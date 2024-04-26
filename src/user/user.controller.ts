import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from 'src/dto/signup.dto';
import { LoginDto } from 'src/dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signupUser(@Res() res, @Body() signupDto: SignupDto) {
    try {
      const newUser = await this.userService.signupUser(signupDto);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'student created successfully', newUser });
    } catch (err) {
      if (err instanceof HttpException) {
        return res
          .status(err.getStatus())
          .json({ statusCode: err.getStatus(), message: err.getResponse() });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ statusCode: 500, message: 'internal server error' });
    }
  }

  @Post('login')
  async loginUser(@Res() res, @Body() loginDto: LoginDto) {
    try {
      const token = await this.userService.loginUser(loginDto);
      console.log({ token });
      return res.status(HttpStatus.ACCEPTED).json({
        statusCode: HttpStatus.ACCEPTED,
        message: 'user loggedIn success',
        token,
      });
    } catch (err) {
      if (err instanceof HttpException) {
        return res
          .status(err.getStatus())
          .json({ statusCode: err.getStatus(), message: err.getResponse() });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ statusCode: 500, message: 'internal server error' });
    }
  }
}
