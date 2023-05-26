import {CartDrawer, Drawer, useDrawer} from './Drawer';
import {CartHeader} from './Cart';
import {Fetcher, useFetchers, useMatches} from '@remix-run/react';
import {useEffect, useMemo} from 'react';

type Props = {
  children: React.ReactNode;
  title: string;
};

export function Layout({children, title}: Props) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const fetchers = useFetchers();
  const [root] = useMatches();
  const cart = root.data?.cart;

  const addToCartFetchers: Fetcher[] = useMemo(() => [], []);

  for (const fetcher of fetchers) {
    if (fetcher?.formData?.get('cartAction') === 'ADD_TO_CART') {
      addToCartFetchers.push(fetcher);
    }
  }

  useEffect(() => {
    if (isOpen || addToCartFetchers.length === 0) return;
    openDrawer();
  }, [addToCartFetchers, isOpen, openDrawer]);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <header
        role="banner"
        className="p-6 lg:p-8 sticky backdrop-blur-lg z-40 top-0 leading-none transition shadow-sm"
      >
        <div className="flex gap-12 justify-between items-center">
          <a className="font-bold" href="/">
            {title}
          </a>
          <CartHeader cart={cart} openDrawer={openDrawer} />
        </div>
      </header>

      <main role="main" id="mainContent" className="flex-grow p-6 lg:p-8">
        {children}
        <Drawer open={isOpen} onClose={closeDrawer}>
          <CartDrawer cart={cart} close={closeDrawer} />
        </Drawer>
      </main>
    </div>
  );
}
