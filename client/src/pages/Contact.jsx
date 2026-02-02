import { useState } from "react";
import { Link } from "wouter";
import { Mail, MessageCircle, Clock, Heart, Sparkles, ArrowRight, CheckCircle, Send } from "lucide-react";
import SEO from "../components/SEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error?.message || "Unable to send message. Please try again.");
      }
    } catch {
      setError("Unable to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "We respond within 24-48 hours",
      detail: "support@genuinelove.project",
      color: "var(--glp-sage)"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available Mon-Fri, 9am-5pm EST",
      detail: "Start a conversation",
      color: "var(--glp-teal-400)"
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "We aim to help quickly",
      detail: "Usually within 24 hours",
      color: "var(--glp-gold)"
    }
  ];

  return (
    <WellnessPageShell
      title="Contact Us"
      subtitle="We're here to support you on your wellness journey."
      benefits={pickBenefits(["support", "calm", "clarity", "connection"], 4)}
      clarity={{
        what: "A safe space to reach out for support or share feedback.",
        why: "Because your voice matters and we want to help.",
        who: "Anyone with questions, feedback, or who needs support.",
        when: "Whenever you need us - we're here for you.",
        where: "Right here, from wherever you are.",
        how: "Fill out the form or use one of our contact methods."
      }}
    >
      <SEO 
        title="Contact Us"
        description="Get in touch with The Genuine Love Project. We're here to support your mental wellness journey with compassion and care."
      />
      
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--glp-paper) 0%, var(--glp-sage-10) 50%, var(--glp-teal-50) 100%)' }}>
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="decorative-orb sage animate-drift w-[500px] h-[500px] -top-24 -right-24" style={{ animationDelay: '0s' }} aria-hidden="true" />
          <div className="decorative-orb rose animate-drift w-[400px] h-[400px] -bottom-32 -left-32" style={{ animationDelay: '5s' }} aria-hidden="true" />
          <div className="decorative-orb teal animate-drift w-[300px] h-[300px] top-1/3 left-1/4" style={{ animationDelay: '10s' }} aria-hidden="true" />
          
          {/* Floating Icons */}
          <div className="floating-icon-container top-20 left-[8%] w-12 h-12 rounded-xl animate-float opacity-60" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', boxShadow: '0 8px 24px var(--glp-sage-30)', animationDelay: '0s' }} aria-hidden="true">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="floating-icon-container top-32 right-[12%] w-10 h-10 rounded-lg animate-float opacity-50" style={{ background: 'linear-gradient(135deg, var(--glp-rose), var(--glp-blush))', boxShadow: '0 6px 20px var(--glp-rose-20)', animationDelay: '1s' }} aria-hidden="true">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="floating-icon-container bottom-40 right-[8%] w-11 h-11 rounded-xl animate-float opacity-45" style={{ background: 'linear-gradient(135deg, var(--glp-teal-400), var(--glp-sage-deep))', boxShadow: '0 6px 20px var(--glp-sage-30)', animationDelay: '2s' }} aria-hidden="true">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'var(--glp-sage-15)', border: '1px solid var(--glp-sage-30)' }}>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--glp-gold)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--glp-sage-deep)' }}>We'd Love to Hear From You</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4" style={{ color: 'var(--glp-sage-deep)' }}>
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--glp-sage)' }}>
              Whether you have questions, feedback, or just want to say hello—we're here for you.
            </p>
          </div>

          {/* Contact Methods */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className="rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid var(--glp-sage-20)', backdropFilter: 'blur(10px)' }}
                data-testid={`contact-method-${index}`}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `linear-gradient(135deg, ${method.color}, var(--glp-sage-deep))`, boxShadow: '0 8px 24px rgba(143,191,159,0.3)' }}>
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>{method.title}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--glp-sage)' }}>{method.description}</p>
                <p className="text-sm font-medium" style={{ color: method.color }}>{method.detail}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-3xl p-8 md:p-12" style={{ background: 'var(--glp-paper)', border: '1px solid var(--glp-sage-20)' }}>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, var(--glp-sage), var(--glp-teal-400))', boxShadow: '0 12px 32px var(--glp-sage-40)' }}>
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--glp-sage-deep)' }}>Message Sent!</h2>
                  <p className="mb-6" style={{ color: 'var(--glp-sage)' }}>Thank you for reaching out. We'll get back to you within 24-48 hours.</p>
                  <Link href="/">
                    <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 8px 24px var(--glp-sage-30)' }} data-testid="button-return-home">
                      <span>Return Home</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--glp-sage-deep)' }}>Send Us a Message</h2>
                    <p style={{ color: 'var(--glp-sage)' }}>Fill out the form below and we'll respond as soon as possible.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-contact">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium" style={{ color: 'var(--glp-sage-deep)' }}>Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none"
                          style={{ background: 'var(--glp-paper)', borderColor: 'var(--glp-sage-20)', color: 'var(--glp-ink)' }}
                          placeholder="Your name"
                          data-testid="input-name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium" style={{ color: 'var(--glp-sage-deep)' }}>Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none"
                          style={{ background: 'var(--glp-paper)', borderColor: 'var(--glp-sage-20)', color: 'var(--glp-ink)' }}
                          placeholder="you@example.com"
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block mb-2 text-sm font-medium" style={{ color: 'var(--glp-sage-deep)' }}>Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none"
                        style={{ background: 'var(--glp-paper)', borderColor: 'var(--glp-sage-20)', color: 'var(--glp-ink)' }}
                        placeholder="How can we help?"
                        data-testid="input-subject"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block mb-2 text-sm font-medium" style={{ color: 'var(--glp-sage-deep)' }}>Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none resize-none"
                        style={{ background: 'var(--glp-paper)', borderColor: 'var(--glp-sage-20)', color: 'var(--glp-ink)' }}
                        placeholder="Tell us more about how we can support you..."
                        data-testid="input-message"
                      />
                    </div>

                    {error && (
                      <div className="p-4 rounded-xl text-sm" style={{ background: 'var(--glp-rose-10)', color: 'var(--glp-rose-deep)' }} data-testid="text-error">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, var(--glp-sage-deep), var(--glp-sage))', boxShadow: '0 8px 24px var(--glp-sage-30)' }}
                      data-testid="button-submit"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" aria-hidden="true" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-sm mb-4" style={{ color: 'var(--glp-sage)' }}>
              Need immediate support? Our AI companion is available 24/7.
            </p>
            <Link href="/chat">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:shadow-lg" style={{ background: 'var(--glp-paper)', border: '2px solid var(--glp-sage)', color: 'var(--glp-sage-deep)' }} data-testid="button-chat">
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span>Talk to AI Companion</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </WellnessPageShell>
  );
}
