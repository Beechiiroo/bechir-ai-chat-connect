interface PerplexityAPIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class AIService {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private systemPrompt: string;

  constructor(apiKey: string, model: string = 'llama-3.1-sonar-small-128k-online', temperature: number = 0.2, systemPrompt: string = '') {
    this.apiKey = apiKey;
    this.model = model;
    this.temperature = temperature;
    this.systemPrompt = systemPrompt || 'Vous êtes Bechir AI, un assistant intelligent et serviable. Répondez de manière concise et utile en français.';
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Clé API Perplexity manquante. Veuillez la configurer dans les paramètres.');
    }

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: this.systemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: this.temperature,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          search_recency_filter: 'month',
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }

      const data: PerplexityAPIResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('Aucune réponse reçue de l\'API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('Clé API invalide. Vérifiez votre clé Perplexity dans les paramètres.');
        } else if (error.message.includes('429')) {
          throw new Error('Limite de requêtes atteinte. Veuillez réessayer plus tard.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
        }
      }
      
      throw new Error('Erreur lors de la communication avec l\'IA. Réessayez plus tard.');
    }
  }

  updateSettings(apiKey: string, model: string, temperature: number, systemPrompt: string) {
    this.apiKey = apiKey;
    this.model = model;
    this.temperature = temperature;
    this.systemPrompt = systemPrompt;
  }
}