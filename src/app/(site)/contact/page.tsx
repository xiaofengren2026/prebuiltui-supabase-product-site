import { ContactSection } from "@/components/site/contact-section";
import { getSiteSettings } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <main className="pb-8">
      <ContactSection settings={settings} />
    </main>
  );
}
