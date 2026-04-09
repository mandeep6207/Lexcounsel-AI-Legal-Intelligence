import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl text-[#1a2847] mb-4">Contact Us</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about the AI Lawyer platform? Need support or want to provide feedback? 
              We're here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader className="bg-[#1a2847] text-white">
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-6 h-6 text-[#ff9933] flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-[#1a2847]">support@ailawyer.gov.in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-6 h-6 text-[#ff9933] flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Helpline (Toll Free)</p>
                      <p className="text-[#1a2847]">1800-XXX-XXXX</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-[#ff9933] flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="text-[#1a2847]">Ministry of Law and Justice<br />Shastri Bhawan, New Delhi - 110001</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-[#ff9933] flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Support Hours</p>
                      <p className="text-[#1a2847]">Monday - Friday<br />9:00 AM - 6:00 PM (IST)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-2 border-blue-200">
                <CardContent className="p-6">
                  <MessageCircle className="w-12 h-12 text-blue-600 mb-3" />
                  <h3 className="text-lg text-[#1a2847] mb-2">Quick Support</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    For immediate assistance, check our FAQs or email us directly.
                  </p>
                  <p className="text-sm text-gray-600">
                    Average response time: 24-48 hours
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="bg-[#1a2847] text-white">
                  <CardTitle>Send Us a Message</CardTitle>
                  <p className="text-sm text-gray-300 mt-2">Fill out the form below and we'll respond as soon as possible</p>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitted && (
                      <div className="rounded border border-green-300 bg-green-50 p-3 text-green-700">
                        Thanks for your message. Our team will get back to you soon.
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" required className="mt-2" placeholder="Your name" />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" required className="mt-2" placeholder="email@example.com" />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" className="mt-2" placeholder="+91 XXXXX XXXXX" />
                      </div>

                      <div>
                        <Label htmlFor="category">Subject Category *</Label>
                        <Select required>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="data">Data/Privacy Concerns</SelectItem>
                            <SelectItem value="collaboration">Collaboration Opportunity</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" required className="mt-2" placeholder="Brief subject of your message" />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        placeholder="Please provide details about your inquiry..."
                        className="mt-2 min-h-[150px]"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Note:</strong> Please do not share sensitive personal information or ongoing case details. 
                        This platform is for general inquiries and support only.
                      </p>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline">Clear Form</Button>
                      <Button type="submit" className="bg-[#ff9933] hover:bg-[#ff8800] text-white px-8">
                        Send Message
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6 bg-yellow-50 border-2 border-yellow-200">
                <CardContent className="p-6">
                  <h3 className="text-lg text-[#1a2847] mb-3">Before You Contact Us</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Check our FAQ section for quick answers to common questions</li>
                    <li>• For urgent legal matters, please consult a qualified lawyer directly</li>
                    <li>• We do not provide personalized legal advice through this platform</li>
                    <li>• All communications are monitored for quality and training purposes</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-br from-[#1a2847] to-[#2a3857] text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl mb-4">Partnership & Collaboration</h3>
                <p className="mb-6 max-w-3xl mx-auto">
                  Are you a legal institution, NGO, or policy organization interested in collaborating 
                  to enhance legal awareness in India? We'd love to hear from you!
                </p>
                <Button className="bg-[#ff9933] hover:bg-[#ff8800] text-white">
                  Email: partnerships@ailawyer.gov.in
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
