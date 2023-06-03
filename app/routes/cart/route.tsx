import {Link, useLoaderData} from '@remix-run/react';
export {action} from './action';
import {CartActions, CartLineItems, CartSummary} from '~/components/Cart';
import {CART_QUERY} from './query';
import {LoaderArgs} from '@shopify/remix-oxygen';
import {
  BaseCartLineConnection,
  Cart,
} from '@shopify/hydrogen/storefront-api-types';

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
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-screen-lg grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12">
          <div className="md:translate-y-4">
            <CartLineItems linesObj={cart.lines as BaseCartLineConnection} />
          </div>
          <div className="fixed left-0 right-0 bottom-0 md:sticky md:top-24 grid gap-6 p-4 md:px-6 md:translate-y-4 bg-gray-100 rounded-xl w-full dark:bg-zinc-800 dark:border">
            <CartSummary cost={cart.cost} />
            <CartActions checkoutUrl={cart.checkoutUrl} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid place-content-center flex-grow md:py-12 md:px-8 px-6 py-10">
      <div className="space-y-7">
        <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
          Your cart is empty
        </h2>
        <Link
          to="/"
          className="block rounded-xl font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white dark:bg-lime-400 dark:text-lime-950"
        >
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
