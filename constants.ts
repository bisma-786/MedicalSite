import { Service, Doctor, Testimonial, FAQItem } from './types';

export const CLINIC_NAME = "Lumina Medical";
export const CLINIC_PHONE = "214-267-9109";
export const CLINIC_EMAIL = "info@luminamedical.com";
export const CLINIC_ADDRESS = "Lumina Medical Clinic, Dallas-Fort Worth Area";

export const MOCK_SERVICES: Service[] = [
  {
    id: 's1',
    title: 'IV Therapy',
    description: 'Customized IV infusions to boost energy, immunity, and recovery. Our medical-grade nutrients are delivered directly into your bloodstream for maximum absorption and effectiveness.',
    priceRange: '$150 - $400',
    icon: 'Droplets',
    category: 'Wellness',
    imageUrl: '/assets/images/ivf.jpg'
  },
  {
    id: 's2',
    title: 'Hormone Replacement Therapy',
    description: 'Bioidentical hormone optimization to restore vitality, energy, and well-being. Personalized treatment plans for men and women to combat aging and hormonal imbalances.',
    priceRange: '$200 - $500/mo',
    icon: 'Activity',
    category: 'Wellness',
    imageUrl: '/assets/images/hrt.png'
  },
  {
    id: 's3',
    title: 'Weight Loss Programs',
    description: 'Comprehensive weight management programs including GLP-1 agonists, nutritional counseling, and body composition analysis. Sustainable solutions for lasting results.',
    priceRange: '$500/mo',
    icon: 'Scale',
    category: 'Wellness',
    imageUrl: '/assets/images/weight.png'
  },
  {
    id: 's4',
    title: 'Advanced Aesthetics',
    description: 'Cutting-edge aesthetic treatments including Botox, dermal fillers, and skin rejuvenation. Enhance your natural beauty with safe, effective procedures.',
    priceRange: '$300 - $1500',
    icon: 'Heart',
    category: 'Aesthetic',
    imageUrl: '/assets/images/lumina.jpg'
  }
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sahba Yazdani',
    specialty: 'Medical Director & Aesthetic Specialist',
    bio: 'Dr. Yazdani is a board-certified physician with extensive expertise in aesthetic medicine, hormone optimization, and wellness protocols. Specializing in personalized treatment plans that deliver natural-looking results.',
    qualifications: ['MD', 'Aesthetic Medicine Specialist', 'Hormone Optimization Certified'],
    imageUrl: '/assets/images/sahba.png'
  },
  {
    id: 'd2',
    name: 'Dr. Olga',
    specialty: 'IV Therapy & Wellness Specialist',
    bio: 'Board-certified wellness physician focusing on IV therapy, nutrition, and preventive care. Dedicated to helping patients achieve optimal health through evidence-based wellness protocols.',
    qualifications: ['MD', 'Wellness Medicine Certified', 'IV Therapy Specialist'],
    imageUrl: '/assets/images/dr.png.jpg'
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Jessica R.',
    treatment: 'HRT & Weight Loss',
    content: 'After years of feeling tired and struggling with weight, Dr. Yazdani\'s personalized hormone optimization changed my life. I\'ve regained my energy and lost 30 pounds sustainably. The strategic approach to my wellness journey has been transformational.',
    rating: 5,
    date: '2024-01-15'
  },
  {
    id: 't2',
    name: 'Mark T.',
    treatment: 'IV Therapy',
    content: 'As a busy executive, the energy I get from regular IV therapy sessions keeps me performing at my peak. The convenient scheduling and professional service make it easy to prioritize my health.',
    rating: 5,
    date: '2024-02-10'
  },
  {
    id: 't3',
    name: 'Amanda K.',
    treatment: 'Aesthetic Treatments',
    content: 'Dr. Yazdani\'s aesthetic work is incredible - subtle, natural-looking results that make me feel confident. The consultation process is thorough and professional, ensuring I get exactly what I want.',
    rating: 5,
    date: '2024-01-28'
  },
  {
    id: 't4',
    name: 'Robert S.',
    treatment: 'Comprehensive Wellness',
    content: 'Lumina Medical transformed my approach to health. The comprehensive wellness programs have kept me healthy for years, preventing issues before they start. The value of maintaining my health with their services is immeasurable.',
    rating: 5,
    date: '2024-03-05'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "How do I book an appointment at Lumina Medical?",
    answer: "You can easily book your appointment online through our secure portal or by calling our office directly. Our scheduling system allows you to choose from available time slots that work with your schedule, and you'll receive confirmation and preparation instructions via email."
  },
  {
    question: "Do you accept insurance or is payment out-of-pocket?",
    answer: "We accept most major insurance plans for primary care services and preventive care. For specialized wellness treatments like hormone therapy and IV therapy, we operate as a cash-pay service, though we can provide documentation for potential insurance reimbursement depending on your plan."
  },
  {
    question: "How are treatments personalized to my specific needs?",
    answer: "Every treatment plan begins with comprehensive lab work and health assessment to understand your unique biochemistry and goals. Our medical team customizes hormone dosages, IV formulations, and weight loss protocols based on your individual results and ongoing monitoring."
  },
  {
    question: "Are your treatments safe and medically supervised?",
    answer: "All treatments are overseen by licensed physicians with extensive experience in wellness and preventive medicine. We conduct thorough health evaluations before starting any protocol and maintain regular monitoring to ensure safety and effectiveness throughout your care."
  },
  {
    question: "What should I expect during my first visit?",
    answer: "Your initial consultation includes a comprehensive health history review, physical examination, and discussion of your wellness goals. We'll likely order lab work to assess your baseline health markers and spend time creating your personalized treatment roadmap. Plan for 60-90 minutes for this thorough evaluation."
  },
  {
    question: "Who is a good candidate for your weight loss and hormone programs?",
    answer: "Our programs serve adults experiencing hormonal imbalances, stubborn weight gain, or declining energy levels that haven't responded to conventional approaches. During your consultation, we'll evaluate your medical history and current health status to determine if our protocols are appropriate for you."
  },
  {
    question: "Do you offer follow-up care or telehealth consultations?",
    answer: "Yes, we provide ongoing support through in-person visits and telehealth consultations as needed. Our team monitors your progress regularly and adjusts your treatment plan to ensure optimal results. Schedule a consultation to learn more about our comprehensive care approach."
  }
];