import { Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    iconSize?: number;
    size?: 'sm' | 'md' | 'lg';
    linkTo?: string;
    showVersion?: boolean;
}

export function Logo({
    className,
    iconClassName,
    textClassName,
    iconSize = 18,
    size = 'md',
    linkTo,
    showVersion = false
}: LogoProps) {

    const sizeClasses = {
        sm: {
            container: 'w-7 h-7 rounded',
            icon: 14,
            text: 'text-base'
        },
        md: {
            container: 'w-8 h-8 rounded-lg',
            icon: 18,
            text: 'text-lg'
        },
        lg: {
            container: 'w-10 h-10 rounded-xl',
            icon: 24,
            text: 'text-xl'
        }
    };

    const currentSize = sizeClasses[size];
    const finalIconSize = iconSize || currentSize.icon;

    const Content = () => (
        <div className={cn("flex items-center gap-2.5", className)}>
            <div className={cn(
                "bg-black flex items-center justify-center text-white border border-black shadow-sm",
                currentSize.container,
                iconClassName
            )}>
                <Cloud size={finalIconSize} fill="currentColor" />
            </div>
            <div className="flex items-center gap-1.5">
                <span className={cn(
                    "font-bold tracking-tight text-[var(--text-primary)]",
                    currentSize.text,
                    textClassName
                )}>
                    Telebox
                </span>
                {showVersion && (
                    <span className="text-[10px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded">
                        v0.1.0
                    </span>
                )}
            </div>
        </div>
    );

    if (linkTo) {
        return (
            <Link to={linkTo} className="hover:opacity-90 transition-opacity">
                <Content />
            </Link>
        );
    }

    return <Content />;
}
