/**
 * Phase 35 — lumi-library public barrel.
 */

export type { LibraryItem, LibraryItemType } from "./content/libraryCatalog";
export {
  LIBRARY_CATALOG,
  getLibraryItem,
  getLibraryItemsByTag,
  getLibraryItemsByType,
} from "./content/libraryCatalog";

export type { DownloadPayload } from "./content/libraryDownloads";
export {
  downloadItem,
  PROFESSIONAL_CARE_DISCLAIMER,
  LibraryItemNotFoundError,
} from "./content/libraryDownloads";

export type { LibraryCardProps } from "./components/LibraryCard";
export { LibraryCard } from "./components/LibraryCard";

export type { LibrarySafetyRule } from "./governance/librarySafetyRules";
export { LIBRARY_SAFETY_RULES } from "./governance/librarySafetyRules";
