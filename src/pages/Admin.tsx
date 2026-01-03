import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Package2, ShoppingBag, Settings as SettingsIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeSection, setActiveSection] = useState<"dashboard" | "products" | "orders" | "settings">("dashboard");

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
    status: "active" as "active" | "draft",
  });

  useEffect(() => {
    if (!unlocked) return;

    fetchProducts();
    fetchOrders();

    const productsChannel = supabase
      .channel("admin-products")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          fetchProducts();
        },
      )
      .subscribe();

    const ordersChannel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          fetchOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(ordersChannel);
    };
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
        long_description: p.long_description || "",
        status: p.status || "active",
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
        })),
      );
    }
    setLoadingOrders(false);
  };

  const uploadImageToBucket = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const filePath = `product-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);
      if (uploadError) {
        console.error(uploadError);
        toast({ title: "ইমেজ আপলোড ব্যর্থ", description: uploadError.message, variant: "destructive" });
        return null;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
      return data.publicUrl;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProductChange = (field: keyof Product, value: string | number) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value } as Product);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    const {
      id,
      name,
      price,
      description,
      category,
      image,
      stock_count,
      discount,
      seo_description,
      long_description,
      status,
    } = editingProduct as any;

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
        status: status || "active",
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
      status: newProduct.status,
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
        status: "active",
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
      <main className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-card border border-border rounded-2xl shadow-soft p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-4 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Ponno Hub</p>
              <p className="text-sm font-semibold">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-1 text-sm">
            <Button
              variant={activeSection === "dashboard" ? "hero" : "outline"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveSection("dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeSection === "products" ? "hero" : "outline"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveSection("products")}
            >
              <Package2 className="h-4 w-4" />
              Products
            </Button>
            <Button
              variant={activeSection === "orders" ? "hero" : "outline"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveSection("orders")}
            >
              <ShoppingBag className="h-4 w-4" />
              Orders
            </Button>
            <Button
              variant={activeSection === "settings" ? "hero" : "outline"}
              className="w-full justify-start gap-2"
              onClick={() => setActiveSection("settings")}
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </Button>
          </nav>

          <div className="mt-auto pt-4 border-t border-border/60 space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => navigate("/")}>
              <LogOut className="h-4 w-4" />
              হোমে ফিরে যান
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold">
                {activeSection === "dashboard" && "Dashboard Overview"}
                {activeSection === "products" && "পণ্য ম্যানেজমেন্ট"}
                {activeSection === "orders" && "অর্ডার ম্যানেজমেন্ট"}
                {activeSection === "settings" && "Settings"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                আপনার ই-কমার্স স্টোরের সব কিছু এক জায়গা থেকে কন্ট্রোল করুন।
              </p>
            </div>
          </header>

          {activeSection === "dashboard" && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-sm">মোট পণ্য</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{products.length}</CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-sm">মোট অর্ডার</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{orders.length}</CardContent>
              </Card>
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-sm">স্টক থাকা পণ্য</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                  {products.filter((p) => (p.stock_count ?? 0) > 0).length}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "products" && (
            <>
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
                        <TableHead>পণ্য</TableHead>
                        <TableHead>ক্যাটাগরি</TableHead>
                        <TableHead>দাম</TableHead>
                        <TableHead>স্টক</TableHead>
                        <TableHead>স্ট্যাটাস</TableHead>
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
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {p.image && (
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="h-10 w-10 rounded-md object-cover border border-border"
                                  loading="lazy"
                                />
                              )}
                              <div>
                                <p className="font-medium text-sm">{p.name}</p>
                                {p.discount ? (
                                  <p className="text-xs text-muted-foreground">ডিসকাউন্ট: {p.discount}%</p>
                                ) : null}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{p.category}</TableCell>
                          <TableCell>৳{p.price}</TableCell>
                          <TableCell>{p.stock_count ?? 0}</TableCell>
                          <TableCell>
                            <Badge
                              variant={p.status === "active" ? "secondary" : p.status === "draft" ? "outline" : "default"}
                            >
                              {p.status === "draft" ? "Draft" : "Active"}
                            </Badge>
                          </TableCell>
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
                      <span className="text-sm font-medium">Main Image:</span>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadImageToBucket(file);
                          if (url) {
                            setNewProduct((prev) => ({ ...prev, image1: url }));
                          }
                        }}
                      />
                      {uploadingImage && <span className="text-xs text-muted-foreground">ইমেজ আপলোড হচ্ছে...</span>}
                      {newProduct.image1 && (
                        <img
                          src={newProduct.image1}
                          alt="Preview"
                          className="mt-2 h-16 w-16 rounded-md object-cover border border-border"
                        />
                      )}
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
                        placeholder="স্টকে কতটি আছে"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Short Description:</span>
                      <Textarea
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        placeholder="সংক্ষিপ্ত বর্ণনা"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Long Description:</span>
                      <Textarea
                        value={newProduct.longDescription}
                        onChange={(e) => setNewProduct({ ...newProduct, longDescription: e.target.value })}
                        placeholder="ডিটেইল বর্ণনা"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Discount (%):</span>
                      <Input
                        type="number"
                        value={newProduct.discount}
                        onChange={(e) => setNewProduct({ ...newProduct, discount: Number(e.target.value) || 0 })}
                        placeholder="ডিসকাউন্ট থাকলে দিন"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Status:</span>
                      <select
                        className="border border-border rounded-md bg-background px-3 py-2 text-sm"
                        value={newProduct.status}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, status: e.target.value as "active" | "draft" })
                        }
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <span className="text-sm font-medium">Meta Description (SEO):</span>
                      <Textarea
                        value={newProduct.metaText}
                        onChange={(e) => setNewProduct({ ...newProduct, metaText: e.target.value })}
                        placeholder="SEO এর জন্য বর্ণনা"
                      />
                    </div>
                    <div className="flex gap-2 md:col-span-2 justify-end">
                      <Button variant="outline" type="button" onClick={() => setIsAddingProduct(false)}>
                        বাতিল
                      </Button>
                      <Button type="button" onClick={handleAddProduct}>
                        সেভ করুন
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {editingProduct && (
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>পণ্য এডিট করুন</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Product Name:</span>
                      <Input
                        value={editingProduct.name}
                        onChange={(e) => handleProductChange("name", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Price:</span>
                      <Input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => handleProductChange("price", Number(e.target.value) || 0)}
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
                      <span className="text-sm font-medium">Main Image:</span>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadImageToBucket(file);
                          if (url) {
                            handleProductChange("image" as any, url);
                          }
                        }}
                      />
                      {uploadingImage && <span className="text-xs text-muted-foreground">ইমেজ আপলোড হচ্ছে...</span>}
                      {editingProduct.image && (
                        <img
                          src={editingProduct.image}
                          alt={editingProduct.name}
                          className="mt-2 h-16 w-16 rounded-md object-cover border border-border"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Stock Count:</span>
                      <Input
                        type="number"
                        value={editingProduct.stock_count ?? 0}
                        onChange={(e) => handleProductChange("stock_count" as any, Number(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Short Description:</span>
                      <Textarea
                        value={editingProduct.description || ""}
                        onChange={(e) => handleProductChange("description" as any, e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Long Description:</span>
                      <Textarea
                        value={editingProduct.long_description || ""}
                        onChange={(e) => handleProductChange("long_description" as any, e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Discount (%):</span>
                      <Input
                        type="number"
                        value={editingProduct.discount ?? 0}
                        onChange={(e) => handleProductChange("discount" as any, Number(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Status:</span>
                      <select
                        className="border border-border rounded-md bg-background px-3 py-2 text-sm"
                        value={editingProduct.status || "active"}
                        onChange={(e) => handleProductChange("status" as any, e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <span className="text-sm font-medium">Meta Description (SEO):</span>
                      <Textarea
                        value={editingProduct.seo_description || ""}
                        onChange={(e) => handleProductChange("seo_description" as any, e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2 md:col-span-2 justify-end">
                      <Button variant="outline" type="button" onClick={() => setEditingProduct(null)}>
                        বাতিল
                      </Button>
                      <Button type="button" onClick={handleSaveProduct}>
                        সেভ করুন
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {activeSection === "orders" && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>অর্ডার তালিকা</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Update</TableHead>
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
                        <TableCell>{o.id}</TableCell>
                        <TableCell>{o.customer_name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              o.status === "Paid"
                                ? "secondary"
                                : o.status === "Pending"
                                  ? "outline"
                                  : o.status === "Shipped"
                                    ? "default"
                                    : "outline"
                            }
                          >
                            {o.status}
                          </Badge>
                        </TableCell>
                        <TableCell>৳{o.total_price}</TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleOrderStatusChange(o.id, "Pending")}>
                            Pending
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleOrderStatusChange(o.id, "Paid")}>
                            Paid
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleOrderStatusChange(o.id, "Shipped")}>
                            Shipped
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeSection === "settings" && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  এখানে ভবিষ্যতে অ্যাডমিন রোল, থিম ও অন্যান্য অ্যাডভান্স সেটিংস কনফিগার করতে পারবেন।
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default Admin;
