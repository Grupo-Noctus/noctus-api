import { PartialType } from '@nestjs/swagger';
import { StreamingRequest } from '../request/streaming.request.dto';

export class StreamingUpdate extends PartialType(StreamingRequest) {}
