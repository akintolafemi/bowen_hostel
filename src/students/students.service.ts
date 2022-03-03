import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { hashRounds } from 'src/constants/hash.constants';
import { PrismaService } from 'src/prisma.service';
import { ResponseManager, standardResponse } from 'src/utils/response-manager.utils';
import { AssignRoomDto, CreateAccountDto } from './dtos/students-dtos';


@Injectable()
export class StudentsService {

  constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async createAccount(createAccountRequest: CreateAccountDto): Promise<standardResponse> {

    try {

      const hashPassword = await bcrypt.hash(createAccountRequest.password, hashRounds);

      const createStudent = await this.prismaService.students.create({
        data: {
          student_id: createAccountRequest.studentid,
          student_password: hashPassword,
          student_firstname: createAccountRequest.firstname,
          student_lastname: createAccountRequest.lastname
        }
      });
      if (createStudent) {
        return ResponseManager.standardResponse("success", HttpStatus.CREATED, "Student Account Created Successfully", createStudent);
      }
      else {
        return ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `unable to create account`, null);
      }

    }catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `account creation failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async assignRoom(studentid: number, updateRequest: AssignRoomDto): Promise<standardResponse> {
    try {
      
      const getRoom = await this.prismaService.rooms.findFirst({
        where: {
          id: updateRequest.room_id
        }
      });

      if (!getRoom) {
        throw new HttpException(
          ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, `Room does not exist in any hostel`, null),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      else {

        if (getRoom.is_available !== 1) {
          throw new HttpException(
            ResponseManager.standardResponse("fail", HttpStatus.NOT_FOUND, `Room full`, null),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        const assignRoom = await this.prismaService.students.update({
          where: { id: studentid },
          data: {
            student_room_id: updateRequest.room_id,
            date_modified: new Date()
          }
        });

        if (!assignRoom) {
          throw new HttpException(
            ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured allocating room to student, see exception message`, null),
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        var total_beds_taken = getRoom.beds_taken + 1;
        const updateRoom = {
          beds_taken: total_beds_taken
        };
        if (getRoom.total_beds === total_beds_taken) {
          Object.assign(updateRoom, {
            is_available: 0,
          });
        }

        await this.prismaService.rooms.update({
          where: {
            id: getRoom.id
          },
          data: {
            ...updateRoom
          }
        })

        return ResponseManager.standardResponse("success", HttpStatus.CREATED, `New room allocated to student successfully`, null);
      }
    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured allocating room to student, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async unAssignRoom(studentid: number): Promise<standardResponse> {
    try {

      await this.prismaService.students.update({
        where: { id: studentid },
        data: {
          student_room_id: null 
        }
      });

      return ResponseManager.standardResponse("success", HttpStatus.CREATED, `Room unallocated to student successfully`, null);
    }catch (e) {
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `error occured unallocating room to student, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
