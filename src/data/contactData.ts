export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  mapUrl: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export const contactInfo: ContactInfo = {
  email: "contact@yourwebsite.com",
  phone: "+91 1234567890",
  address: "Some Street Name",
  city: "Bhubaneswar",
  country: "India",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.58457775935!2d85.75041503952645!3d20.30071931323742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1908e0596ab70f%3A0xdaedf8e9f23836c3!2sBhubaneswar%2C%20Odisha%2C%20India!5e0!3m2!1sen!2sin!4v1689873453364!5m2!1sen!2sin",
  socialLinks: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    instagram: "https://instagram.com/yourusername"
  }
}; 