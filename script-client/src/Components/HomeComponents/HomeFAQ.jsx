import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "How long does shipping take?",
    answer:
      "We carefully package and ship all orders within 1–2 business days. Delivery typically takes 3–5 business days anywhere in Bangladesh. You’ll receive a tracking link via email as soon as your order ships to monitor its journey to your home.",
  },
  {
    question: "Can I return or exchange my item?",
    answer:
      "Yes! If your decor piece isn't perfect for your space, you can request a return or exchange within 7 days of delivery. Items must be in original condition and packaging. Check our Refund Policy page for full details.",
  },
  {
    question: "Are these pieces mass-produced?",
    answer:
      "No. We pride ourselves on offering unique, often handcrafted pieces that are sourced in limited quantities. This ensures that your home decor remains exclusive and authentic to your style.",
  },
  {
    question: "Can I get styling advice?",
    answer:
      "We'd love to help! Stay tuned for our upcoming 'Style Consult' feature. In the meantime, feel free to reach out with photos of your space, and our team will be happy to offer suggestions.",
  },
  {
    question: "How do I contact Homiara Limited support?",
    answer:
      "You can email us at support@homiara.com or use the contact information provided in our footer. We aim to respond within 24 hours, Monday–Saturday.",
  },
];

const HomeFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="px-4 sm:px-10 py-10 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => toggleIndex(index)}
              >
                <span className="text-lg font-medium text-gray-800">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 py-3 bg-white text-gray-700">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
