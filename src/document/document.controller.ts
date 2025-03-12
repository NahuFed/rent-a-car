import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException, UnauthorizedException, ParseIntPipe, Request } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { AuthGuard } from '@nestjs/passport';
import { S3Service } from 'src/s3/s3.service';
import { Roles } from 'src/auth/roles.decorator';
import { RoleType } from 'src/role/entities/role.entity';
import { RolesGuard } from 'src/auth/roles.guard';

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

  
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Request() req
  ) {
    const document = await this.documentService.findOne(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }    
    if (document.user.id !== req.user.id) {
      throw new UnauthorizedException('Cannot update another user document');
    }
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentService.remove(+id);
  }

  @Get('user/me')
  @UseGuards(AuthGuard('jwt'))
  async findMyDocuments(@Req() req: any) {
    const user = req.user;
    const documents = await this.documentService.findUserDocuments(user.id);
    const documentsWithUrls = await Promise.all(documents.map(async (doc) => {
      const presignedUrl = await this.s3Service.getPresignedUrl(doc.src);
      return { ...doc, url: presignedUrl };
    }));
    return documentsWithUrls;
  }

  @Get('user/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleType.ADMIN)
  async findUserDocuments(@Param('id') id: string) {
    const documents = await this.documentService.findUserDocuments(+id);
    const documentsWithUrls = await Promise.all(documents.map(async (doc) => {
      const presignedUrl = await this.s3Service.getPresignedUrl(doc.src);
      return { ...doc, url: presignedUrl };
    }));
    return documentsWithUrls;
  }
}
