// Single source of truth for the founder's public booking link. Every
// employer-facing call to action points here so the booking identity cannot
// drift between the header, the hero and the contact page. The link is the
// Public Google Appointments URL configured for the site. It is not probed in
// CI beyond link configuration checks, and no slot is ever reserved programmatically.
export const BOOKING_URL = 'https://calendar.app.google/5xbLcjnJdEKsHMqy9';
