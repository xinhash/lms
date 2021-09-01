import { Schema, Trim } from "@tsed/mongoose";
import { MaxLength, MinLength, Optional, Required } from "@tsed/schema";

@Schema()
export class SocialMediaAccount {
  @Trim()
  facebook?: string;

  @Trim()
  twitter?: string;

  @Trim()
  linked?: string;

  @Trim()
  instagram?: string;
}
