import {
  BarChart3Icon,
  CreditCardIcon,
  LayoutDashboard,
  Link2Icon,
  SettingsIcon,
  WebhookIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarMenuButtonActive } from "@/layouts/portal/sidebar-menu-button-active";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/portal/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Connections",
    url: "/portal/connections",
    icon: Link2Icon,
  },
  {
    title: "Webhooks",
    url: "/portal/webhooks",
    icon: WebhookIcon,
  },
  {
    title: "Usage",
    url: "/portal/usage",
    icon: BarChart3Icon,
  },
];

const accountNavItems = [
  { title: "Billing", url: "/portal/billing", icon: CreditCardIcon },
  { title: "Settings", url: "/portal/settings", icon: SettingsIcon },
];

export function PortalSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b border-b-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center">
            <ZapIcon className="size-5 text-primary" />
          </div>
          <span className="truncate font-medium">LofiConnect</span>
          <SidebarTrigger className="ml-auto sm:hidden" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarMenu className="gap-2">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButtonActive
                    icon={<item.icon />}
                    title={item.title}
                    url={item.url}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarMenu className="gap-2">
              {accountNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButtonActive
                    icon={<item.icon />}
                    title={item.title}
                    url={item.url}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
