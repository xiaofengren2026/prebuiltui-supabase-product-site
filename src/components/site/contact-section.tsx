import Link from "next/link";
import { Mail, MessageCircleMore } from "lucide-react";

import { ContactCards } from "@/components/site/contact-cards";
import { SectionHeading } from "@/components/site/section-heading";
import type { SiteSettings } from "@/lib/types";
import { buildContactItems } from "@/lib/utils";

type ContactSectionProps = {
  settings: SiteSettings;
  id?: string;
};

export function ContactSection({ settings, id }: ContactSectionProps) {
  const contacts = buildContactItems(settings);
  const hasEmail = Boolean(settings.contact_email?.trim() && settings.contact_email.includes("@"));
  const hasWhatsApp = Boolean(settings.whatsapp_url?.trim());

  return (
    <section id={id} className="container-shell mt-20">
      <div className="section-card px-6 py-8 md:px-8">
        <SectionHeading
          label="联系我们"
          title="真诚欢迎前来合作咨询"
        />
        <div className="mt-8">
          <ContactCards items={contacts} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {hasEmail ? (
            <a href={`mailto:${settings.contact_email}`} className="primary-button">
              <Mail size={16} />
              发送邮件
            </a>
          ) : (
            <span className="primary-button opacity-85">待补充邮箱</span>
          )}

          {hasWhatsApp ? (
            <a href={settings.whatsapp_url} className="secondary-button" target="_blank" rel="noreferrer">
              <MessageCircleMore size={16} />
              WhatsApp
            </a>
          ) : (
            <Link href="/#contact" className="secondary-button">
              <MessageCircleMore size={16} />
              返回联系区
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
