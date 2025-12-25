import QRCode from "react-qr-code";

interface TicketProps {
  orderId: string;
  customerName: string;
  weight: number;
  items: string;
  date: string;
}

export default function OrderTicket({ orderId, customerName, weight, items, date }: TicketProps) {
  return (
    <div className="bg-white p-4 border-2 border-black w-[300px] font-mono text-black mx-auto my-4 print:border-0">
      {/* HEADER */}
      <div className="text-center border-b-2 border-black pb-2 mb-2">
        <h2 className="text-2xl font-black uppercase">KILOLAB</h2>
        <p className="text-sm">Le Pressing Nouvelle Génération</p>
      </div>

      {/* INFO COMMANDE */}
      <div className="mb-4">
        <div className="flex justify-between font-bold text-lg">
          <span>CLIENT:</span>
          <span>{customerName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Date:</span>
          <span>{date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>ID:</span>
          <span>#{orderId.slice(0, 6)}</span>
        </div>
      </div>

      {/* POIDS & PRIX (Gros) */}
      <div className="border-y-2 border-black py-2 mb-4 text-center">
        <p className="text-sm uppercase">Poids Validé</p>
        <p className="text-4xl font-black">{weight} KG</p>
        <p className="text-sm mt-1">{items}</p>
      </div>

      {/* QR CODE (Pour suivi interne) */}
      <div className="flex justify-center mb-2">
        <QRCode value={`https://kilolab.fr/track/${orderId}`} size={120} />
      </div>
      <p className="text-center text-xs mb-4">Scannez pour changer le statut</p>

      {/* FOOTER */}
      <div className="text-center text-xs border-t border-dashed border-black pt-2">
        <p>Service Client: support@kilolab.fr</p>
        <p>Merci de votre confiance !</p>
      </div>
    </div>
  );
}
