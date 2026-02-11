export interface User {
    id: number;
    name: string;
    age: number;
    location: string;
    gender: string;
    orientation: string;
    image: string;
    photos: string[];
    bio: string;
    interests: string[];
    divergentTraits: string[];
    communicationStyle: string[];
}

export const MOCK_USERS: User[] = [
    {
        id: 1,
        name: "Lucila López",
        age: 29,
        location: "Sevilla",
        gender: "Mujer",
        orientation: "Lesbiana",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        photos: [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        bio: "Hola! ✌️ Estoy soltera desde hace poco y he empezado un nuevo camino para encontrarme a mí misma. Me cuesta un poco entrar en confianza, pero una vez lo hago, soy muy divertida.",
        interests: ["Fotografía", "Montaña", "Senderismo", "Feminismo", "Cine"],
        divergentTraits: ["Autismo", "Bipolar", "Evitación social"],
        communicationStyle: ["Memes", "Mensaje de texto", "Conversación casual"]
    },

    {
        id: 2,
        name: "Marc",
        age: 27,
        location: "Barcelona",
        gender: "Hombre",
        orientation: "Gay",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        photos: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ],
        bio: "Programador de día, gamer de noche. Mi lenguaje del amor es el info-dumping sobre historia romana.",
        interests: ["Tech", "Videojuegos", "Historia", "Cosplay"],
        divergentTraits: ["ADHD", "Hiperfoco"],
        communicationStyle: ["Directo", "Audio largo", "Info-dumping"]
    },
];