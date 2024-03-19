import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoryDto } from './create-history.dio';

export class UpdateHistoryDto extends PartialType(CreateHistoryDto) {}
