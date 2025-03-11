import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthGuard } from '@nestjs/passport';
import { S3Service } from 'src/s3/s3.service';

@Controller('document')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createDocumentDto: CreateDocumentDto, @Req() req: any) {
    const user = req.user;
    const document = await this.documentService.create(createDocumentDto, user.id);
    const presignedUrl = await this.s3Service.getPresignedUrl(document.src);
    return { ...document, url: presignedUrl };
  }

  @Get()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const document = await this.documentService.findOne(+id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    const presignedUrl = await this.s3Service.getPresignedUrl(document.src);
    return { ...document, url: presignedUrl };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard('jwt'))
  async findUserDocuments(@Req() req: any) {
    const user = req.user;
    const documents = await this.documentService.findByUser(user.id);
    const documentsWithUrls = await Promise.all(documents.map(async (doc) => {
      const presignedUrl = await this.s3Service.getPresignedUrl(doc.src);
      return { ...doc, url: presignedUrl };
    }));
    return documentsWithUrls;
  }
}
