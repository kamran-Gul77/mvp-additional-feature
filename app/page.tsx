import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Bell, 
  Smartphone, 
  MapPin, 
  Star,
  Truck
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const cities = [
    {
      name: 'New York City',
      slug: 'nyc',
      requirements: '15+ permits required',
      color: 'from-blue-600 to-blue-800'
    },
    {
      name: 'Dallas',
      slug: 'dallas', 
      requirements: '12+ permits required',
      color: 'from-green-600 to-green-800'
    },
    {
      name: 'Los Angeles',
      slug: 'la',
      requirements: '18+ permits required', 
      color: 'from-purple-600 to-purple-800'
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: 'City-Specific Checklists',
      description: 'Get tailored compliance checklists for NYC, Dallas, and LA with all required permits and licenses.'
    },
    {
      icon: Bell,
      title: 'Automatic Reminders',
      description: 'Never miss a renewal deadline with our intelligent reminder system sent directly to your email.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-Friendly',
      description: 'Access your checklists anywhere, anytime with our responsive mobile design.'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Food Truck Owner, LA',
      content: 'Compliance Buddy saved me from missing my health inspection renewal. Worth every penny!',
      rating: 5
    },
    {
      name: 'James Chen',
      role: 'Food Truck Owner, NYC',
      content: 'Finally, someone who understands how complex NYC permits are. This tool is a lifesaver.',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      role: 'Food Truck Owner, Dallas',
      content: 'The reminders feature alone has saved me thousands in penalty fees. Highly recommended!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-orange-900/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%22%23F97316%22 fillOpacity=0.05%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 bg-orange-600/20 text-orange-400 border-orange-600/30">
              Trusted by 500+ Food Truck Owners
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
              <span className="text-foreground">Food Truck</span>
              <br />
              <span className="gradient-text">Compliance Made Easy</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
              Stay compliant with city-specific checklists and automatic renewal reminders. 
              Never miss a permit deadline again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/sign-up">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 hero-glow text-lg px-8 py-4">
                  <Truck className="mr-2 h-5 w-5" />
                  Generate My Checklist
                </Button>
              </Link>
              <Link href="#cities">
                <Button variant="outline" size="lg" className="border-orange-600/50 hover:bg-orange-600/10 text-lg px-8 py-4">
                  Explore Cities
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Businesses Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Permit Types</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">3</div>
                <div className="text-sm text-muted-foreground">Major Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">Compliance Buddy</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We understand the complexity of food truck regulations and make compliance simple.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((Feature, index) => {
              const Icon = Feature.icon;
              return (
                <Card key={index} className="card-hover border-orange-600/20 group">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6 p-4 bg-orange-600/10 rounded-full w-fit mx-auto group-hover:bg-orange-600/20 transition-colors">
                      <Icon className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{Feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{Feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="py-20 lg:py-32 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">City-Specific</span> Checklists
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each city has unique requirements. Get the exact checklist you need for your location.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {cities.map((city) => (
              <Card key={city.slug} className="card-hover overflow-hidden">
                <div className={`h-32 bg-gradient-to-br ${city.color}`}>
                  <div className="h-full flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                  <p className="text-muted-foreground mb-4">{city.requirements}</p>
                  <Link href={`/cities/${city.slug}`}>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      View {city.name} Checklist
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Loved by <span className="gradient-text">Food Truck Owners</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what our customers are saying about Compliance Buddy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-orange-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    {testimonial.content}
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-orange-600/10 to-orange-500/5">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to <span className="gradient-text">Stay Compliant</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of food truck owners who trust Compliance Buddy to keep them compliant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="border-orange-600/50 hover:bg-orange-600/10 text-lg px-8 py-4">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold gradient-text">Compliance Buddy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Compliance Buddy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
