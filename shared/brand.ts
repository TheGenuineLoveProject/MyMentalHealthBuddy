export interface Brand {
  name: string;
  tagline: string;
  mission: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gold: string;
    background: string;
    text: string;
  };
  logo: {
    concept: string;
    meaning: string;
  };
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
}

export declare const BRAND: Brand;
