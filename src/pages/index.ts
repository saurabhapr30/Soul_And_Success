/* ================================================== */
/* PAGES — Barrel Export                                */
/* ================================================== */
/* Only the HomePage is eagerly exported here.          */
/* All other pages are lazy-loaded via the router.      */
/* Do NOT add other page exports — it defeats           */
/* code-splitting via React.lazy().                     */
/* ================================================== */

export { HomePage } from './HomePage';
