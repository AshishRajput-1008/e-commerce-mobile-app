// Centralized remote placeholder imagery.
// Swap these Unsplash source URLs for your CDN/product photography later —
// every screen references images only through this file or product.images,
// so restyling imagery never requires touching component code.

export const heroImages = {
  // Fresh organic vegetables
  slide1: require("../../assets/images/hero-farm-produce.png"),

  // Fresh vegetables / farm produce
  slide2:
    "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1200&q=80",

  // Green plant / nursery
  slide3:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80",
};

export const categoryImages: Record<string, string> = {
  vegetables:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
 seeds:
  "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400&q=80",
  plants:
    "https://images.pexels.com/photos/9707061/pexels-photo-9707061.jpeg",
  flowers:
    "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80",
  fruits:
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80",
  herbs:
    "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&q=80",
  farming:
    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80",
  pots:
    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80",
};

export const authBackground =
  "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80";
