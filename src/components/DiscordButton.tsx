import { FaDiscord } from 'react-icons/fa';

interface DiscordButtonProps {
  href: string;
  text?: string;
  className?: string;
}

function DiscordButton({ href, text = 'Join our Discord', className }: DiscordButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`border border-2 border-black inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium rounded-md transition-colors ${className ?? ''}`}
    >
      <FaDiscord className="w-5 h-5" aria-hidden="true" />
      <span>{text}</span>
    </a>
  );
}

export default DiscordButton;
