import {Storefront} from '@shopify/hydrogen';
import {
  Cart,
  CartCreatePayload,
  CartInput,
  CartLineInput,
  CartLinesAddPayload,
  CartLinesRemovePayload,
  Scalars,
} from '@shopify/hydrogen/storefront-api-types';
import {
  ADD_LINES_MUTATION,
  CART_QUERY,
  CREATE_CART_MUTATION,
  REMOVE_LINE_ITEMS_MUTATION,
} from './query';

/**
 * Create a cart with line(s) mutation
 * @param input CartInput https://shopify.dev/api/storefront/{api_version}/input-objects/CartInput
 * @see https://shopify.dev/api/storefront/{api_version}/mutations/cartcreate
 * @returns result {cart, errors}
 * @preserve
 */
export async function cartCreate({
  input,
  storefront,
}: {
  input: CartInput;
  storefront: Storefront;
}) {
  const {cartCreate} = await storefront.mutate<{cartCreate: CartCreatePayload}>(
    CREATE_CART_MUTATION,
    {
      variables: {input},
    },
  );

  return cartCreate;
}

/**
 * Storefront API cartLinesAdd mutation
 * @param cartId
 * @param lines [CartLineInput!]! https://shopify.dev/api/storefront/{api_version}/input-objects/CartLineInput
 * @see https://shopify.dev/api/storefront/{api_version}/mutations/cartLinesAdd
 * @returns result {cart, errors}
 * @preserve
 */
export async function cartAdd({
  cartId,
  lines,
  storefront,
}: {
  cartId: Scalars['ID'];
  lines: CartLineInput[];
  storefront: Storefront;
}) {
  const {cartLinesAdd} = await storefront.mutate<{
    cartLinesAdd: CartLinesAddPayload;
  }>(ADD_LINES_MUTATION, {
    variables: {cartId, lines},
  });

  return cartLinesAdd;
}

/**
 * Create a cart with line(s) mutation
 * @param cartId the current cart id
 * @param lineIds [ID!]! an array of cart line ids to remove
 * @see https://shopify.dev/api/storefront/2022-07/mutations/cartlinesremove
 * @returns mutated cart
 * @preserve
 */
export async function cartRemove({
  cartId,
  lineIds,
  storefront,
}: {
  cartId: Scalars['ID'];
  lineIds: Scalars['ID'][];
  storefront: Storefront;
}) {
  const {cartLinesRemove} = await storefront.mutate<{
    cartLinesRemove: CartLinesRemovePayload;
  }>(REMOVE_LINE_ITEMS_MUTATION, {
    variables: {
      cartId,
      lineIds,
    },
  });

  if (!cartLinesRemove) {
    throw new Error('No data returned from remove lines mutation');
  }
  return cartLinesRemove;
}

export async function getCart(
  {storefront}: {storefront: Storefront},
  cartId: Cart['id'],
) {
  if (!storefront) {
    throw new Error('missing storefront client in cart query');
  }

  const {cart} = await storefront.query<{cart: Cart}>(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}
