import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { HostelsModule } from './hostels/hostels.module';

@Module({
  imports: [StudentsModule, HostelsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
