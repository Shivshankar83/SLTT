
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";
import Footer from "./Footer";
import CommonNavbar from './CommonNavbar';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});

  // FAQ data categorized
  const faqData = {
    general: [
      {
        id: "general-1",
        question: "What services do you offer?",
        answer:
          "We offer a comprehensive range of digital solutions including web development, mobile app development, UI/UX design, e-commerce solutions, and digital marketing services tailored to your business needs.",
      },
      {
        id: "general-2",
        question: "How long does it typically take to complete a project?",
        answer: `Project timelines vary based on complexity and scope. A simple website might take 2-4 weeks, while complex web applications can take 3-6 months. During our initial consultation, we'll provide you with a detailed timeline specific to your project requirements.`,
      },
      {
        id: "general-3",
        question: "Do you provide ongoing support after project completion?",
        answer:
          "Yes, we offer various maintenance and support packages to ensure your digital products continue to function optimally. Our support packages include regular updates, security patches, performance optimization, and technical assistance.",
      },
    ],
    pricing: [
      {
        id: "pricing-1",
        question: "How is project pricing determined?",
        answer:
          "Our pricing is transparent and based on project scope, complexity, and timeline. We provide detailed quotations after understanding your requirements through an initial consultation. We work with various budget ranges and can tailor solutions to meet your financial constraints.",
      },
      {
        id: "pricing-2",
        question: "Do you offer payment plans?",
        answer:
          "Yes, we offer flexible payment schedules typically structured around project milestones. For larger projects, we generally require a deposit upfront, with remaining payments distributed throughout the development process.",
      },
      {
        id: "pricing-3",
        question: "Are there any hidden costs I should be aware of?",
        answer:
          "We pride ourselves on transparency. All costs are outlined in our proposal and contract before project commencement. If any unforeseen requirements arise during development that would affect pricing, we discuss these with you before proceeding.",
      },
    ],
    technical: [
      {
        id: "technical-1",
        question: "What technologies do you specialize in?",
        answer:
          "Our team is proficient in a wide range of technologies including React, Angular, Vue.js, Node.js, Python, PHP, WordPress, Shopify, and many more. We select the most appropriate technology stack based on your specific project requirements and business goals.",
      },
      {
        id: "technical-2",
        question: "Do you handle hosting and domain registration?",
        answer:
          "Yes, we can manage hosting setup, domain registration, and deployment of your website or application. We work with various hosting providers and can recommend the best solution based on your needs for performance, security, and scalability.",
      },
      {
        id: "technical-3",
        question: "How do you ensure website security?",
        answer:
          "Security is paramount in our development process. We implement industry best practices including SSL certification, secure authentication methods, data encryption, regular security updates, and protection against common vulnerabilities. We also conduct security testing before launch.",
      },
      {
        id: "technical-4",
        question: "Are your websites mobile-friendly?",
        answer: `Absolutely! All our websites and applications are built with a mobile-first approach, ensuring they're fully responsive and provide optimal user experience across all devices and screen sizes. We rigorously test on multiple devices before launch.`,
      },
    ],
    process: [
      {
        id: "process-1",
        question: "What does your development process look like?",
        answer:
          "Our development process follows an agile methodology with 6 key phases: Discovery & Planning, Design, Development, Testing & QA, Deployment, and Post-launch Support. We maintain clear communication throughout, with regular updates and opportunities for feedback.",
      },
      {
        id: "process-2",
        question:
          "How involved will I need to be during the development process?",
        answer:
          "Client involvement is crucial for project success. We typically require your input during initial planning, feedback on designs and prototypes, content provision, and milestone approvals. However, we structure the process to be efficient with your time while ensuring your vision is realized.",
      },
      {
        id: "process-3",
        question:
          "How do you handle project changes or additional requirements?",
        answer:
          "We understand that requirements can evolve. Minor changes are often accommodated within the project scope. For significant changes, we follow a change request process where we assess the impact on timeline and budget, then provide you with options before proceeding.",
      },
    ],
  };

  // All categories combined for search functionality
  const allFaqs = Object.values(faqData).flat();

  // Toggle FAQ item open/closed
  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter FAQs based on search query and active category
  const filteredFaqs =
    searchQuery.trim() === ""
      ? activeCategory === "all"
        ? allFaqs
        : faqData[activeCategory] || []
      : allFaqs.filter(
          (faq) =>
            (activeCategory === "all" || faq.id.startsWith(activeCategory)) &&
            (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
        );

  // Get unique categories
  const categories = [
    { id: "all", name: "All Questions" },
    { id: "general", name: "General" },
    { id: "pricing", name: "Pricing" },
    { id: "technical", name: "Technical" },
    { id: "process", name: "Process" },
  ];

  return (
    <>      
      <CommonNavbar />  

      <div className="bg-gradient-to-b from-blue-300 to-white dark:from-blue-400 dark:to-gray-700 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full mb-3">
              Support Center
            </span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about our services, process, and
              pricing. Can't find what you're looking for? Contact our support
              team.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for questions or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-10 flex flex-wrap justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-2 inline-flex space-x-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="max-w-3xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <HelpCircle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                  No matching questions found
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Try adjusting your search or browse all categories
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 ${
                      openItems[faq.id]
                        ? "shadow-md ring-1 ring-blue-200 dark:ring-blue-800"
                        : "hover:shadow-md"
                    }`}
                  >
                    <button
                      className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                      onClick={() => toggleItem(faq.id)}
                      aria-expanded={openItems[faq.id]}
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                      <div
                        className={`ml-4 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${
                          openItems[faq.id]
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {openItems[faq.id] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </div>
                    </button>

                    {openItems[faq.id] && (
                      <div className="px-6 pb-5">
                        <div className="h-px bg-gray-200 dark:bg-gray-700 mb-4"></div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Still Have Questions */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="md:max-w-2xl">
                <h3 className="text-2xl font-bold text-white">
                  Still have questions?
                </h3>
                <p className="mt-3 text-blue-100">
                  Can't find the answer you're looking for? Please contact our
                  friendly support team.
                </p>
              </div>
              <div className="mt-8 md:mt-0 md:ml-6 flex justify-center md:justify-end">
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-blue-700 dark:text-white bg-white dark:bg-blue-600 hover:bg-blue-50 dark:hover:bg-blue-700 transition-colors duration-200"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;