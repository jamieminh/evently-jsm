import Image from "next/image";
import Link from "next/link";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            alt="Evently"
            width={128}
            height={38}
          />
        </Link>
        <p>2024 Evently. All Rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
