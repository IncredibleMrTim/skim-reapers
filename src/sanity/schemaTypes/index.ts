import type { SchemaTypeDefinition } from "sanity";

import { deployTrigger } from "./deployTrigger";
import { homePage } from "./homePage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, deployTrigger],
};
