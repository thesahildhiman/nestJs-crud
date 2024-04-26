import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@cluster0.3zvmnhy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { dbName: 'crud' },
    ),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
