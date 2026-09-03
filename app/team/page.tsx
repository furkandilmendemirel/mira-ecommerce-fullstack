const team = [
  {
    name: "Ece Aydın",
    role: "Kurucu & Kreatif Direktör",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Mert Yalın",
    role: "Ürün ve Operasyon",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Selin Demir",
    role: "Marka ve Topluluk",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  },
];

export default function TeamPage() {
  return (
    <main className="team-page page-shell">
      <div className="page-title centered">
        <span className="eyebrow">MIRA EKİBİ</span>
        <h1>Birlikte daha iyi fikirler üretiyoruz.</h1>
        <p>Tasarım, teknoloji ve iyi bir müşteri deneyimi için aynı masadayız.</p>
      </div>
      <div className="team-grid">
        {team.map((person) => (
          <article key={person.name}>
            <img src={person.image} alt={person.name} />
            <h2>{person.name}</h2>
            <p>{person.role}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

