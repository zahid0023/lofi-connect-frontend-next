import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stat = {
  title: string;
  value: string | number;
  total?: string | number;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  trend?: string;
};

export function StatCard({ stat }: Readonly<{ stat: Stat }>) {
  return (
    <Card key={stat.title} className="transition-shadow hover:shadow-md">
      <Link href={stat.href}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium text-muted-foreground text-sm">
            {stat.title}
          </CardTitle>
          <stat.icon className={`size-4 ${stat.color}`} />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="font-bold text-2xl">{stat.value}</div>
            {stat.total !== undefined && (
              <span className="text-muted-foreground text-sm">
                / {stat.total}
              </span>
            )}
            {stat.trend && (
              <Badge variant="secondary" className="text-xs">
                {stat.trend}
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
