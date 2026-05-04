import { MessageCircle } from "lucide-react";

interface Props {
  /** Número WhatsApp em formato internacional sem o + (ex: 5511999999999) */
  whatsapp?: string;
  message?: string;
}

export default function ContactButton({
  whatsapp = "5511999999999",
  message = "Olá! Estou na área de membros da MTCprop e gostaria de ajuda.",
}: Props) {
  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full border border-[color:var(--color-brand-green-dim)] bg-[color:var(--color-surface-2)] py-3 pl-4 pr-5 text-sm font-medium text-[color:var(--color-brand-green)] shadow-xl transition hover:bg-[color:var(--color-brand-green)] hover:text-neutral-950"
    >
      <MessageCircle className="h-5 w-5" />
      Entre em contato
    </a>
  );
}
