import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Languages, Stethoscope, MapPin, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCAzLjk5LTRDNDIuMjEgMzAgNDQgMzEuNzkgNDQgMzRjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCAzLjk5LTRDNDIuMjEgNDAgNDQgNDEuNzkgNDQgNDRjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTR6TTI2IDM0YzAtMi4yMSAxLjc5LTQgMy45OS00QzMyLjIxIDMwIDM0IDMxLjc5IDM0IDM0YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgMy45OS00QzMyLjIxIDQwIDM0IDQxLjc5IDM0IDQ0YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Find Doctors Who Speak Your Language
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              Connecting Brooklyn's diverse communities with healthcare providers who understand you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/patient-signup")}
                className="bg-card text-primary hover:bg-card/90 shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6"
              >
                <Heart className="mr-2 h-5 w-5" />
                I'm Looking for a Doctor
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/doctor-signup")}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0 shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6"
              >
                <Stethoscope className="mr-2 h-5 w-5" />
                I'm a Healthcare Provider
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Healthcare Without Language Barriers
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everyone deserves quality healthcare in a language they understand
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-all border-border bg-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Languages className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">15+ Languages</h3>
              <p className="text-muted-foreground">
                Find doctors who speak Spanish, Chinese, Russian, Arabic, and many more languages
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all border-border bg-card">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Brooklyn-Based</h3>
              <p className="text-muted-foreground">
                All healthcare providers are located right here in Brooklyn, close to your community
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all border-border bg-card">
              <div className="w-12 h-12 rounded-full bg-accent-foreground/10 flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">All Specialties</h3>
              <p className="text-muted-foreground">
                From family medicine to specialists, find the right care for your needs
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-secondary via-secondary to-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-secondary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join our community today and experience healthcare that truly understands you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/patient-signup")}
              className="bg-card text-primary hover:bg-card/90 shadow-lg hover:shadow-xl transition-all"
            >
              Register as Patient
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/doctor-signup")}
              className="bg-background text-foreground hover:bg-background/90 border-0 shadow-lg hover:shadow-xl transition-all"
            >
              Register as Doctor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
