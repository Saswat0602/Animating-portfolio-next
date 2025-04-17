export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  location: string;
  type: string;
  description: string;
  skills: string[];
  logo?: string;
}

export const experiences: WorkExperience[] = [
  {
    title: "Software Development Engineer 1",
    company: "HyScaler",
    duration: "Apr 2025 - present",
    location: "Bhubaneswar, Odisha, India · On-site",
    type: "Full-time",
    description: "Working on React Native, and developing multiple web and mobile/Web applications.",
    skills: ["Django REST Framework", "React Native", "Swift"],
    logo: ""
  },
  {
    title: "Junior Software Developer",
    company: "HyScaler",
    duration: "Apr 2024 - Apr2024",
    location: "Bhubaneswar, Odisha, India · On-site",
    type: "Full-time",
    description: "Working on Django REST Framework, React Native, and developing multiple web and mobile applications.",
    skills: ["Django REST Framework", "React Native", "+5 skills"],
    logo: ""
  },
  {
    title: "Apprentice Trainee",
    company: "HyScaler",
    duration: "Aug 2023 - Mar 2024 (8 mos)",
    location: "Bhubaneswar, Odisha, India · On-site",
    type: "Trainee",
    description: "Gaining hands-on experience in React.js, React Native, and other web technologies.",
    skills: ["React.js", "React Native", "+4 skills"],
    logo: ""
  }
]; 