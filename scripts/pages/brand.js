import { mountSiteHeader, syncSiteHeader } from "../components/header.js";
import { getUser } from "../services/auth-service.js";
import { cartCount } from "../services/cart-service.js";

const headerRefs = mountSiteHeader({ showCart: true, currentNav: "brand" });
const user = getUser();

syncSiteHeader(headerRefs, {
  userName: user?.name || null,
  cartCountValue: cartCount(),
});
