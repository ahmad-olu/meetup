import { db } from "../db";
import { eventCategories } from "../db/others-one-schema";

const categoriesData = [
  // Tech & Programming
  {
    name: "Programming",
    slug: "programming",
    description: "Coding sessions, hackathons, and developer meetups",
    iconName: "code",
  },
  {
    name: "Web Development",
    slug: "web-development",
    description: "Frontend, backend, and fullstack development sessions",
    iconName: "globe",
  },
  {
    name: "Mobile Development",
    slug: "mobile-development",
    description: "iOS, Android, and cross-platform app development",
    iconName: "smartphone",
  },
  {
    name: "DevOps & Cloud",
    slug: "devops-cloud",
    description: "Infrastructure, CI/CD, and cloud computing discussions",
    iconName: "cloud",
  },
  {
    name: "Data Science & AI",
    slug: "data-science-ai",
    description: "Machine learning, AI, and data analysis workshops",
    iconName: "brain",
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    description: "Security best practices, ethical hacking, and privacy",
    iconName: "shield",
  },
  {
    name: "Blockchain & Web3",
    slug: "blockchain-web3",
    description: "Cryptocurrency, smart contracts, and decentralized apps",
    iconName: "link",
  },

  // Design & Creative
  {
    name: "Design",
    slug: "design",
    description: "UI/UX design, graphic design, and creative sessions",
    iconName: "palette",
  },
  {
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description: "User interface and user experience design workshops",
    iconName: "layout",
  },
  {
    name: "Graphic Design",
    slug: "graphic-design",
    description: "Visual design, branding, and illustration",
    iconName: "image",
  },
  {
    name: "Product Design",
    slug: "product-design",
    description: "Product thinking, design systems, and prototyping",
    iconName: "box",
  },
  {
    name: "Creative Writing",
    slug: "creative-writing",
    description: "Fiction, poetry, and creative writing workshops",
    iconName: "pen-tool",
  },
  {
    name: "Content Creation",
    slug: "content-creation",
    description: "Blogging, video creation, and digital content",
    iconName: "video",
  },
  {
    name: "Photography",
    slug: "photography",
    description: "Photo shoots, editing sessions, and photography talks",
    iconName: "camera",
  },

  // Business & Entrepreneurship
  {
    name: "Startup Founders",
    slug: "startup-founders",
    description: "Founder meetups, pitch practice, and startup discussions",
    iconName: "rocket",
  },
  {
    name: "Entrepreneurship",
    slug: "entrepreneurship",
    description: "Business ideas, scaling, and entrepreneurial mindset",
    iconName: "trending-up",
  },
  {
    name: "Product Management",
    slug: "product-management",
    description: "Product strategy, roadmaps, and PM best practices",
    iconName: "target",
  },
  {
    name: "Marketing & Growth",
    slug: "marketing-growth",
    description: "Digital marketing, SEO, and growth strategies",
    iconName: "megaphone",
  },
  {
    name: "Sales & Business Development",
    slug: "sales-business-dev",
    description: "Sales strategies, networking, and BD discussions",
    iconName: "briefcase",
  },
  {
    name: "Finance & Investing",
    slug: "finance-investing",
    description: "Personal finance, investing, and financial literacy",
    iconName: "dollar-sign",
  },

  // Coworking & Networking
  {
    name: "General Coworking",
    slug: "general-coworking",
    description: "Open coworking sessions for focused work",
    iconName: "users",
  },
  {
    name: "Networking",
    slug: "networking",
    description: "Professional networking and community building",
    iconName: "user-plus",
  },
  {
    name: "Coffee & Chat",
    slug: "coffee-chat",
    description: "Casual meetups and informal conversations",
    iconName: "coffee",
  },
  {
    name: "Accountability Partners",
    slug: "accountability-partners",
    description: "Goal setting and accountability check-ins",
    iconName: "check-circle",
  },

  // Learning & Education
  {
    name: "Book Club",
    slug: "book-club",
    description: "Reading groups and book discussions",
    iconName: "book-open",
  },
  {
    name: "Study Groups",
    slug: "study-groups",
    description: "Collaborative learning and study sessions",
    iconName: "graduation-cap",
  },
  {
    name: "Language Exchange",
    slug: "language-exchange",
    description: "Practice and learn new languages together",
    iconName: "message-circle",
  },
  {
    name: "Career Development",
    slug: "career-development",
    description: "Resume reviews, interview prep, and career advice",
    iconName: "briefcase",
  },
  {
    name: "Mentorship",
    slug: "mentorship",
    description: "Mentor-mentee meetups and knowledge sharing",
    iconName: "user-check",
  },

  // Wellness & Lifestyle
  {
    name: "Fitness & Wellness",
    slug: "fitness-wellness",
    description: "Yoga, meditation, and wellness activities",
    iconName: "heart",
  },
  {
    name: "Mental Health",
    slug: "mental-health",
    description: "Mental health awareness and support groups",
    iconName: "activity",
  },
  {
    name: "Sustainability",
    slug: "sustainability",
    description: "Environmental initiatives and sustainable living",
    iconName: "leaf",
  },

  // Gaming & Entertainment
  {
    name: "Game Development",
    slug: "game-development",
    description: "Video game creation and game design",
    iconName: "gamepad",
  },
  {
    name: "Gaming Sessions",
    slug: "gaming-sessions",
    description: "Casual gaming and esports meetups",
    iconName: "gamepad-2",
  },
  {
    name: "Music & Audio",
    slug: "music-audio",
    description: "Music production, jam sessions, and audio engineering",
    iconName: "music",
  },
  {
    name: "Film & Video",
    slug: "film-video",
    description: "Filmmaking, video editing, and movie screenings",
    iconName: "film",
  },

  // Community & Social
  {
    name: "Volunteering",
    slug: "volunteering",
    description: "Community service and social impact projects",
    iconName: "heart-handshake",
  },
  {
    name: "Diversity & Inclusion",
    slug: "diversity-inclusion",
    description: "DEI discussions and inclusive community building",
    iconName: "users-2",
  },
  {
    name: "Women in Tech",
    slug: "women-in-tech",
    description: "Support network for women in technology",
    iconName: "user-circle",
  },
  // {
  //   name: "LGBTQ+",
  //   slug: "lgbtq-plus",
  //   description: "LGBTQ+ community meetups and support",
  //   iconName: "rainbow",
  // },

  // Specialized Topics
  {
    name: "Legal & Compliance",
    slug: "legal-compliance",
    description: "Legal advice, contracts, and regulatory discussions",
    iconName: "scale",
  },
  {
    name: "Hardware & IoT",
    slug: "hardware-iot",
    description: "Electronics, robotics, and Internet of Things",
    iconName: "cpu",
  },
  {
    name: "Research & Academia",
    slug: "research-academia",
    description: "Academic research and scholarly discussions",
    iconName: "microscope",
  },
  {
    name: "Podcasting",
    slug: "podcasting",
    description: "Podcast creation and audio storytelling",
    iconName: "mic",
  },
];

export async function seedEventCategories() {
  try {
    console.log("Starting event categories seed...");

    // Insert all categories
    await db.insert(eventCategories).values(categoriesData);

    console.log(
      `✓ Successfully seeded ${categoriesData.length} event categories`,
    );
  } catch (error) {
    console.error("Error seeding event categories:", error);
    throw error;
  }
}

// Run the seed function
seedEventCategories();
