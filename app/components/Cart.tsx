import {Await, Link, useFetcher} from '@remix-run/react';
import {Image, Money, flattenConnection} from '@shopify/hydrogen';
import {Cart, CartLine} from '@shopify/hydrogen/storefront-api-types';
import {Suspense} from 'react';

export function CartLineItems({linesObj}: {linesObj: Cart['lines']}) {
  const lines = flattenConnection(linesObj);
  return (
    <div className="space-y-8">
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </div>
  );
}

function LineItem({lineItem}: {lineItem: CartLine}) {
  const {merchandise, quantity} = lineItem;

  return (
    <div className="flex gap-4">
      <Link
        to={`/products/${merchandise.product.handle}`}
        className="flex-shrink-0"
      >
        {merchandise.image && (
          <Image data={merchandise.image} width={110} height={110} />
        )}
      </Link>
      <div className="flex-1">
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="no-underline hover:underline"
        >
          {merchandise.product.title}
        </Link>
        <div className="text-gray-800 text-sm">{merchandise.title}</div>
        <div className="text-gray-800 text-sm">Qty: {quantity}</div>
        <ItemRemoveButton lineIds={[lineItem.id]} />
      </div>
      <Money data={lineItem.cost.totalAmount} />
    </div>
  );
}

function ItemRemoveButton({lineIds}: {lineIds: CartLine['id'][]}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
      <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
      <button
        className="bg-white border-black text-black hover:text-white hover:bg-black rounded-md font-small text-center my-2 max-w-xl leading-none border w-10 h-10 flex items-center justify-center"
        type="submit"
        title="Remove from cart"
      >
        <IconRemove />
      </button>
    </fetcher.Form>
  );
}

function IconRemove() {
  return (
    <svg
      fill="transparent"
      stroke="currentColor"
      viewBox="0 0 20 20"
      className="w-5 h-5"
    >
      <title>Remove</title>
      <path
        d="M4 6H16"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.5 6L6 17H14L14.5 6"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export function CartSummary({cost}: {cost: Cart['cost']}) {
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-green-600">Free and carbon neutral</dd>
        </div>
      </dl>
    </>
  );
}

export function CartActions({checkoutUrl}: {checkoutUrl: Cart['checkoutUrl']}) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex flex-col mt-2">
      <a
        href={checkoutUrl}
        className="bg-black text-white px-6 py-3 w-full rounded-md text-center font-medium"
      >
        Continue to Checkout
      </a>
    </div>
  );
}

export function CartHeader({
  cart,
  openDrawer,
}: {
  cart: Cart;
  openDrawer: () => void;
}) {
  return (
    <Suspense>
      <Await resolve={cart}>
        {(data) => (
          <button
            className="relative ml-auto flex items-center justify-center w-8 h-8"
            onClick={openDrawer}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <title>Bag</title>
              <path
                fillRule="evenodd"
                d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
              ></path>
            </svg>
            {data?.totalQuantity > 0 && (
              <div className="text-contrast bg-red-500 text-white absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px">
                <span>{data?.totalQuantity}</span>
              </div>
            )}
          </button>
        )}
      </Await>
    </Suspense>
  );
}
