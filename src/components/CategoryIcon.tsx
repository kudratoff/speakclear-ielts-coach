import {
  Users,
  BookOpen,
  Briefcase,
  Plane,
  Cpu,
  Music,
  HeartPulse,
  Leaf,
  Landmark,
  Star,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

/**
 * Map of category id → outline icon.
 * Kept in one shared component so the home page and category pages
 * always render the same icon for a category.
 */
const categoryIcons: Record<string, LucideIcon> = {
  family: Users,
  education: BookOpen,
  work: Briefcase,
  travel: Plane,
  technology: Cpu,
  hobbies: Music,
  health: HeartPulse,
  environment: Leaf,
  culture: Landmark,
  memories: Star,
  shopping: ShoppingBag,
};

interface CategoryIconProps {
  id: string;
  className?: string;
}

export default function CategoryIcon({
  id,
  className = "w-5 h-5",
}: CategoryIconProps) {
  const Icon = categoryIcons[id] ?? Star;
  return <Icon className={className} />;
}