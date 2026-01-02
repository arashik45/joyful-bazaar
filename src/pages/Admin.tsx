import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

interface Order {
  id: string;
  customer_name: string;
  address: string;
  items: string;
  total_price: number;
  status: string;
}

const ADMIN_PASSWORD = "demo123";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [passwordInput, setPasswordInput] = useState("");
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem("admin_unlocked") === "true";
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const CATEGORY_OPTIONS = [
    "Men’s Fashion",
    "Women’s Fashion",
    "Kids & Baby",
    "Islamic Products",
    "Electronics & Gadgets",
    "Home & Lifestyle",
    "Kitchen Accessories",
    "Baby Items",
    "Women",
    "Men",
    "Electronics",
  ];
 
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    category: CATEGORY_OPTIONS[0],
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    stock_count: 0,
    description: "",
    longDescription: "",
    discount: 0,
    metaText: "",
  });

  useEffect(() => {
    if (!unlocked) return;
    fetchProducts();
    fetchOrders();
  }, [unlocked]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setUnlocked(true);
      sessionStorage.setItem("admin_unlocked", "true");
      toast({ title: "অ্যাডমিন ড্যাশবোর্ড আনলক হয়েছে" });
    } else {
      toast({ title: "ভুল পাসওয়ার্ড", description: "দয়া করে সঠিক পাসওয়ার্ড দিন (demo123)", variant: "destructive" });
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast({ title: "পণ্য লোডে সমস্যা", variant: "destructive" });
    } else {
      const mapped: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price ?? 0),
        image: p.image_url || "",
        category: p.category || "General",
        description: p.description || "",
        stock_count: typeof p.stock_count === "number" ? p.stock_count : Number(p.stock_count ?? 0) || 0,
        discount: Number(p.discount ?? 0),
        seo_description: p.seo_description || "",
      }));
      setProducts(mapped);
    }
    setLoadingProducts(false);
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast({ title: "অর্ডার লোডে সমস্যা", variant: "destructive" });
    } else {
      setOrders(
        (data || []).map((o: any) => ({
          id: o.id,
          customer_name: o.customer_name,
          address: o.address,
          items: o.items,
          total_price: Number(o.total_price ?? 0),
          status: o.status,
        }))
      );
    }
    setLoadingOrders(false);
  };

  const handleProductChange = (field: keyof Product, value: string | number) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value } as Product);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    const { id, name, price, description, category, image, stock_count, discount, seo_description, long_description } =
      editingProduct as any;

    const { error } = await supabase
      .from("products")
      .update({
        name,
        price,
        description,
        long_description: long_description || "",
        category,
        image_url: image,
        stock_count: stock_count ?? 0,
        discount: discount ?? 0,
        seo_description: seo_description || "",
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      toast({ title: "পণ্য আপডেট ব্যর্থ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "পণ্য আপডেট হয়েছে" });
      setEditingProduct(null);
      fetchProducts();
    }
  };

  const handleAddProduct = async () => {
    const { error } = await supabase.from("products").insert({
      name: newProduct.name,
      price: newProduct.price,
      category: newProduct.category,
      image_url: newProduct.image1,
      image_url_2: newProduct.image2,
      image_url_3: newProduct.image3,
      image_url_4: newProduct.image4,
      stock_count: newProduct.stock_count,
      description: newProduct.description,
      long_description: newProduct.longDescription,
      discount: newProduct.discount,
      seo_description: newProduct.metaText,
    });

    if (error) {
      console.error(error);
      toast({ title: "পণ্য তৈরি ব্যর্থ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "নতুন পণ্য যোগ হয়েছে" });
      setIsAddingProduct(false);
      setNewProduct({
        name: "",
        price: 0,
        category: CATEGORY_OPTIONS[0],
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        stock_count: 0,
        description: "",
        longDescription: "",
        discount: 0,
        metaText: "",
      });
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error(error);
      toast({ title: "পণ্য ডিলিট ব্যর্থ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "পণ্য ডিলিট হয়েছে" });
      fetchProducts();
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      console.error(error);
      toast({ title: "স্ট্যাটাস আপডেট ব্যর্থ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "অর্ডার স্ট্যাটাস আপডেট হয়েছে" });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-10">
        <Card className="w-full max-w-sm shadow-medium">
          <CardHeader>
            <CardTitle>অ্যাডমিন ড্যাশবোর্ডে ঢুকতে পাসওয়ার্ড দিন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUnlock} className="space-y-4">
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="demo123"
              />
              <Button type="submit" className="w-full" variant="hero">
                আনলক করুন
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            হোমে ফিরে যান
          </Button>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList>
            <TabsTrigger value="products">পণ্য ম্যানেজমেন্ট</TabsTrigger>
            <TabsTrigger value="orders">অর্ডার ম্যানেজমেন্ট</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-4 space-y-4">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>পণ্য তালিকা</CardTitle>
                <Button variant="hero" onClick={() => setIsAddingProduct(true)}>
                  নতুন পণ্য যোগ করুন
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>নাম</TableHead>
                      <TableHead>দাম</TableHead>
                      <TableHead>ডিসকাউন্ট</TableHead>
                      <TableHead>স্টক</TableHead>
                      <TableHead>ক্যাটাগরি</TableHead>
                      <TableHead>অ্যাকশন</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingProducts && (
                      <TableRow>
                        <TableCell colSpan={6}>পণ্য লোড হচ্ছে...</TableCell>
                      </TableRow>
                    )}
                    {!loadingProducts && products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6}>কোন পণ্য পাওয়া যায়নি।</TableCell>
                      </TableRow>
                    )}
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>৳{p.price}</TableCell>
                        <TableCell>{p.discount ?? 0}%</TableCell>
                        <TableCell>{p.stock_count ?? 0}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingProduct(p)}>
                            এডিট
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(p.id)}>
                            ডিলিট
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>মোট {products.length} টি পণ্য</TableCaption>
                </Table>
              </CardContent>
            </Card>

            {isAddingProduct && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>নতুন পণ্য যোগ করুন</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {/* ... keep existing add-product form fields ... */}
                </CardContent>
              </Card>
            )}

            {editingProduct && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>পণ্য আপডেট করুন</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  {/* ... keep existing edit-product form fields ... */}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>অর্ডার তালিকা</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ... keep existing orders table ... */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
