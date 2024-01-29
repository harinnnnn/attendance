import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Attendee } from '../attendees/entities/attendee.entity';
import { Record } from './entities/record.entity';
import { RoleGuard } from '../roles/role.guard';
import { Roles } from '../roles/role.decorator';
import { RoleType } from '../roles/entities/role-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { CreateAttendeeDto } from '../attendees/dto/create-attendee.dto';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { DeleteAttendeeDto } from '../attendees/dto/delete-attendee.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('records')
@ApiTags('출석기록')
@ApiBearerAuth('token')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @ApiOperation({
    description: '출석기록 생성 및 수정',
    summary: '출석기록 생성 및 수정',
  })
  @ApiBody({
    type: CreateRecordDto,
    description: '출석기록 생성 DTO',
  })
  @ApiResponse({
    status: 200,
    description: '출석기록 생성',
    type: Record,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  async createRecord(
    @Body() createRecordDto: CreateRecordDto,
    @GetUser() user: User,
  ) {
    return this.recordsService.create(createRecordDto, user);
  }

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    description: '출석기록 조회',
    summary: '출석기록 조회',
  })
  @ApiResponse({
    status: 200,
    description: '출석기록 조회',
    type: Record,
  })
  findOne(@Param('id') id: string) {
    return this.recordsService.findOneById(+id);
  }

  @Delete()
  @ApiOperation({ summary: '출석기록 일괄 삭제' })
  @ApiBody({
    type: DeleteRecordDto,
    description: '출석기록 삭제 DTO',
  })
  @ApiResponse({
    status: 204,
    description: '출석기록 일괄 삭제',
    type: null,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER)
  deleteAll(@Body() deleteRecordDto: DeleteRecordDto) {
    return this.recordsService.deleteAll(deleteRecordDto);
  }
}
