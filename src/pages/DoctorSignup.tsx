import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const doctorSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  language: z.string().min(1, "Please select a language"),
  address: z.string().min(5, "Address is required").max(300),
  specialty: z.string().min(1, "Please select a specialty"),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

const languages = [
  "Spanish", "Chinese (Mandarin)", "Chinese (Cantonese)", "Russian", 
  "Yiddish", "French", "Arabic", "Polish", "Hebrew", "Bengali",
  "Korean", "Haitian Creole", "Italian", "Urdu", "Other"
];

const specialties = [
  "Family Medicine", "Internal Medicine", "Pediatrics", "Cardiology",
  "Dermatology", "Orthopedics", "Psychiatry", "OB/GYN", "Neurology",
  "Gastroenterology", "Endocrinology", "Ophthalmology", "ENT",
  "Dentistry", "Other"
];

const DoctorSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
  });

  const onSubmit = async (data: DoctorFormData) => {
    setIsSubmitting(true);
    console.log("Doctor form submitted:", data);

    try {
      // Import supabase client
      const { supabase } = await import("@/integrations/supabase/client");
      
      // Save to database
      const { error: dbError } = await supabase
        .from("doctors")
        .insert([{
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          language: data.language,
          address: data.address,
          specialty: data.specialty,
        }]);

      if (dbError) throw dbError;

      // Send to Google Sheets via edge function
      const { error: sheetsError } = await supabase.functions.invoke("sync-to-sheets", {
        body: { 
          type: "doctor",
          data: data 
        },
      });

      if (sheetsError) {
        console.error("Failed to sync to Google Sheets:", sheetsError);
      }
      
      toast({
        title: "Registration Successful!",
        description: "Your profile will help patients find you.",
      });
      
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 hover:bg-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">Doctor Registration</h1>
              <p className="text-muted-foreground">Join our network of multilingual healthcare providers</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Enter your first name"
                    className="transition-all"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Enter your last name"
                    className="transition-all"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="your.email@example.com"
                  className="transition-all"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder="(123) 456-7890"
                  className="transition-all"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Practice Address *</Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="123 Main St, Brooklyn, NY 11201"
                  className="transition-all"
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty *</Label>
                <Select onValueChange={(value) => setValue("specialty", value)}>
                  <SelectTrigger className="transition-all">
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialty && (
                  <p className="text-sm text-destructive">{errors.specialty.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Languages Spoken *</Label>
                <Select onValueChange={(value) => setValue("language", value)}>
                  <SelectTrigger className="transition-all">
                    <SelectValue placeholder="Select language(s)" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-sm text-destructive">{errors.language.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-all"
              >
                {isSubmitting ? "Submitting..." : "Register as Doctor"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;
