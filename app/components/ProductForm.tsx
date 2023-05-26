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
        className="bg-black text-white px-6 py-3 w-full rounded-md text-center font-medium max-w-[400px]"
        type="submit"
      >
        Add to Bag
      </button>
    </fetcher.Form>
  );
}
