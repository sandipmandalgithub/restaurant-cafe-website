import { getMenus } from "./menuService";
import { getGallery } from "./galleryService";
import { getEnquiries } from "./enquiryService";

export const getDashboardStats = async () => {
  const [menus, gallery, enquiries] = await Promise.all([
    getMenus(),
    getGallery(),
    getEnquiries(),
  ]);

  const newEnquiries = enquiries.filter(
    (enquiry) => enquiry.status === "New"
  );

  return {
    totalMenus: menus.length,
    totalGallery: gallery.length,
    totalEnquiries: enquiries.length,
    newEnquiries: newEnquiries.length,
  };
};