// The roles described on the home page and the roles listed on /vacancies are
// the same set. Keeping them in one module is deliberate: before this, the
// home page claimed three US searches while the vacancy page listed four
// German roles and one US role, and no reader could reconcile the two.
//
// Only add a role here once a role brief exists for it, so the count on the
// home page can never exceed what a visitor can actually open and read.
export const VACANCIES = [
  { key: 'gfAssistenz', pdfPath: '/GF-Assistenz.pdf' },
  { key: 'bauueberwachung', pdfPath: '/Bauueberwachung.pdf' },
  { key: 'technischerZeichner', pdfPath: '/Technischer-Zeichner.pdf' },
  { key: 'bimManagerCoordinator', pdfPath: '/BIM-Manager-Coordinator.pdf' },
  { key: 'expertSifa', pdfPath: '/Experte-Sifa.pdf' },
];

/**
 * Builds the sentence fragments shown under "Searches running now" /
 * "Aktuelle Mandate". Titles and locations both come from the vacancy
 * locale entries, so the same role cannot be described two different ways.
 */
export function mandateSummaries(t) {
  return VACANCIES.map(({ key }) => {
    const title = t(`vacancies.positions.${key}.title`);
    const location = t(`vacancies.positions.${key}.location`);
    return { key, title, location };
  });
}
