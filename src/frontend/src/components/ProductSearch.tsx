import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Platform } from '../backend';

interface ProductSearchProps {
  onSearch: (searchTerm: string, platform: Platform | null) => void;
}

export default function ProductSearch({ onSearch }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const handleSearch = () => {
    let platformFilter: Platform | null = null;

    if (selectedPlatform !== 'all') {
      switch (selectedPlatform) {
        case 'amazon':
          platformFilter = { __kind__: 'amazon', amazon: null };
          break;
        case 'flipkart':
          platformFilter = { __kind__: 'flipkart', flipkart: null };
          break;
        case 'meesho':
          platformFilter = { __kind__: 'meesho', meesho: null };
          break;
        case 'blinkit':
          platformFilter = { __kind__: 'blinkit', blinkit: null };
          break;
      }
    }

    onSearch(searchTerm, platformFilter);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-12 text-base"
          />
        </div>

        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-full sm:w-48 h-12">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="flipkart">Flipkart</SelectItem>
            <SelectItem value="meesho">Meesho</SelectItem>
            <SelectItem value="blinkit">BlinkIt</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleSearch}
          size="lg"
          className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
