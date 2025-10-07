export interface DisplayMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface Product {
    name: string;
    description: string;
    url: string;
    category: string;
}
