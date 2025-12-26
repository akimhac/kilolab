import toast from 'react-hot-toast';

interface Order {
  id: string;
  created_at: string;
  completed_at?: string;
  pickup_address?: string;
  weight: number;
  total_price: number;
  formula?: string;
  items?: string;
  status: string;
}

export const useInvoiceGenerator = () => {
  
  const generateClientInvoice = async (order: Order) => {
    try {
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

      // Statut
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
      
      const pricePerKg = order.weight > 0 ? order.total_price / order.weight : 0;
      const htAmount = order.total_price / 1.20; // TVA 20%
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
      return true;
      
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
      return false;
    }
  };

  return {
    generateClientInvoice
  };
};