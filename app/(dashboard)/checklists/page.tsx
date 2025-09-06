"use client";

import { useState, useEffect } from 'react';
import { ChecklistCard } from '@/components/checklist-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { Checklist } from '@/lib/types';
import { toast } from 'sonner';

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [filteredChecklists, setFilteredChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    fetchChecklists();
  }, []);

  useEffect(() => {
    filterChecklists();
  }, [checklists, searchQuery, filterStatus]);

  const fetchChecklists = async () => {
    try {
      const response = await fetch('/api/checklists');
      if (response.ok) {
        const data = await response.json();
        setChecklists(data);
      }
    } catch (error) {
      console.error('Error fetching checklists:', error);
      toast.error('Failed to load checklists');
    } finally {
      setLoading(false);
    }
  };

  const filterChecklists = () => {
    let filtered = checklists;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(checklist =>
        checklist.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        checklist.businessType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(checklist => {
        const completedTasks = checklist.tasks.filter(task => task.completed).length;
        const isCompleted = completedTasks === checklist.tasks.length;
        return filterStatus === 'completed' ? isCompleted : !isCompleted;
      });
    }

    setFilteredChecklists(filtered);
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
        toast.success('Checklist deleted');
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
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-accent rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Checklists</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your compliance checklists in one place
          </p>
        </div>
        <Link href="/checklists/new">
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="mr-2 h-4 w-4" />
            New Checklist
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city or business type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('completed')}
                >
                  Completed
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredChecklists.length} of {checklists.length} checklists
            </p>
            <div className="flex space-x-2">
              {filterStatus !== 'all' && (
                <Badge variant="secondary">
                  {filterStatus === 'completed' ? 'Completed' : 'Pending'}
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary">
                  Search: "{searchQuery}"
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklists Grid */}
      {filteredChecklists.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            {checklists.length === 0 ? (
              <>
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
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-2">No matching checklists</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                >
                  Clear Filters
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredChecklists.map((checklist) => (
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
  );
}