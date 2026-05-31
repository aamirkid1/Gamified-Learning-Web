// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class CourseService {
//   private courses: any[] = [];

//   create(courseData: any) {
//     this.courses.push(courseData);
//     return courseData;
//   }

//   findAll() {
//     return this.courses;
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  create(courseData: Partial<Course>) {
    const course = this.courseRepository.create(courseData);
    return this.courseRepository.save(course);
  }

  findAll() {
    return this.courseRepository.find();
  }
}