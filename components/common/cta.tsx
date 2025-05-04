import { Users } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <div className="text-center bg-blue-600 rounded-lg p-8 shadow-md">
      <h3 className="text-xl font-bold text-white mb-3">
        Need a custom solution?
      </h3>
      <p className="text-blue-100 mb-5 max-w-xl mx-auto">
        Our team can create a tailored solution for your specific business needs
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-medium px-5 py-2 rounded-lg transition-all duration-200"
      >
        <Users size={18} />
        Contact our team
      </Link>
    </div>
  );
}
