import Navbar from '../components/Navbar';

export default function ScanQR() {
  return (
    <div className="bg-black min-h-screen pt-32 px-4 text-center text-white">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">Scanner QR</h1>
      <p>Fonctionnalité caméra en approche.</p>
    </div>
  );
}
