import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '@/lib/mixpanel';

const PAGE_NAMES: Record<string, string> = {
  '/': 'Entry',
  '/home': 'Home',
  '/onboarding': 'Onboarding',
  '/notice': 'Notice',
  '/timetable': 'Timetable',
  '/performance': 'Performance',
  '/foodtruck': 'FoodTruck List',
  '/yard': 'Yard List',
  '/pub': 'Pub List',
  '/makers': 'Makers',
  '/ticket': 'Ticket Reservation',
  '/myticket': 'My Ticket',
  '/info': 'Info Input',
  '/masked-singer': 'Masked Singer',
  '/masked-singer/result': 'Masked Singer Result',
  '/info-guide': 'Info Guide',
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pageName =
      PAGE_NAMES[location.pathname] ??
      (location.pathname.startsWith('/foodtruck/')
        ? 'FoodTruck Detail'
        : location.pathname.startsWith('/yard/')
          ? 'Booth Detail'
          : location.pathname.startsWith('/pub/')
            ? 'Pub Detail'
            : location.pathname);

    track('page_viewed', { path: location.pathname, page_name: pageName });
  }, [location.pathname]);
};
