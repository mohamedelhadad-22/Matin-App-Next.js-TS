import React from "react";
import { useTranslations } from "next-intl";
import { FooterLink } from "@/types";
import { Link } from "@/i18n/routing";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

// لاحظ الجمع: links
interface FooterComponentProps {
    links: FooterLink[];
}

export function FooterComponent({ links }: FooterComponentProps) {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-matin-primary text-white mt-auto pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                    {/* Brand Section */}
                    <div className="text-start space-y-4">
                        <h3 className="text-2xl font-bold">
                            {t('brandName')} <span className="text-matin-action">.</span>
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {t('description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-start">
                        <h3 className="text-lg font-bold mb-6">{t('quickLinks')}</h3>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            {links.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="hover:text-matin-action transition-colors">
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="text-start">
                        <h3 className="text-lg font-bold mb-6">{t('contactUs')}</h3>
                        <p className="text-gray-300 text-sm mb-4">{t('contactText')}</p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-matin-action transition"><Facebook size={20} /></Link>
                            <Link href="#" className="hover:text-matin-action transition"><Twitter size={20} /></Link>
                            <Link href="#" className="hover:text-matin-action transition"><Instagram size={20} /></Link>
                            <Link href="#" className="hover:text-matin-action transition"><Linkedin size={20} /></Link>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="text-start">
                        <h3 className="text-lg font-bold mb-6">{t('newsletter')}</h3>
                        <p className="text-gray-300 text-sm mb-4">{t('newsletterText')}</p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder={t('emailPlaceholder')}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-matin-action"
                            />
                            <Button size="icon" className="bg-matin-action hover:bg-orange-600 text-white">
                                <Send size={18} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
                    {t('copyright', { year: new Date().getFullYear(), brandName: t('brandName') })}
                </div>
            </div>
        </footer>
    )
}