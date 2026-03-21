import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, MousePointer, Sparkles } from "lucide-react";
export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your widgets and track performance</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
          <Link href="/widget/new" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Widget
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <MousePointer className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Active Widgets</p>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">This Month</p>
                <p className="text-2xl font-bold text-white">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Plan</p>
                <p className="text-2xl font-bold text-white">Free</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Bar */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Monthly Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">47 of 200 views</span>
              <span className="text-slate-400">24%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[24%] bg-gradient-to-r from-violet-500 to-purple-600 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widgets */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Your Widgets</h2>
        <div className="grid gap-4">
          <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
                    <span className="text-violet-400 font-bold">W</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">My First Widget</h3>
                    <p className="text-sm text-slate-400">Carousel • 5 reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Get Code
                  </Button>
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create New */}
          <Link href="/widget/new">
            <Card className="bg-slate-900/50 border-slate-800 border-dashed hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3 text-slate-400">
                  <Plus className="w-5 h-5" />
                  <span>Create New Widget</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
