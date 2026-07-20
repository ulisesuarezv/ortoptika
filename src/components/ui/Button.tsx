import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "font-heading tracking-tight transition-all duration-200 will-change-transform " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // CTA de máximo énfasis: bloque lima de marca con texto NAVY (el lima nunca
  // lleva texto blanco: fallaría AA; navy sobre lima ≈ 9:1).
  primary:
    "bg-accent-500 text-slate-ink-900 shadow-soft hover:bg-accent-400 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0 active:bg-accent-600",
  // Acción de marca (azul profundo): sólido, sobrio.
  secondary:
    "bg-primary-700 text-white hover:bg-primary-800 hover:-translate-y-0.5 active:translate-y-0",
  // Bajo énfasis, contorno fino sobre fondos claros.
  ghost:
    "bg-transparent text-primary-800 ring-1 ring-inset ring-slate-ink-200 hover:ring-primary-300 hover:bg-primary-50/60 active:bg-primary-100",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
    /** true → enlace externo (nueva pestaña, rel seguro). */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function classes(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");
}

/** Quita las props de presentación para dejar solo atributos DOM válidos. */
function domProps<T extends Record<string, unknown>>(props: T) {
  const {
    variant,
    size,
    className,
    children,
    href,
    external,
    ...rest
  } = props as T & { external?: boolean };
  void variant;
  void size;
  void className;
  void children;
  void href;
  void external;
  return rest;
}

/**
 * Botón/enlace polimórfico con variantes (primary/secondary/ghost) y foco AA.
 * - Sin `href` → <button>.
 * - Con `href` externo → <a target="_blank">.
 * - Con `href` interno → <Link> de Next.
 */
export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const cls = classes(variant, size, className);

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    const rest = domProps(props);
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...domProps(props)}>
      {children}
    </button>
  );
}
