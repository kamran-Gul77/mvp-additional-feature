"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChecklistCard } from '@/components/checklist-card';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Plus,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { Checklist } from '@/lib/types';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useUser();
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<'free' | 'paid'>('free');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [checklistsRes, userRes] = await Promise.all([
        fetch('/api/checklists'),
        fetch('/api/user')
      ]);
      
      if (checklistsRes.ok) {
        const checklistsData = await checklistsRes.json();
        setChecklists(checklistsData);
      } else {
        console.error('Failed to fetch checklists:', await checklistsRes.text());
      }
      
      if (userRes.ok) {
        const userData = await userRes.json();
        setUserPlan(userData.subscription || 'free');
      } else {
        console.error('Failed to fetch user data:', await userRes.text());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (checklistId: string, taskIndex: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/checklists/${checklistId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIndex, completed }),
      });

      if (response.ok) {
        // Update local state
        setChecklists(prev =>
          prev.map(checklist =>
            checklist._id === checklistId
              ? {
                  ...checklist,
                  tasks: checklist.tasks.map((task, index) =>
                    index === taskIndex ? { ...task, completed } : task
                  ),
                }
              : checklist
          )
        );
        toast.success(completed ? 'Task completed!' : 'Task marked as pending');
      }
    } catch (error) {
      throw new Error('Failed to update task');
    }
  };

  const handleChecklistDelete = async (checklistId: string) => {
    try {
      const response = await fetch(`/api/checklists/${checklistId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChecklists(prev => prev.filter(c => c._id !== checklistId));
      }
    } catch (error) {
      throw new Error('Failed to delete checklist');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-accent rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalTasks = checklists.reduce((sum, checklist) => sum + checklist.tasks.length, 0);
  const completedTasks = checklists.reduce((sum, checklist) => 
    sum + checklist.tasks.filter(task => task.completed).length, 0
  );
  const pendingTasks = totalTasks - completedTasks;
  const upcomingRenewals = checklists.reduce((sum, checklist) => 
    sum + checklist.tasks.filter(task => task.dueDate && new Date(task.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length, 0
  );

  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.firstName || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here is your compliance overview
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {userPlan === 'free' && (
            <Link href="/settings?tab=billing">
              <Button variant="outline" className="border-orange-600/50 hover:bg-orange-600/10">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </Link>
          )}
          <Link href="/checklists/new">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="mr-2 h-4 w-4" />
              New Checklist
            </Button>
          </Link>
        </div>
      </div>

      {/* Plan Status */}
      {userPlan === 'free' && checklists.length > 0 && (
        <Card className="border-orange-600/20 bg-gradient-to-r from-orange-600/10 to-orange-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">Free Plan Limit</h3>
                <p className="text-muted-foreground">
                  You are using {checklists.length}/1 checklists. Upgrade for unlimited checklists and reminders.
                </p>
              </div>
              <Link href="/settings?tab=billing">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Upgrade Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Across {checklists.length} checklist{checklists.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tasks remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{upcomingRenewals}</div>
            <p className="text-xs text-muted-foreground">
              Within 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      {totalTasks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed across all checklists
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Checklists */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Checklists</h2>
          {checklists.length > 0 && (
            <Link href="/checklists">
              <Button variant="outline">View All</Button>
            </Link>
          )}
        </div>

        {checklists.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No checklists yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first compliance checklist to get started
              </p>
              <Link href="/checklists/new">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Checklist
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {checklists.slice(0, 3).map((checklist) => (
              <ChecklistCard
                key={checklist._id}
                checklist={checklist}
                onUpdate={handleTaskUpdate}
                onDelete={handleChecklistDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}