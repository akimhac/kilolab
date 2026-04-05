// French + Belgian Address Autocomplete
import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X, AlertCircle } from 'lucide-react';

export type AddressSuggestion = {
  label: string;
  housenumber?: string;
  street?: string;
  postcode: string;
  city: string;
  context: string;
  coordinates: [number, number];
  country: 'FR' | 'BE';
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: AddressSuggestion) => void;
  onValidChange?: (isValid: boolean) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  onValidChange,
  placeholder = "Entrez votre adresse (France / Belgique)",
  className = "",
  required = false,
}: Props) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch from French API
  const fetchFrenchSuggestions = async (query: string): Promise<AddressSuggestion[]> => {
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5&autocomplete=1`
      );
      const data = await response.json();
      return (data.features || []).map((f: any) => ({
        label: f.properties.label,
        housenumber: f.properties.housenumber,
        street: f.properties.street,
        postcode: f.properties.postcode,
        city: f.properties.city,
        context: f.properties.context,
        coordinates: f.geometry.coordinates,
        country: 'FR' as const,
      }));
    } catch { return []; }
  };

  // Fetch from Belgium API (Nominatim OSM)
  const fetchBelgianSuggestions = async (query: string): Promise<AddressSuggestion[]> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=be&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'fr' } }
      );
      const data = await response.json();
      return data.map((r: any) => ({
        label: r.display_name?.split(',').slice(0, 3).join(',') || r.display_name,
        housenumber: r.address?.house_number,
        street: r.address?.road,
        postcode: r.address?.postcode || '',
        city: r.address?.city || r.address?.town || r.address?.village || '',
        context: `Belgique${r.address?.state ? ` - ${r.address.state}` : ''}`,
        coordinates: [parseFloat(r.lon), parseFloat(r.lat)],
        country: 'BE' as const,
      }));
    } catch { return []; }
  };

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const [fr, be] = await Promise.all([
        fetchFrenchSuggestions(query),
        fetchBelgianSuggestions(query),
      ]);
      const results = [...fr, ...be].slice(0, 7);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setSelectedIndex(-1);
    // Invalidate when user types (must re-select from suggestions)
    setIsValidAddress(false);
    onValidChange?.(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(newValue), 300);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    onChange(suggestion.label);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsValidAddress(true);
    onValidChange?.(true);
    onSelect?.(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) handleSelect(suggestions[selectedIndex]);
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isValidAddress ? 'text-emerald-500' : 'text-slate-400'}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-11 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white ${
            value && !isValidAddress ? 'border-orange-300' : isValidAddress ? 'border-emerald-300' : 'border-slate-200'
          } ${className}`}
          data-testid="address-input"
        />
        {loading && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500 animate-spin" />}
        {!loading && value && (
          <button type="button" onClick={() => { onChange(''); setSuggestions([]); setIsValidAddress(false); onValidChange?.(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Validation hint */}
      {value && !isValidAddress && !showSuggestions && !loading && value.length >= 3 && (
        <div className="flex items-center gap-1.5 mt-1.5 text-orange-500 text-xs">
          <AlertCircle size={12} />
          <span>Selectionnez une adresse dans la liste</span>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-[280px] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(suggestion)}
              className={`w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-slate-50 transition ${index === selectedIndex ? 'bg-teal-50' : ''}`}
            >
              <MapPin size={16} className={`mt-0.5 shrink-0 ${suggestion.country === 'BE' ? 'text-amber-500' : 'text-teal-500'}`} />
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">{suggestion.label}</p>
                <p className="text-xs text-slate-500">{suggestion.context} {suggestion.country === 'BE' ? '(Belgique)' : ''}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && value.length >= 3 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center">
          <AlertCircle size={20} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm text-slate-500">Aucune adresse trouvee</p>
          <p className="text-xs text-slate-400 mt-1">Verifiez l'orthographe ou ajoutez plus de details</p>
        </div>
      )}
    </div>
  );
}
