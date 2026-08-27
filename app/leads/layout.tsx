import SidebarLayout from "@/components/SidebarLayout";

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
