import {Link, useLoaderData} from '@remix-run/react';
export {action} from './action';
import {CartActions, CartLineItems, CartSummary} from '~/components/Cart';
import {CART_QUERY} from './query';
import {LoaderArgs} from '@shopify/remix-oxygen';
import {Cart} from '@shopify/hydrogen/storefront-api-types';

export async function loader({context}: LoaderArgs) {
  const cartId = await context.session.get('cartId');

  const cart = cartId
    ? (
        await context.storefront.query<{cart: Cart}>(CART_QUERY, {
          variables: {
            cartId,
            country: context.storefront.i18n.country,
            language: context.storefront.i18n.language,
          },
          cache: context.storefront.CacheNone(),
        })
      ).cart
    : null;

  return {cart};
}

export default function Cart() {
  const {cart} = useLoaderData<typeof loader>();

  if (cart && cart?.totalQuantity > 0) {
    return (
      <div className="w-full max-w-6xl mx-auto pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12">
        <div className="flex-grow md:translate-y-4">
          <CartLineItems linesObj={cart.lines} />
        </div>
        <div className="fixed left-0 right-0 bottom-0 md:sticky md:top-[65px] grid gap-6 p-4 md:px-6 md:translate-y-4 bg-gray-100 rounded-md w-full">
          <CartSummary cost={cart.cost} />
          <CartActions checkoutUrl={cart.checkoutUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
        Your cart is empty
      </h2>
      <Link
        to="/"
        className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
      >
        Continue shopping
      </Link>
    </div>
  );
}
