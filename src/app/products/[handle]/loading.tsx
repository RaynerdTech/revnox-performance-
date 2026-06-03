// This file shows the branded loader while an individual Shopify product page is loading.
import { PageLoader } from "@/components/ui/page-loader";

export default function ProductLoading() {
  return <PageLoader label="Loading product" />;
}