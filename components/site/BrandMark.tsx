import Image from "next/image";
import Link from "next/link";

export default function BrandMark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <Image
        src="/brand/verifika2_mark.svg"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9"
        priority
      />
      <div className="leading-tight">
        <Image
          src="/brand/verifika2_wordmark_traced.svg"
          alt="Verifika2"
          width={170}
          height={38}
          priority
          className="h-7 w-auto"
        />
        <p className="pt-1 text-xs text-slate-600">Portal inmobiliario verificado</p>
      </div>
    </Link>
  );
}

