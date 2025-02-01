import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './document.interface';

@Injectable()
export class DocumentService {

  documents: Document[] = [
    {
      id: 1,
      title: 'Document 1',
      content: 'This is document 1',
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01')
    },
    {
      id: 2,
      title: 'Document 2',
      content: 'This is document 2',
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01')
    }
  ]

  create(createDocumentDto: CreateDocumentDto) {
    return 'This action adds a new document';
  }

  findAll(): Document[] {
    return this.documents;
  }

  findOne(id: number) {
    return this.documents.find(document => document.id === id);
  }

  update(id: number, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
