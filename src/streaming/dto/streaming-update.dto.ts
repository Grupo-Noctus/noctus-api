import { PartialType } from "@nestjs/swagger";
import { StreamingRequest } from "./streaming-request.dto";

export class StreamingUpdate extends PartialType(StreamingRequest) {}