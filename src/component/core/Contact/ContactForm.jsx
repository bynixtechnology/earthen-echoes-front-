import React, { useState } from "react";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
} from "lucide-react";
import toast from "react-hot-toast";

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
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 flex-1">
            {/* items-start ensures columns align properly for sticky behavior */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                
                {/* Left Side: Info & Map */}
                <div className="lg:col-span-5 space-y-6">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-foreground">
                            Artisan Studio Details
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Our master craftsmen work directly out of our flagship studio in
                            Jaipur. Visitors are welcome by prior appointment.
                        </p>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3.5 p-3.5 bg-card border border-border/50 rounded-xl shadow-sm">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <MapPin size={18} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-foreground text-sm">
                                    Our Address
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    A-457, Nemi Nagar Extension, Block A, Vaishali Nagar, Jaipur, Rajasthan 302021
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3.5 bg-card border border-border/50 rounded-xl shadow-sm">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Phone size={18} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-foreground text-sm">
                                    Phone &amp; WhatsApp
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    +91-9772790222
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3.5 bg-card border border-border/50 rounded-xl shadow-sm">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Mail size={18} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-foreground text-sm">
                                    Email Address
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    info@earthenechoes.in (Inquiries) / sales@earthenechoes.in (Wholesale)
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-3.5 bg-card border border-border/50 rounded-xl shadow-sm">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <Clock size={18} />
                            </div>
                            <div>
                                <h4 className="font-heading font-bold text-foreground text-sm">
                                    Working Hours
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Monday - Sunday: 9:00 AM - 6:00 PM IST 
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-border/60 aspect-[16/9] bg-secondary shadow-sm flex flex-col justify-between p-5">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/50 to-background" />
                        <div className="relative z-10 space-y-1">
                            <span className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                Interactive Map
                            </span>
                            <h4 className="font-heading font-bold text-sm text-foreground">
                                Kumhari Pottery Jaipur
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                Nemi Nagar Extension, Vaishali Nagar
                            </p>
                        </div>
                        <div className="relative z-10 flex justify-between items-center border-t border-border/40 pt-3">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <iconify-icon icon="lucide:globe" className="text-primary" />{" "}
                                26.9116° N, 75.7365° E
                            </span>
                            <a
                                href="https://maps.app.goo.gl/8XY6rGPBQY8UPAh6A"
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded hover:opacity-90 transition-all"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Side: Sticky Form Container (Proper top offset & compact height) */}
                <div className="lg:col-span-7 bg-card p-6 sm:p-7 rounded-2xl border border-border/50 shadow-md space-y-4 lg:sticky lg:top-24 h-fit">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                            Send Us a Message
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            Fill out the form below and our customer care team will get back to
                            you within 24 hours.
                        </p>
                    </div>

                    <form
                        className="space-y-3.5"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your name"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                    Subject
                                </label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-medium"
                                >
                                    <option>General Support Inquiry</option>
                                    <option>Bulk Orders & Customization</option>
                                    <option>Corporate Gifting</option>
                                    <option>Wholesale & Retail Tie-ups</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Your Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Tell us how we can help you..."
                                className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={16} />
                            Submit Inquiry
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;