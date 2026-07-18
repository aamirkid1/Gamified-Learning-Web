import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './course.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(courseData: any) {
    const teacher = await this.userRepository.findOne({
      where: {
        id: Number(courseData.teacherId),
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    const course = this.courseRepository.create({
      title: courseData.title,
      description: courseData.description,
      thumbnail: courseData.thumbnail,
      teacher,
    });

    return await this.courseRepository.save(course);
  }


  async findAll() {
  return await this.courseRepository.find({
    relations: ["teacher"],
  });
}

async findOne(id: number) {
  const course = await this.courseRepository.findOne({
    where: {
      id,
    },
    relations: ["teacher"],
  });

  if (!course) {
    throw new NotFoundException("Course not found");
  }

  return course;
}

  async findByTeacher(teacherId: number) {
    return await this.courseRepository.find({
      where: {
        teacher: {
          id: teacherId,
        },
      },
      relations: ['teacher'],
    });
  }
}