import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-muted">
      <div className="max-w-7xl mx-auto px-5 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Link href="/">
              <Image src="/logo.svg" alt="logo" width={150} height={150} />
            </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Menyediakan buah segar berkualitas premium untuk keluarga Anda.
            </p>
          </div>
          <FooterColumn
            title="Informasi"
            links={[
              { name: "Tentang Kami", href: "#" },
              { name: "Cara Pemesanan", href: "#" },
              { name: "Pengiriman", href: "#" },
              { name: "FAQ", href: "#" },
            ]}
          />

          <FooterColumn
            title="Kontak"
            links={[
              { name: "WhatsApp", href: "#" },
              { name: "Email", href: "#" },
              { name: "Instagram", href: "#" },
              { name: "Facebook", href: "#" },
            ]}
          />
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FreshFruit. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Syarat & Ketentuan
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

interface FooterColumnProps {
  title: string
  links: {
    name: string
    href: string
  }[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}