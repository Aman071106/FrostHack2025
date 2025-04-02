"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ChevronRight, MessageSquare, Mail, Send } from 'lucide-react';

const SupportCenter = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Animation on page load
  useEffect(() => {
    setIsLoaded(true);
  }, []);

interface SubmitStatus {
    success: 'success';
    error: 'error';
}

interface FormEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate backend integration with a timeout
    try {
        // In a real implementation, this would be a fetch call to your backend
        await new Promise<void>((resolve) => setTimeout(resolve, 1500));
        setSubmitStatus('success');
        // Reset form
        setMessage('');
        setEmail('');
        setSubject('');
    } catch (error) {
        setSubmitStatus('error');
    } finally {
        setIsSubmitting(false);
        // Clear status after 3 seconds
        setTimeout(() => setSubmitStatus(null), 3000);
    }
};

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Matching the landing page style */}
      <header className="sticky top-0 w-full p-4 flex justify-between items-center bg-white/80 backdrop-blur-md z-5 shadow-sm">
        {/* Logo and Menu Button */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="ml-4 font-bold text-xl text-[#0A0C29]">
              <span className="text-green-900">Block</span>Ops
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-full border border-gray-200 flex overflow-hidden shadow-sm transition-transform duration-300 hover:shadow-md">
          <Link href="/features" className="px-6 py-2 font-medium text-[#0a0c29] hover:bg-gray-100 transition-colors duration-200">
            FEATURES
          </Link>
          <Link href="/account" className="px-6 py-2 font-medium text-[#0a0c29] hover:bg-gray-100 transition-colors duration-200">
            ACCOUNT
          </Link>
        </div>
        
        {/* Back Button */}
        <Link href="/">
          <button className="flex items-center text-green-900 border border-green-900 py-2 px-4 rounded-lg font-medium text-sm hover:bg-green-900 hover:text-white transition-all duration-200">
            BACK TO HOME
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-16 px-6 md:px-16 max-w-6xl mx-auto w-full">
        {/* Title Section with Animation */}
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-[#0A0C29] relative inline-block">
            <span className="inline-block">Support</span>
            <span className="inline-block ml-2">Center</span>
            <div className="h-2 w-full bg-green-900 mt-2"></div>
          </h1>
          
          <p className={`text-lg text-gray-500 mb-10 max-w-3xl transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Need help with BlockOps? Our team is here to assist you with any questions or technical issues you might encounter.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className={`flex border-b mb-8 transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'contact' ? 'text-green-900 border-b-2 border-green-900' : 'text-gray-500'}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Support
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'developers' ? 'text-green-900 border-b-2 border-green-900' : 'text-gray-500'}`}
            onClick={() => setActiveTab('developers')}
          >
            Developer Team
          </button>
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'faq' ? 'text-green-900 border-b-2 border-green-900' : 'text-gray-500'}`}
            onClick={() => setActiveTab('faq')}
          >
            FAQ
          </button>
        </div>
        
        {/* Contact Support Tab */}
        {activeTab === 'contact' && (
          <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6 text-[#0A0C29]">Get in Touch</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-[#0A0C29]" 
                      placeholder="email@example.com"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Subject</label>
                    <input 
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-[#0A0C29]" 
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Message</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg h-36 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-[#0A0C29]" 
                      placeholder="Please describe your issue in detail..."
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative bg-green-900 text-white py-3 px-6 rounded-lg font-bold text-lg flex items-center hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                    </span>
                    <Send className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    <div className="absolute top-0 left-0 w-full h-full bg-green-800 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-bottom-right z-0"></div>
                  </button>
                  
                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-100 text-green-800 rounded-lg mt-4 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Message sent successfully! We'll get back to you soon.
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-100 text-red-800 rounded-lg mt-4 flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      There was an error sending your message. Please try again.
                    </div>
                  )}
                </form>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-900" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-[#0A0C29]">Support Hours</h3>
                      <p className="text-gray-500">We're here to help you</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between border-b border-gray-100 pb-2 text-[#0A0C29]">
                      <span className="font-medium">Monday - Friday:</span>
                      <span>9:00 AM - 8:00 PM ET</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2 text-[#0A0C29]">
                      <span className="font-medium">Saturday:</span>
                      <span>10:00 AM - 6:00 PM ET</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span className="font-medium">Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                  
                  {/* <div className="flex items-center mb-4">
                    <Mail className="h-5 w-5 text-green-900 mr-2" />
                    <span className="text-gray-700">support@blockops.com</span>
                  </div> */}
                  
                  <div className="bg-green-900 text-white p-4 rounded-lg text-center mt-6">
                    <p className="font-medium">Average Response Time:</p>
                    <p className="text-2xl font-bold">Under 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Developer Team Tab */}
        {activeTab === 'developers' && (
          <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-bold mb-8 text-[#0A0C29]">Our Developer Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Developer 1 */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-green-900">KM</span>
                </div>
                <h3 className="text-xl font-bold text-center text-[#0A0C29] mb-2">Kunal Mittal</h3>
                <p className="text-center text-gray-500 mb-4">Frontend Developer</p>
                <div className="flex items-center justify-center mb-4">
                  <Mail className="h-4 w-4 text-green-900 mr-2" />
                  <a href="mailto:mittalk237@gmail.com" className="text-green-900 hover:underline">mittalk237@gmail.com</a>
                </div>
                <div className="h-1 w-16 bg-green-900 mx-auto"></div>
              </div>
              
              {/* Developer 2 */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-green-900">AG</span>
                </div>
                <h3 className="text-xl font-bold text-center text-[#0A0C29] mb-2">Aman Gupta</h3>
                <p className="text-center text-gray-500 mb-4">Backend Developer</p>
                <div className="flex items-center justify-center mb-4">
                  <Mail className="h-4 w-4 text-green-900 mr-2" />
                  <a href="mailto:aman07112006@gmail.com" className="text-green-900 hover:underline">aman07112006@gmail.com</a>
                </div>
                <div className="h-1 w-16 bg-green-900 mx-auto"></div>
              </div>
              
              {/* Developer 3 */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-green-900">HY</span>
                </div>
                <h3 className="text-xl font-bold text-center text-[#0A0C29] mb-2">Harsh Yadav</h3>
                <p className="text-center text-gray-500 mb-4">Backend Developer</p>
                <div className="flex items-center justify-center mb-4">
                  <Mail className="h-4 w-4 text-green-900 mr-2" />
                  <a href="mailto:harsh110406@gmail.com" className="text-green-900 hover:underline">harsh110406@gmail.com</a>
                </div>
                <div className="h-1 w-16 bg-green-900 mx-auto"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className={`transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl font-bold mb-8 text-[#0A0C29]">Frequently Asked Questions</h2>
            
            <div className="space-y-6 max-w-3xl">
              <div className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-bold text-green-900 mb-3">What is Finance Tracker by BlockOps?</h3>
                <p className="text-gray-600">
                Finance Tracker by BlockOps is an AI-powered finance management tool that helps you track expenses, set financial goals, and receive real-time insights using Fetch.ai agents.
                </p>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-bold text-green-900 mb-3">Is my financial data secure?</h3>
                <p className="text-gray-600">
                  Yes, we take security very seriously. Your data is encrypted using bank-level encryption standards both in transit and at rest. We implement strict access controls and regular security audits to ensure your information remains protected.
                </p>
              </div>
              
              <div className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-bold text-green-900 mb-3">How does the AI-powered chatbot work?</h3>
                <p className="text-gray-600">
                Our chatbot uses Retrieval-Augmented Generation (RAG) to provide accurate financial insights. It retrieves relevant financial data and combines it with AI-powered reasoning to give you personalized answers.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Gradient Orbs (Decorative) - Matching landing page */}
      <div className={`fixed top-1/4 -left-32 w-64 h-64 rounded-full bg-green-900/5 blur-3xl pointer-events-none transition-all duration-1000 ${isLoaded ? 'opacity-80' : 'opacity-0'}`}></div>
      <div className={`fixed bottom-1/4 -right-32 w-64 h-64 rounded-full bg-green-900/5 blur-3xl pointer-events-none transition-all duration-1000 ${isLoaded ? 'opacity-80' : 'opacity-0'}`}></div>
    </div>
  );
};

export default SupportCenter;