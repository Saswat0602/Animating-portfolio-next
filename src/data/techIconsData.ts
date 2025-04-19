export interface TechIcon {
  name: string;
  x: number;
  y: number;
  src: string;
}


export const generateTechIcons = (): TechIcon[] => {
  const icons: TechIcon[] = [
    { name: "react", x: 75, y: 20, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "typescript", x: 25, y: 65, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "nextjs", x: 85, y: 75, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    {
      name: "aws",
      x: 40,
      y: 35,
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    },
    { name: "node", x: 60, y: 50, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "mongodb", x: 30, y: 85, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "firebase", x: 50, y: 15, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  ];

  const extraIcons: TechIcon[] = [
    { name: "javascript", x: 20, y: 40, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "html", x: 70, y: 60, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "css", x: 45, y: 75, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "python", x: 80, y: 45, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "git", x: 35, y: 20, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "docker", x: 65, y: 85, src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  ];
  
  icons.push(...extraIcons.slice(0, 6));
  
  return icons;
}; 