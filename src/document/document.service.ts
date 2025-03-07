import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {

  constructor(
    @InjectRepository(Document) private documentRepository: Repository<Document>,
  ){}

  create(createDocumentDto: CreateDocumentDto) {
    const document = this.documentRepository.create(createDocumentDto);
    return this.documentRepository.save(document);
    
  }

  findAll() {
    return this.documentRepository.find();
  }

  findOne(id: number) {
    return this.documentRepository.findOne({
      where: { id },
      relations: ['user'],
    }
    );
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
}
