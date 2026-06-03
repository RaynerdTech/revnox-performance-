// This file shows the branded loader while the wishlist route is loading.
import { PageLoader } from "@/components/ui/page-loader";

export default function WishlistLoading() {
  return <PageLoader label="Loading wishlist" />;
}