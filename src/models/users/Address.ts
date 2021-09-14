import { ObjectID, Schema, Trim } from "@tsed/mongoose";
import { Groups, MaxLength, MinLength, Optional, Required } from "@tsed/schema";

@Schema()
export class Address {
  @Groups("!creation", "!updation")
  @ObjectID("id")
  _id: string;

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
