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

  return (
    <section id={id} className="container-shell mt-20">
      <div className="section-card px-6 py-8 md:px-8">
        <SectionHeading
          label="联系方式"
          title="欢迎通过你常用的方式联系"
          description="这里的邮箱、社交链接和联系方式，都可以在后台网站设置页里直接修改。"
        />
        <div className="mt-8">
          <ContactCards items={contacts} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a href={`mailto:${settings.contact_email}`} className="primary-button">
            <Mail size={16} />
            发送邮件
          </a>
          <Link href={settings.whatsapp_url || "#"} className="secondary-button">
            <MessageCircleMore size={16} />
            WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
