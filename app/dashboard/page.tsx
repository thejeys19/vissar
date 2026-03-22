import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, MousePointer, Sparkles } from "lucide-react";
import WidgetCard from "@/components/widget-card";
import { getWidgetsByUser } from "@/lib/db";
import { getUserPlanAsync } from "@/lib/plans";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const userId = (session.user as { id?: string }).id || session.user.email;
  const userPlan = await getUserPlanAsync(session.user.email);
  const widgets = await getWidgetsByUser(userId).catch(() => []);
  
  const planName = userPlan.plan.charAt(0).toUpperCase() + userPlan.plan.slice(1);
  const viewUsage = userPlan.views || 0;
  const viewLimit = userPlan.limit || 200;
  const usagePct = Math.min(Math.round((viewUsage / viewLimit) * 100), 100);

  const widgetLimits: Record<string, number> = { free: 1, pro: 3, business: 9 };
  const widgetLimit = widgetLimits[userPlan.plan] || 1;
  const atLimit = widgets.length >= widgetLimit;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
            Welcome, {session.user.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Manage your widgets and track performance</p>
        </div>
        {atLimit ? (
          <Button asChild className="bg-amber-500 hover:bg-amber-600 shrink-0">
            <Link href="/pricing">Upgrade to Add More</Link>
          </Button>
        ) : (
          <Button asChild className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shrink-0">
            <Link href="/dashboard/widget/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Widget</span>
              <span className="sm:hidden">Create</span>
            </Link>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <MousePointer className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">Widgets</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{widgets.length}<span className="text-slate-600 text-sm font-normal">/{widgetLimit}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">Views</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{viewUsage.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs sm:text-sm">Plan</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{planName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Bar */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base sm:text-lg">Monthly Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">{viewUsage.toLocaleString()} of {viewLimit.toLocaleString()} views</span>
              <span className={`font-medium ${usagePct > 80 ? 'text-amber-400' : 'text-slate-400'}`}>{usagePct}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usagePct > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-purple-600'}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
            {usagePct > 80 && (
              <p className="text-xs text-amber-400">
                Running low — <Link href="/pricing" className="underline hover:text-amber-300">upgrade for more views</Link>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Widgets */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Your Widgets</h2>
          {widgets.length > 0 && !atLimit && (
            <Link href="/dashboard/widget/new" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
              <Plus className="w-4 h-4" /> New
            </Link>
          )}
        </div>
        
        <div className="grid gap-4">
          {widgets.length === 0 ? (
            <div className="space-y-4">
              {/* Onboarding steps */}
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-5">Get started in 3 steps</h2>
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "Create your widget", desc: "Pick a layout, choose a style, search for your business", href: "/dashboard/widget/new", cta: "Create Widget", done: false },
                      { step: 2, title: "Copy the embed code", desc: "One snippet — paste it into your website", href: null, cta: null, done: false },
                      { step: 3, title: "Watch reviews appear", desc: "Auto-styled to match your site, instantly live", href: null, cta: null, done: false },
                    ].map(({ step, title, desc, href, cta }) => (
                      <div key={step} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-400 font-bold text-sm">{step}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">{title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                        </div>
                        {href && cta && (
                          <Link href={href} className="shrink-0 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors">
                            {cta}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Link href="/dashboard/widget/new">
                <Card className="bg-slate-900/50 border-slate-800 border-dashed hover:bg-slate-900 hover:border-violet-500/50 transition-all cursor-pointer">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                        <Plus className="w-6 h-6 text-violet-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-white">Create your first widget →</p>
                        <p className="text-sm text-slate-500 mt-1">Free forever • No credit card required</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ) : (
            <>
              {widgets.map((widget) => (
                <WidgetCard key={widget.id} widget={widget} />
              ))}

              {!atLimit && (
                <Link href="/dashboard/widget/new">
                  <Card className="bg-slate-900/50 border-slate-800 border-dashed hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-center gap-3 text-slate-400">
                        <Plus className="w-5 h-5" />
                        <span className="text-sm">Create New Widget</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
