import { useState } from "react";
import { useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, getListProductsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Plus, Pencil, Trash2 } from "lucide-react";

export default function Products() {
  const { data: products, isLoading } = useListProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Digital Product',
    inStock: true,
  });

  const handleCreate = () => {
    createProduct.mutate({
      data: newProduct
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        setIsCreateOpen(false);
        toast({ title: "Product Created" });
        setNewProduct({ name: '', description: '', price: 0, category: 'Digital Product', inStock: true });
      }
    });
  };

  const handleToggleStock = (id: number, currentStock: boolean) => {
    updateProduct.mutate({ id, data: { inStock: !currentStock } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "Stock Status Updated" });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this product?')) return;
    deleteProduct.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "Product Deleted" });
      }
    });
  };

  const formatINR = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

  if (isLoading) return <div className="animate-pulse">Loading catalog...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            Product Catalog
          </h1>
          <p className="text-muted-foreground mt-1">Manage what your avatar is selling to your followers.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0"><Plus className="h-4 w-4 mr-2"/> Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. 10x Creator Course" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Price (INR)</Label>
                <Input type="number" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="e.g. Course, Affiliate, Merch" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={newProduct.inStock} onCheckedChange={c => setNewProduct({...newProduct, inStock: c})} />
                <Label>In Stock</Label>
              </div>
              <Button onClick={handleCreate} disabled={createProduct.isPending} className="w-full">Save Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {(Array.isArray(products) ? products : []).map(product => (
          <Card key={product.id} className="bg-card/50 border-border/50 flex flex-col overflow-hidden group">
            <div className="h-32 bg-muted flex items-center justify-center border-b border-border/50 relative">
              <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                  <Badge variant="destructive">Out of Stock</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold line-clamp-1" title={product.name}>{product.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{product.category}</p>
              
              <div className="flex items-center justify-between mt-auto mb-4">
                <span className="font-bold text-primary text-lg">{formatINR(product.price)}</span>
                <span className="text-xs text-muted-foreground font-medium">{product.totalSales} Sold</span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border/50 mt-auto">
                <div className="flex items-center gap-2 flex-1">
                  <Switch checked={product.inStock} onCheckedChange={() => handleToggleStock(product.id, product.inStock)} />
                  <span className="text-xs text-muted-foreground">In Stock</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
