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
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <CardContent className="space-y-4">
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
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
                  Sign In
                </Button>
                <Button variant="link" className="text-sm">
                  Forgot password?
                </Button>
              </CardFooter>
            </TabsContent>

            <TabsContent value="signup">
              <CardContent className="space-y-4">
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Sign up to start shopping with exclusive deals
                </CardDescription>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
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
                  Create Account
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
