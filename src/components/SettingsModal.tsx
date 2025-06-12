import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Settings, User, Bot, Palette, Bell, Key, Upload } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: UserSettings) => void;
  currentSettings: UserSettings;
}

export interface UserSettings {
  profile: {
    name: string;
    avatar?: string;
    status: string;
  };
  ai: {
    perplexityApiKey: string;
    elevenLabsApiKey: string;
    model: string;
    temperature: number;
    systemPrompt: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    soundEffects: boolean;
    voiceInput: boolean;
    autoSpeech: boolean;
  };
}

export function SettingsModal({ isOpen, onClose, onSave, currentSettings }: SettingsModalProps) {
  const [settings, setSettings] = useState<UserSettings>(currentSettings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const updateSettings = (path: string[], value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      let current = newSettings as any;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      
      return newSettings;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Paramètres de Bechir AI</CardTitle>
          </div>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[70vh]">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profil</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center space-x-2">
                <Bot className="h-4 w-4" />
                <span>IA</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Préférences</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profil utilisateur</h3>
                
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={settings.profile.avatar} />
                    <AvatarFallback>{settings.profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Changer l'avatar</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nom d'utilisateur</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => updateSettings(['profile', 'name'], e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Input
                    id="status"
                    value={settings.profile.status}
                    onChange={(e) => updateSettings(['profile', 'status'], e.target.value)}
                    placeholder="Votre statut personnalisé"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configuration IA</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="perplexity-key" className="flex items-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span>Clé API Perplexity</span>
                  </Label>
                  <Input
                    id="perplexity-key"
                    type="password"
                    value={settings.ai.perplexityApiKey}
                    onChange={(e) => updateSettings(['ai', 'perplexityApiKey'], e.target.value)}
                    placeholder="pplx-..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Obtenez votre clé sur perplexity.ai pour activer l'IA
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-key" className="flex items-center space-x-2">
                    <Key className="h-4 w-4" />
                    <span>Clé API ElevenLabs</span>
                  </Label>
                  <Input
                    id="elevenlabs-key"
                    type="password"
                    value={settings.ai.elevenLabsApiKey}
                    onChange={(e) => updateSettings(['ai', 'elevenLabsApiKey'], e.target.value)}
                    placeholder="sk-..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Pour la synthèse vocale (optionnel)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Modèle IA</Label>
                  <Select 
                    value={settings.ai.model} 
                    onValueChange={(value) => updateSettings(['ai', 'model'], value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llama-3.1-sonar-small-128k-online">Llama 3.1 Small (Rapide)</SelectItem>
                      <SelectItem value="llama-3.1-sonar-large-128k-online">Llama 3.1 Large (Équilibré)</SelectItem>
                      <SelectItem value="llama-3.1-sonar-huge-128k-online">Llama 3.1 Huge (Puissant)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Créativité (Temperature): {settings.ai.temperature}</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.ai.temperature}
                    onChange={(e) => updateSettings(['ai', 'temperature'], parseFloat(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Précis</span>
                    <span>Créatif</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-prompt">Prompt système</Label>
                  <Textarea
                    id="system-prompt"
                    value={settings.ai.systemPrompt}
                    onChange={(e) => updateSettings(['ai', 'systemPrompt'], e.target.value)}
                    placeholder="Instructions pour l'IA..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Préférences d'affichage</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Thème</Label>
                    <p className="text-sm text-muted-foreground">Apparence de l'application</p>
                  </div>
                  <Select 
                    value={settings.preferences.theme} 
                    onValueChange={(value: 'light' | 'dark' | 'auto') => updateSettings(['preferences', 'theme'], value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Effets sonores</Label>
                    <p className="text-sm text-muted-foreground">Sons de notification</p>
                  </div>
                  <Switch
                    checked={settings.preferences.soundEffects}
                    onCheckedChange={(checked) => updateSettings(['preferences', 'soundEffects'], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Entrée vocale</Label>
                    <p className="text-sm text-muted-foreground">Utiliser le microphone</p>
                  </div>
                  <Switch
                    checked={settings.preferences.voiceInput}
                    onCheckedChange={(checked) => updateSettings(['preferences', 'voiceInput'], checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lecture automatique</Label>
                    <p className="text-sm text-muted-foreground">Lire les réponses à voix haute</p>
                  </div>
                  <Switch
                    checked={settings.preferences.autoSpeech}
                    onCheckedChange={(checked) => updateSettings(['preferences', 'autoSpeech'], checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifications push</Label>
                    <p className="text-sm text-muted-foreground">Recevoir des notifications</p>
                  </div>
                  <Switch
                    checked={settings.preferences.notifications}
                    onCheckedChange={(checked) => updateSettings(['preferences', 'notifications'], checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              Sauvegarder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}