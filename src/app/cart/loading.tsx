// This file shows the branded loader while the Shopify cart route is loading.
import { PageLoader } from "@/components/ui/page-loader";

export default function CartLoading() {
  return <PageLoader label="Loading cart" />;
}