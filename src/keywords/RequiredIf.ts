// import {Keyword, KeywordMethods} from "@tsed/ajv";
// import {array, number} from "@tsed/schema";

// @Keyword({
//   keyword: "if",
//   type: "number",
//   schemaType: "array",
//   implements: ["exclusiveRange"],
//   metaSchema: array()
//     .items([number(), number()])
//     .minItems(2)
//     .additionalItems(false)
// })
// class RangeKeyword implements KeywordMethods {
//   compile([min, max]: number[], parentSchema: any) {
//     return parentSchema.exclusiveRange === true
//       ? (data: any) => data > min && data < max
//       : (data: any) => data >= min && data <= max;
//   }
// }