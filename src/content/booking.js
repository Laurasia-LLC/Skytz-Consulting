// Single source of truth for the founder's public booking link. Every
// employer-facing call to action points here so the booking identity cannot
// drift between the header, the hero and the contact page. The link is the
// Google Appointments schedule owned by ph@skytz-consulting.com; it is not
// probed or pre-filled anywhere in the app, and no slot is ever reserved
// programmatically.
export const BOOKING_URL = 'https://calendar.app.google/5xbLcjnJdEKsHMqy9';
