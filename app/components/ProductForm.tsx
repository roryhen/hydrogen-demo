import {useFetcher, useMatches} from '@remix-run/react';
import {ProductVariant} from '@shopify/hydrogen/storefront-api-types';

export function ProductForm({variantId}: {variantId: ProductVariant['id']}) {
  const [root] = useMatches();
  const selectedLocale = root?.data?.selectedLocale;
  const fetcher = useFetcher();

  const lines = [{merchandiseId: variantId, quantity: 1}];

  return (
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value={'ADD_TO_CART'} />
      <input
        type="hidden"
        name="countryCode"
        value={selectedLocale?.country ?? 'US'}
      />
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <button
        className="bg-black text-white px-6 py-3 w-full rounded-xl text-center font-medium dark:bg-lime-400 dark:text-lime-950"
        type="submit"
      >
        Add to Bag
      </button>
    </fetcher.Form>
  );
}
