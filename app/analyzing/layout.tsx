import SidebarLayout from "@/components/SidebarLayout";

export default function AnalyzingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
