// Type declarations for shared/brand.mjs (runtime source of truth).
// Keeps brand.mjs as the canonical .mjs export while giving TS real types.

export declare const BRAND: {
  name: string;
  shortName: string;
  byline: string;
  fullName: string;
  tagline: string;
  mission: string;
  colors: Record<string, string>;
  typography: {
    fontFamily: {
      display: string;
      body: string;
      mono: string;
    };
  };
  logo: {
    concept: string;
    meaning: string;
    paths: {
      svg: string;
      favicon: string;
      ogImage: string;
    };
  };
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
};
