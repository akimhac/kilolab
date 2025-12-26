import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Download, ArrowLeft, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Invoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('client_id', user.id)
      .single();

    if (error || !data) {
      toast.error('Commande introuvable');
      navigate('/dashboard');
      return;
    }

    setOrder(data);
    setLoading(false);
  };

  const generatePDF = async () => {
    if (!order) return;

    // Import dynamique pour réduire le bundle initial
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF();

    // Couleurs Kilolab
    const tealColor: [number, number, number] = [20, 184, 166];
    const slateColor: [number, number, number] = [100, 116, 139];

    // ====================
    // EN-TÊTE
    // ====================
    doc.setFillColor(...tealColor);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('KILOLAB', 105, 18, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Service de pressing au kilo - Lavage écologique', 105, 27, { align: 'center' });
    doc.text('www.kilolab.fr • contact@kilolab.fr', 105, 34, { align: 'center' });

    // ====================
    // INFORMATIONS FACTURE
    // ====================
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', 20, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateColor);

    // Colonne gauche
    doc.text(`N° de facture: ${order.id.slice(0, 8).toUpperCase()}`, 20, 65);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })}`, 20, 72);
    
    if (order.completed_at) {
      doc.text(`Date de livraison: ${new Date(order.completed_at).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })}`, 20, 79);
    }

    // Colonne droite - Statut
    const statusX = 140;
    if (order.status === 'completed') {
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(statusX, 60, 50, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ PAYÉE', statusX + 25, 67, { align: 'center' });
    }

    // ====================
    // ADRESSE CLIENT
    // ====================
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ADRESSE DE COLLECTE', 20, 95);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...slateColor);
    
    const address = order.pickup_address || 'Non spécifiée';
    const addressLines = doc.splitTextToSize(address, 80);
    doc.text(addressLines, 20, 103);

    // ====================
    // TABLEAU DÉTAILS
    // ====================
    const tableStartY = 120;
    
    // Calculs
    const pricePerKg = order.weight > 0 ? order.total_price / order.weight : 0;
    const htAmount = order.total_price / 1.20; // Supposant TVA 20%
    const tvaAmount = order.total_price - htAmount;

    const tableData = [
      [
        'Lavage au poids',
        `${order.weight || 0} kg`,
        `${pricePerKg.toFixed(2)} €`,
        `${htAmount.toFixed(2)} €`
      ]
    ];

    if (order.formula && order.formula !== 'Eco') {
      tableData.push([
        `Formule ${order.formula}`,
        '1',
        'Inclus',
        '-'
      ]);
    }

    autoTable(doc, {
      startY: tableStartY,
      head: [['Description', 'Quantité', 'Prix unitaire', 'Montant HT']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: tealColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [30, 41, 59]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 20, right: 20 }
    });

    // ====================
    // TOTAUX
    // ====================
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setDrawColor(...slateColor);
    doc.line(130, finalY, 190, finalY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateColor);

    doc.text('Total HT:', 130, finalY + 7);
    doc.text(`${htAmount.toFixed(2)} €`, 190, finalY + 7, { align: 'right' });

    doc.text('TVA (20%):', 130, finalY + 14);
    doc.text(`${tvaAmount.toFixed(2)} €`, 190, finalY + 14, { align: 'right' });

    // Total TTC
    doc.setDrawColor(...tealColor);
    doc.setLineWidth(0.5);
    doc.line(130, finalY + 18, 190, finalY + 18);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...tealColor);

    doc.text('TOTAL TTC:', 130, finalY + 26);
    doc.text(`${order.total_price.toFixed(2)} €`, 190, finalY + 26, { align: 'right' });

    // ====================
    // INFORMATIONS COMPLÉMENTAIRES
    // ====================
    const infoY = finalY + 40;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...slateColor);

    if (order.formula) {
      doc.text(`Formule choisie: ${order.formula}`, 20, infoY);
    }

    if (order.items) {
      doc.text(`Articles: ${order.items}`, 20, infoY + 6);
    }

    // ====================
    // PIED DE PAGE
    // ====================
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 270, 210, 27, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateColor);

    doc.text('Kilolab - Service de pressing écologique', 105, 278, { align: 'center' });
    doc.text('SIRET: 123 456 789 00012 • TVA: FR12345678900', 105, 283, { align: 'center' });
    doc.text('Merci de votre confiance ! 🌿', 105, 288, { align: 'center' });

    // ====================
    // SAUVEGARDE
    // ====================
    const fileName = `Facture-Kilolab-${order.id.slice(0, 8)}.pdf`;
    doc.save(fileName);
    
    toast.success('Facture téléchargée !');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-teal-600" size={48} />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVIGATION - masquée à l'impression */}
      <div className="print:hidden bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition"
          >
            <ArrowLeft size={20} />
            Retour au dashboard
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition flex items-center gap-2"
            >
              🖨️ Imprimer
            </button>
            <button
              onClick={generatePDF}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-500 transition flex items-center gap-2 shadow-lg shadow-teal-600/30"
            >
              <Download size={18} />
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>

      {/* FACTURE - Preview */}
      <div className="max-w-4xl mx-auto p-8 print:p-0">
        <div className="bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden">
          
          {/* EN-TÊTE */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-8 print:p-12">
            <h1 className="text-4xl font-black mb-2">KILOLAB</h1>
            <p className="text-teal-100 text-sm">Service de pressing au kilo - Lavage écologique</p>
            <p className="text-teal-100 text-sm">www.kilolab.fr • contact@kilolab.fr</p>
          </div>

          {/* CORPS */}
          <div className="p-8 print:p-12">
            
            {/* TITRE */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black mb-4">FACTURE</h2>
                <div className="space-y-1 text-sm text-slate-600">
                  <p><span className="font-bold">N° de facture:</span> {order.id.slice(0, 8).toUpperCase()}</p>
                  <p><span className="font-bold">Date:</span> {new Date(order.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                  {order.completed_at && (
                    <p><span className="font-bold">Date de livraison:</span> {new Date(order.completed_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  )}
                </div>
              </div>
              
              {order.status === 'completed' && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                  <Check size={18} />
                  PAYÉE
                </div>
              )}
            </div>

            {/* ADRESSE */}
            <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="font-bold text-sm text-slate-700 mb-2">ADRESSE DE COLLECTE</p>
              <p className="text-slate-600">{order.pickup_address || 'Non spécifiée'}</p>
            </div>

            {/* TABLEAU DÉTAILS */}
            <div className="mb-8">
              <table className="w-full">
                <thead className="bg-teal-600 text-white">
                  <tr>
                    <th className="text-left p-3 font-bold">Description</th>
                    <th className="text-right p-3 font-bold">Quantité</th>
                    <th className="text-right p-3 font-bold">Prix unitaire</th>
                    <th className="text-right p-3 font-bold">Montant HT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="p-3">Lavage au poids</td>
                    <td className="text-right p-3">{order.weight || 0} kg</td>
                    <td className="text-right p-3">{(order.total_price / order.weight).toFixed(2)} €</td>
                    <td className="text-right p-3 font-bold">{(order.total_price / 1.20).toFixed(2)} €</td>
                  </tr>
                  {order.formula && order.formula !== 'Eco' && (
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-3">Formule {order.formula}</td>
                      <td className="text-right p-3">1</td>
                      <td className="text-right p-3">Inclus</td>
                      <td className="text-right p-3">-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTAUX */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Total HT:</span>
                    <span className="font-bold">{(order.total_price / 1.20).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>TVA (20%):</span>
                    <span className="font-bold">{(order.total_price - order.total_price / 1.20).toFixed(2)} €</span>
                  </div>
                </div>
                <div className="border-t-2 border-teal-600 pt-3">
                  <div className="flex justify-between text-lg font-black text-teal-600">
                    <span>TOTAL TTC:</span>
                    <span>{order.total_price.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* INFOS COMPLÉMENTAIRES */}
            <div className="text-sm text-slate-600 space-y-2 mb-8">
              {order.formula && (
                <p>• <span className="font-bold">Formule choisie:</span> {order.formula}</p>
              )}
              {order.items && (
                <p>• <span className="font-bold">Articles:</span> {order.items}</p>
              )}
            </div>

            {/* PIED DE PAGE */}
            <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-500 space-y-1">
              <p className="font-bold">Kilolab - Service de pressing écologique</p>
              <p>SIRET: 123 456 789 00012 • TVA: FR12345678900</p>
              <p className="text-teal-600 font-bold mt-2">Merci de votre confiance ! 🌿</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}