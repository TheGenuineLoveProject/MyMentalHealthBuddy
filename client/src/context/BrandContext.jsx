import { createContext, useContext } from "react";
import { BRAND } from "@shared/brand.mjs";

const BrandContext = createContext(BRAND);
export const useBrand = () => useContext(BrandContext);
export default BrandContext;
<BrandContext.Provider value={BRAND}>
  <App />
</BrandContext.Provider>