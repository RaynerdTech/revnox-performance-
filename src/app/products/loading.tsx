// This file shows the branded loader while the Shopify product catalog route is loading.
import { PageLoader } from "@/components/ui/page-loader";

export default function ProductsLoading() {
  return <PageLoader label="Loading catalog" />;
}