import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    discount: 0,
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
    const { id, name, price, description, category, image, stock_count, discount } =
      editingProduct as any;

    const { error } = await supabase
      .from("products")
      .update({
        name,
        price,
        description,
        category,
        image_url: image,
        stock_count: stock_count ?? 0,
        discount: discount ?? 0,
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
      discount: newProduct.discount,
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
        discount: 0,
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <Card className="w-full max-w-sm">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
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
            <Card>
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
              <Card>
                <CardHeader>
                  <CardTitle>নতুন পণ্য যোগ করুন</CardTitle>
                </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Product Name:</span>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="পণ্যের নাম"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Price:</span>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) || 0 })}
                  placeholder="দাম"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Category:</span>
                <select
                  className="border border-border rounded-md bg-background px-3 py-2 text-sm"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Main Image URL (1):</span>
                <Input
                  value={newProduct.image1}
                  onChange={(e) => setNewProduct({ ...newProduct, image1: e.target.value })}
                  placeholder="প্রধান ইমেজের URL"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Image URL (2):</span>
                <Input
                  value={newProduct.image2}
                  onChange={(e) => setNewProduct({ ...newProduct, image2: e.target.value })}
                  placeholder="২ নম্বর ইমেজের URL (ঐচ্ছিক)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Image URL (3):</span>
                <Input
                  value={newProduct.image3}
                  onChange={(e) => setNewProduct({ ...newProduct, image3: e.target.value })}
                  placeholder="৩ নম্বর ইমেজের URL (ঐচ্ছিক)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Image URL (4):</span>
                <Input
                  value={newProduct.image4}
                  onChange={(e) => setNewProduct({ ...newProduct, image4: e.target.value })}
                  placeholder="৪ নম্বর ইমেজের URL (ঐচ্ছিক)"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Stock Count:</span>
                <Input
                  type="number"
                  value={newProduct.stock_count}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock_count: Number(e.target.value) || 0 })
                  }
                  placeholder="স্টক পরিমাণ"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Discount (%):</span>
                <Input
                  type="number"
                  value={newProduct.discount}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, discount: Number(e.target.value) || 0 })
                  }
                  placeholder="ডিসকাউন্ট (০-১০০%)"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium">Product Description (ওয়েবসাইটে দেখা যাবে):</span>
                <Textarea
                  className="min-h-[160px] resize-y"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="প্রোডাক্টের বিস্তারিত বর্ণনা (এখানে যা লিখবেন, নিচের পণ্যের বিস্তারিত ট্যাবে তাই দেখাবে)"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                  ক্যানসেল
                </Button>
                <Button variant="hero" onClick={handleAddProduct}>
                  পণ্য যোগ করুন
                </Button>
              </div>
            </CardContent>
              </Card>
            )}

            {editingProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>পণ্য আপডেট করুন</CardTitle>
                </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Product Name:</span>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => handleProductChange("name", e.target.value)}
                  placeholder="পণ্যের নাম"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Price:</span>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => handleProductChange("price", Number(e.target.value) || 0)}
                  placeholder="দাম"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Category:</span>
                <select
                  className="border border-border rounded-md bg-background px-3 py-2 text-sm"
                  value={editingProduct.category}
                  onChange={(e) => handleProductChange("category", e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Image URL:</span>
                <Input
                  value={editingProduct.image}
                  onChange={(e) => handleProductChange("image", e.target.value)}
                  placeholder="ইমেজ URL"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Stock Count:</span>
                <Input
                  type="number"
                  value={editingProduct.stock_count ?? 0}
                  onChange={(e) => handleProductChange("stock_count", Number(e.target.value) || 0)}
                  placeholder="স্টক পরিমাণ"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Discount (%):</span>
                <Input
                  type="number"
                  value={(editingProduct as any).discount ?? 0}
                  onChange={(e) => handleProductChange("discount", Number(e.target.value) || 0)}
                  placeholder="ডিসকাউন্ট (০-১০০%)"
                />
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-medium">Product Description (ওয়েবসাইটে দেখা যাবে):</span>
                <Textarea
                  className="min-h-[160px] resize-y"
                  value={editingProduct.description || ""}
                  onChange={(e) => handleProductChange("description", e.target.value)}
                  placeholder="প্রোডাক্টের বিস্তারিত বর্ণনা (এখানে যা লিখবেন, নিচের পণ্যের বিস্তারিত ট্যাবে তাই দেখাবে)"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  ক্যানসেল
                </Button>
                <Button variant="hero" onClick={handleSaveProduct}>
                  সেভ করুন
                </Button>
              </div>
            </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>অর্ডার তালিকা</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>কাস্টমার</TableHead>
                      <TableHead>ঠিকানা</TableHead>
                      <TableHead>অর্ডার আইটেম</TableHead>
                      <TableHead>টোটাল</TableHead>
                      <TableHead>স্ট্যাটাস</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingOrders && (
                      <TableRow>
                        <TableCell colSpan={5}>অর্ডার লোড হচ্ছে...</TableCell>
                      </TableRow>
                    )}
                    {!loadingOrders && orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>কোন অর্ডার পাওয়া যায়নি।</TableCell>
                      </TableRow>
                    )}
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>{o.customer_name}</TableCell>
                        <TableCell>{o.address}</TableCell>
                        <TableCell className="max-w-xs truncate" title={o.items}>
                          {o.items}
                        </TableCell>
                        <TableCell>৳{o.total_price}</TableCell>
                        <TableCell>
                          <select
                            className="border border-border rounded-md bg-background px-2 py-1 text-xs"
                            value={o.status}
                            onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>মোট {orders.length} টি অর্ডার</TableCaption>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
