import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageCircle, ChevronDown } from 'lucide-react';
import '../../styles/Help.css';

const Help = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'Account & Authentication',
      question: 'How do I reset my password?',
      answer:
        'To reset your password, click on "Forgot Password" on the login page. Enter your email address and follow the instructions sent to your email. You will receive a link to create a new password.',
    },
    {
      id: 2,
      category: 'Account & Authentication',
      question: 'How do I update my profile information?',
      answer:
        'Go to your Profile page and click on the Edit button. You can update your personal details, contact information, and profile picture. Remember to save your changes.',
    },
    {
      id: 3,
      category: 'Leave Management',
      question: 'How do I apply for leave?',
      answer:
        'Navigate to the Leave section, click "Apply for Leave", select the leave type, choose your dates, add any remarks, and submit. Your manager will review and approve or reject your request.',
    },
    {
      id: 4,
      category: 'Leave Management',
      question: 'Can I cancel an approved leave?',
      answer:
        'Once a leave is approved, you can request cancellation by contacting your HR manager. Contact information is available in the Help section.',
    },
    {
      id: 5,
      category: 'Attendance',
      question: 'How does the check-in/check-out work?',
      answer:
        'On the Attendance page, click "Check In" when you arrive at work and "Check Out" when you leave. Your times are automatically recorded in the system.',
    },
    {
      id: 6,
      category: 'Attendance',
      question: 'What if I forgot to check out?',
      answer:
        'If you forget to check out, contact your HR department immediately. They can manually record your check-out time with proper justification.',
    },
    {
      id: 7,
      category: 'Payroll',
      question: 'When will I receive my salary?',
      answer:
        'Salaries are typically processed on the last working day of each month. You can view your payslip in the Payroll section after processing.',
    },
    {
      id: 8,
      category: 'Payroll',
      question: 'How do I view my payslip?',
      answer:
        'Go to the Payroll section to view all your payslips. Click on any payslip to see detailed breakdown of salary, deductions, and net pay.',
    },
    {
      id: 9,
      category: 'Technical Support',
      question: 'The system is loading slowly. What can I do?',
      answer:
        'Try clearing your browser cache and cookies, or try using a different browser. If the issue persists, contact our technical support team.',
    },
    {
      id: 10,
      category: 'Technical Support',
      question: 'I cannot access my account. What should I do?',
      answer:
        'First, try resetting your password. If that doesn\'t work, clear your browser cache. For further assistance, contact the IT support team with your employee ID.',
    },
  ];

  const categories = ['All', ...new Set(faqs.map((faq) => faq.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs =
    selectedCategory === 'All' ? faqs : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="help-page">
      <header className="section-header help-header">
        <div>
          <p className="eyebrow">Help & Support</p>
          <h1>Help Center</h1>
          <p className="muted">Find answers to common questions and get support.</p>
        </div>
      </header>

      {/* Support Cards */}
      <div className="support-cards">
        <div className="support-card">
          <Mail size={32} />
          <h3>Email Support</h3>
          <p>support@dayflow.com</p>
          <p className="time">Response within 24 hours</p>
        </div>
        <div className="support-card">
          <Phone size={32} />
          <h3>Phone Support</h3>
          <p>+1 (555) 123-4567</p>
          <p className="time">Monday - Friday, 9 AM - 6 PM</p>
        </div>
        <div className="support-card">
          <MessageCircle size={32} />
          <h3>Live Chat</h3>
          <p>Available on the platform</p>
          <p className="time">Response within 2 hours</p>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <button
                className={`faq-question ${openFAQ === faq.id ? 'open' : ''}`}
                onClick={() => toggleFAQ(faq.id)}
              >
                <span>{faq.question}</span>
                <ChevronDown size={20} className="chevron" />
              </button>
              {openFAQ === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Documentation */}
      <section className="documentation-section">
        <h2>Documentation & Guides</h2>
        <div className="doc-links">
          <a href="#" className="doc-link">
            <HelpCircle size={20} />
            <div>
              <h3>Getting Started Guide</h3>
              <p>Learn the basics of using Dayflow HRMS</p>
            </div>
          </a>
          <a href="#" className="doc-link">
            <HelpCircle size={20} />
            <div>
              <h3>User Manual</h3>
              <p>Complete documentation for all features</p>
            </div>
          </a>
          <a href="#" className="doc-link">
            <HelpCircle size={20} />
            <div>
              <h3>Video Tutorials</h3>
              <p>Step-by-step video guides for common tasks</p>
            </div>
          </a>
          <a href="#" className="doc-link">
            <HelpCircle size={20} />
            <div>
              <h3>API Documentation</h3>
              <p>For developers integrating with Dayflow</p>
            </div>
          </a>
        </div>
      </section>

      {/* Contact Support */}
      <section className="contact-support">
        <h2>Can't find what you're looking for?</h2>
        <p>Our support team is ready to help. Contact us for immediate assistance.</p>
        <div className="contact-actions">
          <button className="btn-primary">Contact Support</button>
          <button className="btn-secondary">Report a Bug</button>
        </div>
      </section>
    </div>
  );
};

export default Help;
