import { IsOptional, IsEnum } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'; 
import { TipoConquista } from '../entity';

export class FindAllConquistasDto extends PaginationQueryDto {
    @IsOptional()
    @IsEnum(TipoConquista)
    declare tipo?: TipoConquista;
}