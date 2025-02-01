import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
