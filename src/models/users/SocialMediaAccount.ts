import { Schema, Trim } from "@tsed/mongoose";
import { MaxLength, MinLength, Optional, Required } from "@tsed/schema";

@Schema()
export class SocialMediaAccount {
  @Optional()
  @Trim()
  facebook: string;

  @Optional()
  @Trim()
  twitter: string;

  @Optional()
  @Trim()
  linked: string;

  @Optional()
  @Trim()
  instagram: string;
}
