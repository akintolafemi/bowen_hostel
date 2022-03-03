import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AssignRoomDto, CreateAccountDto } from './dtos/students-dtos';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post("/create")
  public async createAccount(@Body() createRequest: CreateAccountDto) {
    return this.studentsService.createAccount(createRequest);
  }

  @Patch("/assignroom/:studentid")
  public async assignRoom(@Param("studentid") studentid: string, @Body() updateRequest: AssignRoomDto) {
    return this.studentsService.assignRoom(Number(studentid), updateRequest);
  }

  @Patch("/unassignroom/:studentid")
  public async unAssignRoom(@Param("studentid") studentid: string) {
    return this.studentsService.unAssignRoom(Number(studentid));
  }
}
