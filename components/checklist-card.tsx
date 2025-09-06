"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, MapPin, Calendar, Trash2 } from 'lucide-react';
import { Checklist } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';
import { toast } from 'sonner';

interface ChecklistCardProps {
  checklist: Checklist;
  onUpdate: (checklistId: string, taskIndex: number, completed: boolean) => void;
  onDelete: (checklistId: string) => void;
}

export function ChecklistCard({ checklist, onUpdate, onDelete }: ChecklistCardProps) {
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  
  const completedTasks = checklist.tasks.filter(task => task.completed).length;
  const totalTasks = checklist.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleTaskToggle = async (taskIndex: number, completed: boolean) => {
    setIsUpdating(taskIndex);
    try {
      await onUpdate(checklist._id!, taskIndex, completed);
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this checklist?')) {
      try {
        await onDelete(checklist._id!);
        toast.success('Checklist deleted');
      } catch (error) {
        toast.error('Failed to delete checklist');
      }
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-orange-500" />
            <span>{checklist.city} {checklist.businessType}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(new Date(checklist.createdAt))}</span>
          </div>
          <Badge variant="secondary">
            {completedTasks}/{totalTasks} Complete
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {checklist.tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
            >
              <button
                onClick={() => handleTaskToggle(index, !task.completed)}
                disabled={isUpdating === index}
                className="flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground hover:text-orange-500" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.task}
                </p>
                <p className="text-xs text-muted-foreground">
                  Renewal: {task.renewal}
                  {task.dueDate && (
                    <span className="ml-2">
                      • Due: {formatDate(new Date(task.dueDate))}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}