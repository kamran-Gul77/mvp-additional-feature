"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Database, 
  FileText, 
  Users, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { ChecklistTemplate } from '@/lib/types';

export default function AdminPage() {
  const { user } = useUser();
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<ChecklistTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Check if user is admin (you can implement your own admin logic)
  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === 'admin@compliancebuddy.com';

  useEffect(() => {
    if (isAdmin) {
      fetchTemplates();
    }
  }, [isAdmin]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (template: Partial<ChecklistTemplate>) => {
    try {
      const method = template._id ? 'PATCH' : 'POST';
      const url = template._id ? `/api/admin/templates/${template._id}` : '/api/admin/templates';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        toast.success(template._id ? 'Template updated!' : 'Template created!');
        fetchTemplates();
        setEditingTemplate(null);
        setIsCreating(false);
      } else {
        toast.error('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Template deleted!');
        fetchTemplates();
      } else {
        toast.error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <Card>
          <CardContent className="p-12">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You do <noscript></noscript>t have permission to access the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-accent rounded w-1/3"></div>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-accent rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage checklist templates and system settings
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Checklist Templates</h2>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>

          {/* Create/Edit Template Form */}
          {(isCreating || editingTemplate) && (
            <Card className="border-orange-600/20">
              <CardHeader>
                <CardTitle>
                  {isCreating ? 'Create New Template' : 'Edit Template'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateForm
                  template={editingTemplate}
                  onSave={handleSaveTemplate}
                  onCancel={() => {
                    setIsCreating(false);
                    setEditingTemplate(null);
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Templates List */}
          <div className="grid gap-6">
            {templates.map((template) => (
              <Card key={template._id} className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{template.city} - {template.businessType}</span>
                      <Badge variant="secondary">{template.tasks.length} tasks</Badge>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template._id!)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {template.tasks.slice(0, 3).map((task, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {task.task} ({task.renewal})
                      </div>
                    ))}
                    {template.tasks.length > 3 && (
                      <div className="text-sm text-muted-foreground">
                        ... and {template.tasks.length - 3} more tasks
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{templates.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cities Covered</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(templates.map(t => t.city)).size}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {templates.reduce((sum, t) => sum + t.tasks.length, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Tasks/Template</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {templates.length > 0 
                    ? Math.round(templates.reduce((sum, t) => sum + t.tasks.length, 0) / templates.length)
                    : 0
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TemplateForm({ 
  template, 
  onSave, 
  onCancel 
}: { 
  template: ChecklistTemplate | null; 
  onSave: (template: Partial<ChecklistTemplate>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    city: template?.city || '',
    businessType: template?.businessType || '',
    tasks: template?.tasks || [{ task: '', renewal: '' }]
  });

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { task: '', renewal: '' }]
    }));
  };

  const removeTask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const updateTask = (index: number, field: 'task' | 'renewal', value: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  };

  const handleSubmit = () => {
    if (!formData.city || !formData.businessType || formData.tasks.some(t => !t.task || !t.renewal)) {
      toast.error('Please fill in all fields');
      return;
    }

    onSave({
      _id: template?._id,
      city: formData.city,
      businessType: formData.businessType,
      tasks: formData.tasks
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="e.g., NYC, Dallas, LA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type</Label>
          <Input
            id="businessType"
            value={formData.businessType}
            onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
            placeholder="e.g., Food Truck"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Tasks</Label>
          <Button onClick={addTask} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        {formData.tasks.map((task, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <Input
                value={task.task}
                onChange={(e) => updateTask(index, 'task', e.target.value)}
                placeholder="Task name"
              />
            </div>
            <div className="w-32">
              <Input
                value={task.renewal}
                onChange={(e) => updateTask(index, 'renewal', e.target.value)}
                placeholder="Renewal period"
              />
            </div>
            <Button
              onClick={() => removeTask(index)}
              variant="ghost"
              size="sm"
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
          <Save className="mr-2 h-4 w-4" />
          Save Template
        </Button>
      </div>
    </div>
  );
}