import { Sparkles, Target, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const features = [
    {
      icon: Sparkles,
      title: 'Creative Excellence',
      description: 'Bringing innovative ideas to life with attention to detail and artistic vision.'
    },
    {
      icon: Target,
      title: 'Goal-Oriented',
      description: 'Focused on delivering results that exceed expectations and drive success.'
    },
    {
      icon: Heart,
      title: 'Passionate Work',
      description: 'Every project is crafted with dedication, care, and genuine enthusiasm.'
    }
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              About This Space
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              This website represents a journey of creativity, learning, and growth. 
              It's a place where ideas come to life and stories are told through design.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border bg-card hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <div className="bg-card rounded-2xl p-8 sm:p-12 shadow-soft border border-border">
            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-6">
                Welcome to My Portfolio
              </h3>
              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  This website serves as a digital canvas where creativity meets functionality. 
                  Every element has been carefully considered to create an experience that is 
                  both visually appealing and purposeful.
                </p>
                <p>
                  Built with modern web technologies and designed with a focus on user experience, 
                  this space reflects a commitment to quality and attention to detail. The warm 
                  earth tones and elegant typography create an inviting atmosphere that encourages 
                  exploration and engagement.
                </p>
                <p>
                  Whether you're here to learn more about my work, explore creative projects, or 
                  simply appreciate thoughtful design, I hope you find inspiration in these pages. 
                  Thank you for visiting, and feel free to reach out if you'd like to connect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
