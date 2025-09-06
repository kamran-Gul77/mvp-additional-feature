import { Navbar } from '@/components/layout/navbar';
import { CityHero } from '@/components/city-hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, DollarSign, FileText } from 'lucide-react';
import { notFound } from 'next/navigation';

const cityData = {
  nyc: {
    name: 'New York City',
    description: 'Navigate the complex world of NYC food truck regulations with our comprehensive checklist. From mobile food vendor licenses to fire department permits, we\'ve got you covered.',
    features: [
      'Complete NYC permit checklist with 15+ requirements',
      'Automated renewal reminders for all permits',
      'Step-by-step guidance for each permit application'
    ],
    requirements: [
      {
        category: 'Business Licenses',
        items: [
          { name: 'Mobile Food Vendor License', cost: '$200', renewal: 'Annual', timeframe: '4-6 weeks' },
          { name: 'Business License', cost: '$340', renewal: 'Biennial', timeframe: '2-4 weeks' },
          { name: 'DCA License', cost: '$75', renewal: 'Annual', timeframe: '2-3 weeks' }
        ]
      },
      {
        category: 'Health & Safety',
        items: [
          { name: 'Food Service Establishment Permit', cost: '$280', renewal: 'Annual', timeframe: '3-4 weeks' },
          { name: 'Food Handler\'s License', cost: '$15', renewal: '3 years', timeframe: '1 day' },
          { name: 'Fire Department Permit', cost: '$150', renewal: 'Annual', timeframe: '2-3 weeks' }
        ]
      },
      {
        category: 'Vehicle & Equipment',
        items: [
          { name: 'Commercial Vehicle Registration', cost: '$150', renewal: 'Annual', timeframe: '1 week' },
          { name: 'Equipment Inspection', cost: '$100', renewal: '6 months', timeframe: '1 week' },
          { name: 'Propane Tank Certification', cost: '$50', renewal: 'Annual', timeframe: '1 week' }
        ]
      }
    ]
  },
  dallas: {
    name: 'Dallas',
    description: 'Start your Dallas food truck journey with confidence. Our Dallas-specific checklist covers all city requirements, from mobile food unit permits to health inspections.',
    features: [
      'Dallas city-specific requirements with 12+ permits',
      'Cost breakdown and timeline estimates',
      'Direct links to Dallas permit applications'
    ],
    requirements: [
      {
        category: 'Business Licenses',
        items: [
          { name: 'Mobile Food Unit Permit', cost: '$150', renewal: 'Annual', timeframe: '2-3 weeks' },
          { name: 'Business License', cost: '$75', renewal: 'Annual', timeframe: '1-2 weeks' },
          { name: 'Sales Tax Permit', cost: '$0', renewal: 'N/A', timeframe: '1 week' }
        ]
      },
      {
        category: 'Health & Safety',
        items: [
          { name: 'Food Handler\'s License', cost: '$10', renewal: '2 years', timeframe: '1 day' },
          { name: 'Health Inspection', cost: '$100', renewal: '6 months', timeframe: '1-2 weeks' },
          { name: 'Fire Safety Inspection', cost: '$75', renewal: 'Annual', timeframe: '1 week' }
        ]
      },
      {
        category: 'Operations',
        items: [
          { name: 'Vending Location Permit', cost: '$25', renewal: 'Daily/Event', timeframe: '1 day' },
          { name: 'Waste Disposal Agreement', cost: '$50', renewal: 'Annual', timeframe: '1 week' },
          { name: 'Commissary Agreement', cost: '$200/month', renewal: 'Monthly', timeframe: '1 week' }
        ]
      }
    ]
  },
  la: {
    name: 'Los Angeles',
    description: 'Master LA\'s extensive food truck regulations with our comprehensive guide. From county health permits to city business licenses, ensure full compliance in the City of Angels.',
    features: [
      'Complete LA County and City requirements (18+ permits)',
      'Zone-specific vending regulations',
      'Multi-jurisdiction compliance guidance'
    ],
    requirements: [
      {
        category: 'Business Licenses',
        items: [
          { name: 'Business License (City)', cost: '$300', renewal: 'Annual', timeframe: '3-4 weeks' },
          { name: 'Mobile Food Facility Permit', cost: '$1,000', renewal: 'Annual', timeframe: '6-8 weeks' },
          { name: 'Reseller\'s Permit', cost: '$0', renewal: 'N/A', timeframe: '1 week' }
        ]
      },
      {
        category: 'Health & Safety',
        items: [
          { name: 'County Health Permit', cost: '$500', renewal: 'Annual', timeframe: '4-6 weeks' },
          { name: 'Food Manager Certification', cost: '$15', renewal: '5 years', timeframe: '1 day' },
          { name: 'Fire Department Inspection', cost: '$200', renewal: 'Annual', timeframe: '2-3 weeks' }
        ]
      },
      {
        category: 'Operations & Compliance',
        items: [
          { name: 'Vending Route Permit', cost: '$150', renewal: 'Annual', timeframe: '2-4 weeks' },
          { name: 'Commissary Kitchen Contract', cost: '$300/month', renewal: 'Monthly', timeframe: '1-2 weeks' },
          { name: 'Workers\' Compensation Insurance', cost: '$500/year', renewal: 'Annual', timeframe: '1 week' },
          { name: 'General Liability Insurance', cost: '$800/year', renewal: 'Annual', timeframe: '1 week' }
        ]
      }
    ]
  }
};

export default function CityPage({ params }: { params: { city: string } }) {
  const city = cityData[params.city as keyof typeof cityData];
  
  if (!city) {
    notFound();
  }

  const totalCost = city.requirements.reduce((total, category) => {
    return total + category.items.reduce((catTotal, item) => {
      const cost = parseInt(item.cost.replace(/[$,/\w]/g, '')) || 0;
      return catTotal + cost;
    }, 0);
  }, 0);

  const totalItems = city.requirements.reduce((total, category) => total + category.items.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CityHero city={city.name} description={city.description} features={city.features} />
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">{totalItems}</div>
                <div className="text-muted-foreground">Total Requirements</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <DollarSign className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">${totalCost.toLocaleString()}</div>
                <div className="text-muted-foreground">Estimated Startup Cost</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">8-12</div>
                <div className="text-muted-foreground">Weeks to Complete</div>
              </CardContent>
            </Card>
          </div>

          {/* Requirements by Category */}
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Complete <span className="gradient-text">{city.name}</span> Requirements
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to legally operate your food truck in {city.name}
              </p>
            </div>

            {city.requirements.map((category, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-orange-500" />
                    <span>{category.category}</span>
                    <Badge variant="secondary">{category.items.length} items</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{item.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Renewal: {item.renewal}</span>
                            <span>Timeline: {item.timeframe}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-orange-500">{item.cost}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-orange-600/10 to-orange-500/5 border-orange-600/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6">
                  Create your personalized {city.name} checklist and never miss a renewal deadline again.
                </p>
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge className="bg-green-600/20 text-green-400 border-green-600/30 mb-4">
                      Free Plan Available
                    </Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/sign-up" className="inline-block">
                      <Card className="card-hover cursor-pointer border-orange-600/50 hover:border-orange-600">
                        <CardContent className="p-4 text-center">
                          <div className="font-semibold">Free Plan</div>
                          <div className="text-2xl font-bold text-orange-500">$0</div>
                          <div className="text-sm text-muted-foreground">1 checklist</div>
                        </CardContent>
                      </Card>
                    </a>
                    <a href="/sign-up" className="inline-block">
                      <Card className="card-hover cursor-pointer border-orange-600 bg-orange-600/10">
                        <CardContent className="p-4 text-center">
                          <Badge className="bg-orange-600 text-white mb-2">Most Popular</Badge>
                          <div className="font-semibold">Pro Plan</div>
                          <div className="text-2xl font-bold text-orange-500">$19</div>
                          <div className="text-sm text-muted-foreground">Unlimited + Reminders</div>
                        </CardContent>
                      </Card>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { city: 'nyc' },
    { city: 'dallas' },
    { city: 'la' },
  ];
}

export function generateMetadata({ params }: { params: { city: string } }) {
  const city = cityData[params.city as keyof typeof cityData];
  
  if (!city) {
    return {
      title: 'City Not Found - Compliance Buddy',
    };
  }

  return {
    title: `${city.name} Food Truck Checklist - Compliance Buddy`,
    description: city.description,
    keywords: `${city.name.toLowerCase()}, food truck, permits, licenses, compliance, checklist`,
  };
}