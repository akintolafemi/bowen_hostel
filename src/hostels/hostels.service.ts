import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma.service';
import { standardResponse, ResponseManager, paginatedResponse, metaData } from 'src/utils/response-manager.utils';
import { CreateHostelDto, CreateRoomDto, HostelSearchFieldsDto } from './dtos/hostels-dtos';

@Injectable()
export class HostelsService {
  constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async createHostel(createAccountRequest: CreateHostelDto): Promise<standardResponse> {

    try {
      
      const createHostel = await this.prismaService.hostels.create({
        data: createAccountRequest
      });
      if (createHostel) {
        
        return ResponseManager.standardResponse("success", HttpStatus.CREATED, "New Hostel Created Successfully", createHostel);
      }
      else {
        return ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `unable to create hostel`, null);
      }

    }catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `account creation failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createRoom(createAccountRequest: CreateRoomDto): Promise<standardResponse> {

    try {
      
      const createRoom = await this.prismaService.rooms.create({
        data: createAccountRequest
      });
      if (createRoom) {
        
        return ResponseManager.standardResponse("success", HttpStatus.CREATED, "New Room Created Successfully", createRoom);
      }
      else {
        return ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `unable to create room`, null);
      }

    }catch (e) {
      console.log(e);
      throw new HttpException(
        ResponseManager.standardResponse("fail", HttpStatus.INTERNAL_SERVER_ERROR, `account creation failed, see exception message`, null, e.toString()),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getHostels(): Promise<paginatedResponse> {
    
    const results = await this.prismaService.hostels.findMany({
      select: {
        id: true,
        hostel_name: true,
        hostel_location: true,
        date_created: true,
        date_modified: true,
        _count: true,
      },
    });

    const meta: metaData = {
      totalRows: results.length,
    };

    return ResponseManager.paginatedResponse("success", HttpStatus.OK, "all hostels result", meta, results);
  }

  public async getHostelAllocations(): Promise<paginatedResponse> {
    
    const results = await this.prismaService.rooms.findMany({
      where: {
        is_available: 1
      },
      select: {
        id: true,
        room_name: true,
        beds_taken: true,
        total_beds: true,
        is_available: true,
        date_created: true,
        hostels: {
          select: {
            id: true,
            hostel_name: true,
            hostel_location: true,
            date_created: true,
            date_modified: true,
          }
        },
        students: {
          select: {
            id: true,
            student_id: true,
            student_firstname: true,
            student_lastname: true,
            date_created: true,
            date_modified: true,
          }
        },
        _count: true,
      },
    });

    const meta: metaData = {
      totalRows: results.length,
    };

    return ResponseManager.paginatedResponse("success", HttpStatus.OK, "rooms allocations result", meta, results);
  }

  public async filterHostel(searchQuery: HostelSearchFieldsDto): Promise<paginatedResponse> {

    const results = await this.prismaService.rooms.findMany({
      where: {
        AND: [
          {
            is_available: { in: searchQuery["is_available"] ? Number(searchQuery["is_available"]) : undefined },
            total_beds: { in: searchQuery["total_available_rooms"] ? Number(searchQuery["total_available_rooms"]) : undefined },
            hostels: {
              hostel_name: { contains: searchQuery["hostel_name"] }
            }
          }
        ]
      },
      select: {
        id: true,
        room_name: true,
        beds_taken: true,
        total_beds: true,
        is_available: true,
        date_created: true,
        hostels: {
          select: {
            id: true,
            hostel_name: true,
            hostel_location: true,
            date_created: true,
            date_modified: true,
          }
        },
        students: {
          select: {
            id: true,
            student_id: true,
            student_firstname: true,
            student_lastname: true,
            date_created: true,
            date_modified: true,
          }
        },
        _count: true,
      },
    });

    const meta: metaData = {
      totalRows: results.length,
    };

    return ResponseManager.paginatedResponse("success", HttpStatus.OK, "search rooms allocations result", meta, results);
  }
}
