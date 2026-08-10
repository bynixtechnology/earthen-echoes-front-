import React, { useState } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Globe,
    Send,
} from "lucide-react";
import toast from "react-hot-toast";
import { C } from "../../../constants/theme";



const ContactForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "General Support Inquiry",
        message: "",
    });
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.fullName.trim() ||
            !formData.email.trim() ||
            !formData.message.trim()
        ) {
            toast("Please fill all required fields.");
            return;
        }

        console.log(formData);

        toast("Message sent successfully!");

        setFormData({
            fullName: "",
            email: "",
            phone: "",
            subject: "General Support Inquiry",
            message: "",
        });
    };
    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-heading font-bold text-foreground">
                            Artisan Studio Details
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Our master craftsmen work directly out of our flagship studio in
                            Mansarovar. Visitors are welcome by prior appointment.
                        </p>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-4 p-4 bg-card border border-border/50 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-foreground">
                                    Our Address
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Artisan Block, Mansarovar, Jaipur, Rajasthan 302020, India
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-card border border-border/50 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-foreground">
                                    Phone &amp; WhatsApp
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    +91-98765-43210 (Support) / +91-98765-43211 (Bulk Orders)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-card border border-border/50 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-foreground">
                                    Email Address
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    heritage@earthenechoes.com (Inquiries) / sales@earthenechoes.com
                                    (Wholesale)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-card border border-border/50 rounded-xl shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-foreground">
                                    Working Hours
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Monday - Saturday: 9:00 AM - 6:00 PM IST (Closed Sundays &amp;
                                    Festivals)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden border border-border/60 aspect-[16/10] bg-secondary shadow-sm flex flex-col justify-between p-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/50 to-background" />
                        <div className="relative z-10 space-y-2">
                            <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                Interactive Map
                            </span>
                            <h4 className="font-heading font-bold text-sm text-foreground">
                                Earthen Echoes Jaipur Studio
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                Mansarovar Industrial Craft Block
                            </p>
                        </div>
                        <div className="relative z-10 flex justify-between items-center border-t border-border/40 pt-4">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <iconify-icon icon="lucide:globe" className="text-primary" />{" "}
                                26.8520° N, 75.7602° E
                            </span>
                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded hover:opacity-90 transition-all"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-7 bg-card p-8 rounded-2xl border border-border/50 shadow-md space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-heading font-bold text-foreground">
                            Send Us a Message
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Fill out the form below and our customer care team will get back to
                            you within 24 hours.
                        </p>
                    </div>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Subject
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-medium"
                                >
                                    <option>General Support Inquiry</option>
                                    <option>Bulk Orders & Customization</option>
                                    <option>Corporate Gifting</option>
                                    <option>Wholesale & Retail Tie-ups</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Your Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Tell us how we can help you..."
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"

                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            Submit Inquiry
                        </button>
                    </form>
                </div>
            </div>
        </section>

    )
}

export default ContactForm