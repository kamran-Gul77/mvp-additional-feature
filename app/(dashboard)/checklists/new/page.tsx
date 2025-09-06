"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Truck, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const cities = [
  { value: 'NYC', label: 'New York City', description: '15+ permits required' },
  { value: 'Dallas', label: 'Dallas', description: '12+ permits required' },
  { value: 'LA', label: 'Los Angeles', description: '18+ permits required' },
];

const businessTypes = [
  { value: 'Food Truck', label: 'Food Truck', description: 'Mobile food service' },
];

export default function NewChecklistPage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  if (!selectedCity || !selectedBusinessType) {
    toast.error("Please select both city and business type");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("/api/checklists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: selectedCity,
        businessType: selectedBusinessType,
      }),
    });

    if (response.ok) {
      toast.success("Checklist created successfully!");
      router.push("/checklists");
    } else {
      const error = await response.json();
      // Show API error if available
      toast.error(error.error || error.message || "Failed to create checklist");
    }
  } catch (error) {
    console.error("Error creating checklist:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/checklists">
          <Button variant="ghost" className="mb-4 hover:text-orange-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checklists
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Create New Checklist</h1>
        <p className="text-muted-foreground">
          Generate a compliance checklist tailored to your city and business type
        </p>
      </div>

      <div className="grid gap-8">
        {/* City Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-orange-500" />
              <span>Select Your City</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {cities.map((city) => (
                <div
                  key={city.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 card-hover ${
                    selectedCity === city.value
                      ? 'border-orange-600 bg-orange-600/10'
                      : 'border-border hover:border-orange-600/50'
                  }`}
                  onClick={() => setSelectedCity(city.value)}
                >
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-1">{city.label}</h3>
                    <p className="text-sm text-muted-foreground">{city.description}</p>
                    {selectedCity === city.value && (
                      <CheckCircle className="h-6 w-6 text-orange-500 mx-auto mt-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-orange-500" />
              <span>Select Business Type</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {businessTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 card-hover ${
                    selectedBusinessType === type.value
                      ? 'border-orange-600 bg-orange-600/10'
                      : 'border-border hover:border-orange-600/50'
                  }`}
                  onClick={() => setSelectedBusinessType(type.value)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    {selectedBusinessType === type.value && (
                      <CheckCircle className="h-6 w-6 text-orange-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Preview & Submit */}
        {selectedCity && selectedBusinessType && (
          <Card className="bg-gradient-to-r from-orange-600/10 to-orange-500/5 border-orange-600/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Checklist Preview</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">
                    <strong>City:</strong> {cities.find(c => c.value === selectedCity)?.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">
                    <strong>Business Type:</strong> {businessTypes.find(t => t.value === selectedBusinessType)?.label}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                {loading ? 'Generating Checklist...' : 'Generate My Checklist'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}