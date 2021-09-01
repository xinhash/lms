import { Schema, Trim } from "@tsed/mongoose";
import { MaxLength, MinLength, Optional, Required } from "@tsed/schema";

@Schema()
export class Address {
  @Trim()
  name?: string;

  @Required()
  @MinLength(5)
  @MaxLength(150)
  @Trim()
  addressLine1: string;

  @Trim()
  addressLine2?: string;

  @Required()
  @Trim()
  city: string;

  @Required()
  @Trim()
  state: string;

  @Required()
  @Trim()
  pincode: string;

  @Trim()
  landmark?: string;
}
