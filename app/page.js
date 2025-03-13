"use client";
import FriendshipGenerator from './components/FriendshipGenerator';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Friendship Ended Generator</h1>
        <p className="text-lg">
          Dedicated to the <a 
            href="http://internet.gawker.com/facebook-user-asif-ends-friendship-with-mudasir-welc-1731160013" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            new friendship of ASIF and SALMAN
          </a>.
        </p>
      </div>
      <p className="mb-4 italic">(All fields are required. Just like in <strong>friendship</strong>...)</p>
      
      <FriendshipGenerator />
    </main>
  );
}