import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How can I track my shipment?",
    answer: "You can track your shipment by entering your tracking number in the 'Track' section of our website. This provides real-time updates on your cargo's location.",
    value: "item-1",
  },
  {
    question: "What is CITES documentation?",
    answer: "CITES (Convention on International Trade in Endangered Species) documentation is required for the international trade and transport of protected species. We handle all necessary permits and compliance.",
    value: "item-2",
  },
  {
    question: "Do you offer temperature-controlled shipping?",
    answer: "Yes, we provide specialized controlled shipping containers for sensitive cargo that requires specific temperature ranges throughout the transportation process.",
    value: "item-3",
  },
  {
    question: "What areas do you cover for delivery?",
    answer: "We offer global transportation and delivery services, covering major international shipping routes as well as specialized local delivery networks.",
    value: "item-4",
  },
  {
    question: "How do you ensure the safety of protected species during transport?",
    answer: "We follow strict international guidelines and use specialized equipment designed for the humane and safe transport of various species, ensuring full legal compliance.",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          FAQS
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          Common Questions
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
