import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IconMap } from '@/components/ui/icons';

interface ConfigSectionProps {
  title: string;
  data: unknown;
  onUpdate: (value: unknown) => void;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ title, data, onUpdate }) => {
  const [editedData, setEditedData] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const handleInputChange = (path: string[], value: unknown) => {
    // Create a deep clone of editedData to avoid mutating state directly
    const newData = JSON.parse(JSON.stringify(editedData));
    let current = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]] as Record<string, unknown>;
    }
    current[path[path.length - 1]] = value;
    
    setEditedData(newData);
  };

  const renderField = (key: string, value: unknown, path: string[] = []) => {
    if (value === null || value === undefined) return null;

    if (Array.isArray(value)) {
      return (
        <div key={key} className="space-y-2">
          <Label>{key}</Label>
          <div className="space-y-2">
            {value.map((item, index) => (
              <div key={index} className="pl-4 border-l-2 border-border">
                {typeof item === 'object' ? (
                  Object.entries(item).map(([itemKey, itemValue]) => 
                    renderField(itemKey, itemValue, [...path, key, index.toString(), itemKey])
                  )
                ) : (
                  <Input
                    value={item}
                    onChange={(e) => handleInputChange([...path, key, index.toString()], e.target.value)}
                  />
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newValue = [...value];
                newValue.push(typeof value[0] === 'object' ? {} : '');
                handleInputChange([...path, key], newValue);
              }}
            >
              Add Item
            </Button>
          </div>
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div key={key} className="space-y-4">
          <Label className="text-lg font-semibold">{key}</Label>
          <div className="pl-4 space-y-4 border-l-2 border-border">
            {Object.entries(value).map(([subKey, subValue]) => 
              renderField(subKey, subValue, [...path, key])
            )}
          </div>
        </div>
      );
    }

    if (key === 'icon' && typeof value === 'string') {
      const Icon = IconMap[value as keyof typeof IconMap];
      return (
        <div key={key} className="space-y-2">
          <Label>{key}</Label>
          <div className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(e) => handleInputChange([...path, key], e.target.value)}
            />
            {Icon && <Icon className="w-5 h-5" />}
          </div>
        </div>
      );
    }

    if (typeof value === 'string' && value.length > 50) {
      return (
        <div key={key} className="space-y-2">
          <Label>{key}</Label>
          <Textarea
            value={value}
            onChange={(e) => handleInputChange([...path, key], e.target.value)}
          />
        </div>
      );
    }

    return (
      <div key={key} className="space-y-2">
        <Label>{key}</Label>
        <Input
          value={String(value)}
          onChange={(e) => handleInputChange([...path, key], e.target.value)}
        />
      </div>
    );
  };

  const handleSave = () => {
    onUpdate(editedData);
    setIsEditing(false);
  };

  return (
    <Card className='w-full'>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => {
                setEditedData(data);
                setIsEditing(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-6">
            {Object.entries(editedData as Record<string, unknown>).map(([key, value]) => 
              renderField(key, value)
            )}
          </div>
        ) : (
          <pre className="p-4 bg-muted rounded-lg overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfigSection; 