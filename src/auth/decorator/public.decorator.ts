import { SetMetadata } from "@nestjs/common";

export const IS_PUBUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBUBLIC_KEY, true);
