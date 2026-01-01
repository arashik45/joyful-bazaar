import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-16 px-4 gradient-hero">
        <Card className="w-full max-w-md shadow-strong">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">লগইন</TabsTrigger>
                <TabsTrigger value="signup">সাইন আপ</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <CardContent className="space-y-4">
                <CardTitle>পুনরায় স্বাগতম</CardTitle>
                <CardDescription>
                  আপনার একাউন্টে ঢোকার জন্য তথ্য দিন
                </CardDescription>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">ইমেইল</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">পাসওয়ার্ড</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button className="w-full" variant="hero">
                  লগইন করুন
                </Button>
                <Button variant="link" className="text-sm">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="signup">
              <CardContent className="space-y-4">
                <CardTitle>নতুন একাউন্ট তৈরি করুন</CardTitle>
                <CardDescription>
                  এক্সক্লুসিভ ডিসকাউন্ট পেতে এখনই রেজিস্ট্রেশন করুন
                </CardDescription>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">পুরো নাম</Label>
                    <Input 
                      id="signup-name" 
                      placeholder="আপনার নাম"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">ইমেইল</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="hero">
                  একাউন্ট তৈরি করুন
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
