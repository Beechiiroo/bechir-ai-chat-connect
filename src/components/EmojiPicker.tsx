import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const emojiCategories = {
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎"],
  "Emotions": ["🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧"],
  "Gestures": ["👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦾", "🦿", "🦵", "🦶"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️"],
  "Objects": ["🎉", "🎊", "🎈", "🎁", "🎀", "🎂", "🍰", "🧁", "🍭", "🍬", "🍫", "🍩", "🍪", "☕", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧃", "🥤", "🧋", "🚗", "✈️", "🏠", "💻"]
};

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  return (
    <Card className="w-80 h-64 p-4 border shadow-lg z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">Emojis</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      
      <div className="overflow-y-auto h-48">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category} className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">{category}</h4>
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSelect(emoji)}
                  className="p-2 hover:bg-muted rounded transition-colors text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}