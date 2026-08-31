/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as cards from "../cards.js";
import type * as checkoutProfiles from "../checkoutProfiles.js";
import type * as contact from "../contact.js";
import type * as emailData from "../emailData.js";
import type * as emails from "../emails.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as promoCodes from "../promoCodes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  cards: typeof cards;
  checkoutProfiles: typeof checkoutProfiles;
  contact: typeof contact;
  emailData: typeof emailData;
  emails: typeof emails;
  orders: typeof orders;
  products: typeof products;
  promoCodes: typeof promoCodes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
