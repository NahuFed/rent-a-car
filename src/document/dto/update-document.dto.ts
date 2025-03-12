import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
    url?: string;
    src?: string;
    description?: string;
    title?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
