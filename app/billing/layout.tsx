import SidebarLayout from "@/components/SidebarLayout";

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
