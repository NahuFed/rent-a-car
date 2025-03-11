import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DocumentService {

  constructor(
    @InjectRepository(Document) private readonly documentRepository: Repository<Document>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ){}

  async create(createDocumentDto: CreateDocumentDto, userId: number): Promise<Document> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const document = this.documentRepository.create({
      ...createDocumentDto,
      user,
    });
    return this.documentRepository.save(document);
  }

  findAll() {
    return this.documentRepository.find({
      relations:['user'],
    }
    );
  }

  async findOne(id: number) {
    return this.documentRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return this.documentRepository.update(id, {
      ...document,
      updatedAt: new Date(),
    }
    );
  }

  remove(id: number) {
    return this.documentRepository.delete(id);
  }

  async findUserDocuments(user: number) {
    return this.documentRepository.find({
      where: { user: {id: user} },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Document[]> {
    return this.documentRepository.find({ where: { user: { id: userId } } });
  }
}
