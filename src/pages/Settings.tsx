import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Building2, DollarSign, Package, Globe } from 'lucide-react';

interface Settings {
  business_name: string;
  currency_code: string;
  currency_symbol: string;
  tax_enabled: boolean;
  default_tax_rate: number;
  low_stock_threshold: number;
  theme: string;
  language: string;
}

export function Settings() {
  const [settings, setSettings] = useState<Settings>({
    business_name: 'My POS Store',
    currency_code: 'USD',
    currency_symbol: '$',
    tax_enabled: true,
    default_tax_rate: 10,
    low_stock_threshold: 10,
    theme: 'light',
    language: 'en',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', [
          'business_name',
          'currency',
          'tax_enabled',
          'default_tax_rate',
          'low_stock_threshold',
          'theme',
          'language'
        ]);

      if (error) throw error;

      if (data) {
        const settingsMap: any = {};
        data.forEach((item) => {
          if (item.key === 'currency') {
            settingsMap.currency_code = item.value.code;
            settingsMap.currency_symbol = item.value.symbol;
          } else if (item.key === 'business_name') {
            settingsMap.business_name = item.value.value;
          } else if (item.key === 'tax_enabled') {
            settingsMap.tax_enabled = item.value.value;
          } else if (item.key === 'default_tax_rate') {
            settingsMap.default_tax_rate = item.value.value;
          } else if (item.key === 'low_stock_threshold') {
            settingsMap.low_stock_threshold = item.value.value;
          } else if (item.key === 'theme') {
            settingsMap.theme = item.value.value;
          } else if (item.key === 'language') {
            settingsMap.language = item.value.value;
          }
        });
        setSettings({ ...settings, ...settingsMap });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage('');

    try {
      const updates = [
        {
          key: 'business_name',
          value: { value: settings.business_name },
          category: 'general',
        },
        {
          key: 'currency',
          value: { code: settings.currency_code, symbol: settings.currency_symbol },
          category: 'general',
        },
        {
          key: 'tax_enabled',
          value: { value: settings.tax_enabled },
          category: 'tax',
        },
        {
          key: 'default_tax_rate',
          value: { value: settings.default_tax_rate },
          category: 'tax',
        },
        {
          key: 'low_stock_threshold',
          value: { value: settings.low_stock_threshold },
          category: 'inventory',
        },
        {
          key: 'theme',
          value: { value: settings.theme },
          category: 'appearance',
        },
        {
          key: 'language',
          value: { value: settings.language },
          category: 'general',
        },
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .upsert({
            key: update.key,
            value: update.value,
            category: update.category,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'key'
          });

        if (error) throw error;
      }

      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your POS system preferences</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Currency & Taxation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Code</label>
              <select
                value={settings.currency_code}
                onChange={(e) => {
                  const symbols: any = { USD: '$', EUR: '€', GBP: '£', PKR: '₨' };
                  setSettings({
                    ...settings,
                    currency_code: e.target.value,
                    currency_symbol: symbols[e.target.value] || '$'
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="PKR">PKR - Pakistani Rupee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tax_enabled}
                  onChange={(e) => setSettings({ ...settings, tax_enabled: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable Tax</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.default_tax_rate}
                onChange={(e) => setSettings({ ...settings, default_tax_rate: parseFloat(e.target.value) })}
                disabled={!settings.tax_enabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
            <input
              type="number"
              value={settings.low_stock_threshold}
              onChange={(e) => setSettings({ ...settings, low_stock_threshold: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Products below this quantity will show low stock alerts</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
