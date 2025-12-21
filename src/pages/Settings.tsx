import Navbar from '../components/Navbar';

export default function Settings() {
  return (
    <div className="bg-white min-h-screen pt-32 px-4 text-center">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">Mon Profil</h1>
      <p>Paramètres du compte.</p>
    </div>
  );
}
