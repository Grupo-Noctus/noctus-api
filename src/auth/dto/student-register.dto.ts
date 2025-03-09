import { EducationLevel, Ethnicity, Gender, State } from "@prisma/client";

export class StudentRegisterDto {
  dateBirth: string;
  educationLevel: EducationLevel;
  state: State;
  ethnicity: Ethnicity;
  gender: Gender;
  hasDisability: boolean;
  disabilityType?: string;
  needsSupportResources: boolean;
  supportResourcesDescription?: string;
}