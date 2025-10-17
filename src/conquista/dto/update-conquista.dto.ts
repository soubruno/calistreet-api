import { PartialType } from '@nestjs/mapped-types';
import { CreateConquistaDto } from './create-conquista.dto';

export class UpdateConquistaDto extends PartialType(CreateConquistaDto) {}