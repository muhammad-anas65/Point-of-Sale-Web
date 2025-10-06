import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, Minus, Trash2, ShoppingCart, User, DollarSign } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  selling_price: number;
  tax_rate: number;
  stock_quantity: number;
}

interface CartItem extends Product {
  quantity: number;
  total: number;
}

export function SalesRegister() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, sku, name, selling_price, tax_rate, stock_quantity')
        .eq('is_active', true)
        .gt('stock_quantity', 0)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock_quantity) {
        alert('Not enough stock available');
        return;
      }
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        ...product,
        quantity: 1,
        total: product.selling_price * (1 + product.tax_rate / 100),
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity > product.stock_quantity) {
      alert('Not enough stock available');
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity, total: item.selling_price * quantity * (1 + item.tax_rate / 100) }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
    const taxAmount = cart.reduce((sum, item) =>
      sum + (item.selling_price * item.quantity * item.tax_rate / 100), 0
    );
    const discountAmount = (subtotal + taxAmount) * (discount / 100);
    const total = subtotal + taxAmount - discountAmount;

    return { subtotal, taxAmount, discountAmount, total };
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    setLoading(true);

    try {
      const totals = calculateTotals();
      const invoiceNumber = `INV-${Date.now()}`;

      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          invoice_number: invoiceNumber,
          customer_id: selectedCustomer,
          cashier_id: user?.id,
          subtotal: totals.subtotal,
          tax_amount: totals.taxAmount,
          discount_amount: totals.discountAmount,
          total_amount: totals.total,
          payment_method: paymentMethod,
          payment_status: 'paid',
          sale_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (saleError) throw saleError;

      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.selling_price,
        tax_rate: item.tax_rate,
        tax_amount: (item.selling_price * item.quantity * item.tax_rate) / 100,
        discount_amount: 0,
        total_amount: item.total,
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      for (const item of cart) {
        const { error: stockError } = await supabase
          .from('products')
          .update({
            stock_quantity: item.stock_quantity - item.quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);

        if (stockError) throw stockError;
      }

      alert(`Sale completed! Invoice: ${invoiceNumber}`);
      setCart([]);
      setDiscount(0);
      setSelectedCustomer(null);
      loadProducts();
    } catch (error: any) {
      console.error('Error completing sale:', error);
      alert('Failed to complete sale: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totals = calculateTotals();

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Sales Register</h1>
        <p className="text-gray-600 mt-1">Process customer transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-5rem)]">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name or SKU..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{product.sku}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    ${product.selling_price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Stock: {product.stock_quantity}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <ShoppingCart className="w-5 h-5" />
              Cart ({cart.length})
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">${item.selling_price.toFixed(2)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-gray-900">${item.total.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${totals.taxAmount.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discount}%):</span>
                  <span className="font-medium">-${totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={completeSale}
              disabled={loading || cart.length === 0}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
