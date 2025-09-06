import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, CheckCircle, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

interface CityHeroProps {
  city: string;
  description: string;
  features: string[];
}

export function CityHero({ city, description, features }: CityHeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-orange-900/10">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%22%23F97316%22 fillOpacity=0.05%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]`
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="h-12 w-12 text-orange-500 mr-4" />
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="gradient-text">{city}</span>
              <br />
              <span className="text-foreground">Food Truck Checklist</span>
            </h1>
          </div>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 hero-glow text-lg px-8 py-3">
                Generate My {city} Checklist
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="border-orange-600/50 hover:bg-orange-600/10 text-lg px-8 py-3">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div id="features" className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const icons = [CheckCircle, Clock, Shield];
            const Icon = icons[index] || CheckCircle;

            return (
              <Card key={index} className="card-hover border-orange-600/20">
                <CardContent className="p-6 text-center">
                  <Icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <p className="text-foreground font-medium">{feature}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
